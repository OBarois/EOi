import { useState, useRef, useContext } from "react";
import dhusToGeojson from "./dhusToGeojson";
import eocatToGeojson from "./eocatToGeojson"
import rsstacToGeojson from "./rsstacToGeojson"
import CDSEOdataToGeojson from "./CDSEOdataToGeojson"
import PRIPToGeojson from "./PRIPToGeojson"
import LTAToGeojson from "./LTAToGeojson"
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
    const [status, setStatus] = useState(-1) // not really a status. changes whenever a 401 occurs`
    // const [token,setToken] = useState(null)
    const [ state, dispatch ] = useContext(AppContext)

    const token = useRef(null)



    const getcredential = (key) => {
        for(let i=0; i < state.credentials.length; i++) {
            if(state.credentials[i].key === key) {
                return {user:state.credentials[i].user,pass:state.credentials[i].pass}
            }
        }
        return {user:"",pass:""}
    }

    const getServerUrl = (url) => {
        return url.split("/")[2]
    }

    const buildUrl = ({dataset, polygon, start, end, freetext }) => {

            console.log(start+'   /   '+end)

        // let target = getcollection(code)
        if(!dataset) return null
        let newurl = dataset.templateUrl

        if(polygon != null) {
            newurl = newurl.replace("{polygon}", polygon)
        } else {
            newurl = newurl.replace(dataset.areaOff, '')
        }

        if (start != null  && end != null) {
            newurl = newurl.replace("{start}", start)
            newurl = newurl.replace("{end}", end)
        } else {
            newurl = newurl.replace(dataset.dateOff, '')
        }

        if (freetext != null && freetext != '') {
            newurl = newurl.replace("{freetext}", freetext)
        } else {
            newurl = newurl.replace("{freetext}", dataset.defaultFreetext)
        }
        
        // startindex = startindex == 0 ? startindex : startindex + target.startIndexOrigin
        // newurl = newurl.replace("{startindex}",target.startIndexOrigin)


        return newurl
    }


    const get_token = (tokenendpoint, granttype, user, pass) => {
        let oauth2
        try {
            switch(granttype) {
                case "client_credentials":                    
                    return oauth2 = new OAuth2({
                        grantType: 'client_credentials',
                        clientId: user,
                        clientSecret: pass,
                        tokenEndpoint: tokenendpoint,                    
                    })
                    break
                case 'password':
                    console.log('password!!!')
                    return oauth2 = new OAuth2({
                        grantType: 'password',
                        clientId: "cdse-public",
                        clientSecret: '',
                        userName: user,
                        password: pass,
                        tokenEndpoint: tokenendpoint,                    
                    })
                    break
                default:
                    return oauth2 = new OAuth2({
                        grantType: 'client_credentials',
                        clientId: user,
                        clientSecret: pass,
                        tokenEndpoint: tokenendpoint,                    
                    })
                    break
            }
        }
        catch (err) {
            setLoading(false)
            token.current = null
            dispatch({ type: "set_token", value: null})
            console.log('token error')
            console.log(err)
            throw new Error(`401`)
        }
    }

    const fetchURL = async (url,index,target,user,pass) => {
        setLoading(true)
        controller.current = new AbortController()
        let newurl = url
        newurl = newurl.replace("{startindex}",index)
        console.log('Search: '+newurl)
        let paging = {totalresults:0, startindex:0, itemsperpage:0}

        try {
            let response
            if(target.type == 'PRIP' || target.type == 'STAC' || target.type == "CDSE" || target.type == "CDSEOdata") {
                let oauth2
                if(!token.current) {
                    token.current = get_token(target.tokenEndpoint, target.grantType, user, pass)
                    dispatch({ type: "set_token", value: token.current})
                }
                
                try {
                    response = await token.current.fetch(newurl, 
                        {
                        mode: 'cors', 
                        credentials: 'include', 
                        signal: controller.current.signal
                        })
                }
                catch(err) {
                    console.log(err)
                    // token.current = null
                    throw new Error(err)
                }


                if (!response.ok) {
                    // window.alert(`HTTP error! status: ${response.status}`)
                    // if(response.status == '401' || response.status == '400') {
                    if(response.status == '401') {
                            setStatus(Math.random())
                        // dispatch({ type: "reset_credentials", value: {}})
                    }
                    throw new Error(`HTTP error! status: ${response.status}`)
                }
            }
    
            if(target.type != 'PRIP' && target.type != 'STAC' && target.type != 'CDSE'  && target.type != 'CDSEOdata') {
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
                console.log(json)

                let geoJson
                // console.log(coll_type)
                switch(target.type) {
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
                    case "STAC":
                        console.log("STAC")
                        geoJson = rsstacToGeojson(json,index)
                        break;
                    case "CDSEOdata":
                        console.log("CDSEOdata")
                        geoJson = CDSEOdataToGeojson(json,index)
                        break;
                    case "LTA":
                        console.log("LTA")
                        geoJson = LTAToGeojson(json,index)
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
                    fetchURL(url,(paging.startindex + paging.itemsperpage),target,user,pass)
                } else {
                    console.log("Finished...")  

                    token.current = null
                    dispatch({ type: "set_token", value: null})
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
                token.current = null
                dispatch({ type: "set_token", value: null})
                setStatus(Math.random())
            }
            setLoading(false)   
        }
    }

    const abort = () => {
        if(controller && controller.current) {
            controller.current.abort()
        }
    }



    const search = ({searchdate, dataset, freetext, searchpoint, windowSize}) => {
        console.log(dataset)
        //  console.log(searchdate+' / '+ dataset+' / '+ searchpoint)
        // console.log(credentials) 
        let startdate, enddate = ''
        // let target = getcollection(dataset)
        
        if(!dataset) {
            console.log('No dataset to search')
            return null
        }

        if(loading) controller.current.abort()


        if(searchdate) {
            // let windowSize = state.searchWindow
            // let windowSize = target.windowSize
            console.log('start date: '+searchdate)
            console.log('windowSize: '+windowSize)
            let julianstart = Math.floor(searchdate.getTime()/windowSize) * windowSize
            startdate = (new Date(julianstart)).toJSON()
            enddate = (new Date(julianstart + windowSize - 1000)).toJSON()
            // startdate = (new Date(searchdate.getTime() - offset)).toJSON()
            console.log('start date: '+searchdate)
            
            // enddate = (new Date(searchdate.getTime() + offset - 1000)).toJSON()
        }
        let url = buildUrl({
            dataset: dataset,
            polygon: searchpoint, 
            start: startdate,
            end: enddate,
            freetext: freetext
        })
        // searchparam.current.searchdate = searchdate
        // searchparam.current.dataset = dataset
        // searchparam.current.searchpoint = searchpoint

        let startindex = dataset.startIndexOrigin

        let tokenendpoint = dataset.tokenEndpoint

        let credential = getcredential(url.split("/")[2])


        fetchURL(url,startindex,dataset,credential.user,credential.pass,tokenendpoint)
        
    }
    


    return {geojsonResults, loading, status, search, abort}
}
