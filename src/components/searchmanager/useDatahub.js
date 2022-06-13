import { useState, useRef, useContext } from "react";
import dhusToGeojson from "./dhusToGeojson";
import eocatToGeojson from "./eocatToGeojson"
import PRIPToGeojson from "./PRIPToGeojson"
import OAuth2 from "fetch-mw-oauth2"
import {AppContext} from '../app/context'

// export default function useDatahub({searchdate, mission, searchpoint})  {
export default function useDatahub()  {

    const searchparam = useRef({})
    const controller = useRef(null)

    const MAX_ITEMS = 1000

    const [geojsonResults, setGeojsonResults] = useState(null)
    const [loading, setLoading] = useState(false)
    const [credentials,setCredentials] = useState('')
    const [ state, dispatch ] = useContext(AppContext)


    const getcollection = (code) => {
        for(let i=0; i < state.collections.length; i++) {
            if(state.collections[i].code === code) {
                return state.collections[i]
            }
        }
        return null
    }

    const getServerUrl = (url) => {
        return url.split("/")[2]
    }

    const buildUrl = ({code, polygon, start, end, startindex}) => {

        console.log(polygon)

        let target = getcollection(code)
        if(!target) return null
        let newurl = target.templateUrl

        if(polygon != null) {
            newurl = newurl.replace("{polygon}", polygon)
        } else {
            console.log("in: "+polygon)
            newurl = newurl.replace(target.areaOff, '')
        }

        if (start != null  && end != null) {
            newurl = newurl.replace("{start}", start)
            newurl = newurl.replace("{end}", end)
        } else {
            newurl = newurl.replace(target.dateOff, '')
        }
        
        // startindex = startindex == 0 ? startindex : startindex + target.startIndexOrigin
        // newurl = newurl.replace("{startindex}",target.startIndexOrigin)


        return newurl
    }

    const fetchURL = async (url,index,coll_type,user,pass) => {
        setLoading(true)
        controller.current = new AbortController()
        let newurl = url
        newurl = newurl.replace("{startindex}",index)
        // console.log('Search: '+newurl)
        let paging = {totalresults:0, startindex:0, itemsperpage:0}
        console.log(coll_type)

        try {
            let response
            if(coll_type == 'PRIP') {

                const oauth2 = new OAuth2({
                    grantType: 'password',
                    // clientId: 'admin-cli',
                    clientId: 's1pro-user-web-client',
                    userName: user,
                    password: pass,
                    clientSecret: '',
                    tokenEndpoint: 'https:/iam.platform.ops-csc.com/auth/realms/RS/protocol/openid-connect/token',
                  })
        

                response = await oauth2.fetch(newurl, 
                    {
                    mode: 'cors', 
                    credentials: 'include', 
                    signal: controller.current.signal
                    })
                    console.log(response)
                if (!response.ok) {
                    window.alert(`HTTP error! status: ${response.status}`)
                    throw new Error(`HTTP error! status: ${response.status}`)
                }
            }
    
            if(coll_type != 'PRIP') {
                response = await fetch(newurl, 
                    {
                    mode: 'cors', 
                    credentials: 'include', 
                    headers: {
                        "Content-Type": "text/plain",
                        'Authorization': 'Basic ' + window.btoa(user+":"+pass),
                    },
                    signal: controller.current.signal
                    })
                if (!response.ok) {
                    window.alert(`HTTP error! status: ${response.status}`)
                    throw new Error(`HTTP error! status: ${response.status}`)
                }
            }
    
        
            try {
                const json = await response.json()

                let geoJson
                // console.log(coll_type)
                switch(coll_type) {
                    case "DHUS":
                        console.log( "DHUS")
                        geoJson = dhusToGeojson(json)
                        break;
                    case "PRIP":
                        console.log("PRIP")
                        geoJson = PRIPToGeojson(json,index)
                        break;
                    case "EOCAT":
                        console.log("EOCAT")
                        geoJson = eocatToGeojson(json)
                        break;
                    default:
                        setLoading(false)
                        
    
                }

                // console.log('totalResults: ' + geoJson.properties.totalResults)
                paging = {
                    totalresults: geoJson.properties.totalResults == null ? 0 : Number(geoJson.properties.totalResults) ,
                    startindex:  Number(geoJson.properties.startIndex), 
                    itemsperpage:  Number(geoJson.properties.itemsPerPage)
                }
                console.log(paging)

                // setPagination(paging)
                if(paging.totalresults>0) setGeojsonResults(geoJson) 

                if (paging.startindex + paging.itemsperpage < Math.min(paging.totalresults,MAX_ITEMS) ) {
                    console.log("There's More...")  
                    // uncomment to get other pages
                    fetchURL(url,(paging.startindex + paging.itemsperpage),coll_type,user,pass)
                } else {
                    setLoading(false)  
                }

            } catch (err) {
                console.log("Didn't receive a json !")
                console.log(err)
                setLoading(false);
            }
        } catch(err) {
            console.log("Error contacting server...")
            console.log(err)
            setLoading(false)   
        }
    }

    const abort = () => {
        if(controller) {
            controller.current.abort()
        }
    }

    const search = ({searchdate, mission, searchpoint}) => {
        let startdate, enddate = ''
        let target = getcollection(mission)
        if(!target) return null

        if(loading) controller.current.abort()
        if(searchdate) {
            let julianstart = Math.floor(searchdate.getTime()/target.windowSize) * target.windowSize
            startdate = (new Date(julianstart)).toJSON()
            enddate = (new Date(julianstart + target.windowSize - 1000)).toJSON()
            // startdate = (new Date(searchdate.getTime() - offset)).toJSON()
            // // console.log('start date: '+startdate)
            
            // enddate = (new Date(searchdate.getTime() + offset - 1000)).toJSON()
        }
        let url = buildUrl({
            code: mission,
            polygon: searchpoint, 
            start: startdate,
            end: enddate
        })
        let coll_type = target.type
        searchparam.current.searchdate = searchdate
        searchparam.current.mission = mission
        searchparam.current.searchpoint = searchpoint

        let startindex = target.startIndexOrigin

        // get credentials
        if(state.credentials == '' || !state.credentials) {
            let user = window.prompt("Please enter your username for \n"+url.split("/")[2],"")
            let pass = window.prompt("Please enter your password for \n"+url.split("/")[2],"")
            dispatch({ type: "set_credentials", value: user+":"+pass})
            return
        }

        fetchURL(url,startindex,coll_type,state.credentials.split(":")[0],state.credentials.split(":")[1])
        
    }
    


    return {geojsonResults, loading, search, abort}
}
