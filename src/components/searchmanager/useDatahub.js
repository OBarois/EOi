import { useState, useRef, useContext } from "react";
import dhusToGeojson from "./dhusToGeojson";
import eocatToGeojson from "./eocatToGeojson"
import PRIPToGeojson from "./PRIPToGeojson"
import OAuth2 from "fetch-mw-oauth2"
// to be done: use OAuth2Client instead of OAuth2
//import { OAuth2Client, OAuth2Fetch } from '@badgateway/oauth2-client'    
import {AppContext} from '../app/context'

// export default function useDatahub({searchdate, dataset, searchpoint})  {
export default function useDatahub()  {

    // const searchparam = useRef({})
    const controller = useRef(null)

    const MAX_ITEMS = 1000

    const [geojsonResults, setGeojsonResults] = useState(null)
    const [loading, setLoading] = useState(false)
    const [status, setStatus] = useState('')
    const [credentials,setCredentials] = useState(null)
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


        let target = getcollection(code)
        if(!target) return null
        let newurl = target.templateUrl

        if(polygon != null) {
            newurl = newurl.replace("{polygon}", polygon)
        } else {
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
                let oauth2 = null
                console.log(credentials)
                if(!credentials) {
                    console.log(user)
                    try {
                        oauth2 = new OAuth2({
                            // grantType: 'password',
                            grantType: 'client_credentials',
                            // grantType: 'authorization_code',
                            // userName: user,
                            // password: pass,
                            clientId: user,
                            clientSecret: pass,
                            // clientSecret: '',
                            tokenEndpoint: 'https://iam.platform.ops-csc.com/auth/realms/RS/protocol/openid-connect/token',                    
                        })
                        console.log(oauth2)
                        setCredentials(oauth2)
                    }
                    catch (err) {
                        setLoading(false)
                        setCredentials(null)
                        throw new Error(`401`)
                    }
                    
                } else {
                    oauth2 = credentials
                }
                
                try {
                    response = await oauth2.fetch(newurl, 
                        {
                        mode: 'cors', 
                        credentials: 'include', 
                        signal: controller.current.signal
                        })
                    console.log(response)
                }
                catch(err) {
                    console.log(err)
                    setCredentials(null)
                    throw new Error(`401`)
                }


                if (!response.ok) {
                    // window.alert(`HTTP error! status: ${response.status}`)
                    if(response.status == '401' || response.status == '400') {
                        setStatus(newurl)
                        // dispatch({ type: "reset_credentials", value: {}})
                    }
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
                    // window.alert(`HTTP error! status: ${response.status}`)
                    if(response.status == 401) {
                        // setStatus(newurl)
                        throw new Error('401')
                    } else {
                        throw new Error(`HTTP error! status: ${response.status}`)
                    }
                    
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
            console.log(err.message)
            if(err.message === '401' || err.message.indexOf('Invalid user credentials') > 0) {
                console.log('detected 401')
                setStatus(url)
            }
            setLoading(false)   
        }
    }

    const abort = () => {
        if(controller && controller.current) {
            controller.current.abort()
        }
    }

    const search = ({searchdate, dataset, searchpoint}, credentials) => {
        // console.log(' in search')
        // console.log(searchdate+' / '+ dataset+' / '+ searchpoint)
        // console.log(credentials)
        let startdate, enddate = ''
        let target = getcollection(dataset)
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
            code: dataset,
            polygon: searchpoint, 
            start: startdate,
            end: enddate
        })
        let coll_type = target.type
        // searchparam.current.searchdate = searchdate
        // searchparam.current.dataset = dataset
        // searchparam.current.searchpoint = searchpoint

        let startindex = target.startIndexOrigin


        fetchURL(url,startindex,coll_type,credentials.user,credentials.pass)
        
    }
    


    return {geojsonResults, loading, status, search, abort}
}
