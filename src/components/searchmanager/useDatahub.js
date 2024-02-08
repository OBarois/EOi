import { useState, useRef, useContext } from "react";
import dhusToGeojson from "./dhusToGeojson";
import eocatToGeojson from "./eocatToGeojson"
import rsstacToGeojson from "./rsstacToGeojson"
import CDSEOdataToGeojson from "./CDSEOdataToGeojson"
import CDSEStacToGeojson from "./CDSEStacToGeojson"
import PRIPToGeojson from "./PRIPToGeojson"
import LTAToGeojson from "./LTAToGeojson"
// import OAuth2 from "fetch-mw-oauth2"
// to be done: use OAuth2Client instead of OAuth2
import { OAuth2Client, OAuth2Fetch } from '@badgateway/oauth2-client'    
import {AppContext} from '../app/context'
import useFetcher  from '../../hooks/useFetcher';


// export default function useDatahub({searchdate, dataset, searchpoint})  {
export default function useDatahub()  {

    // const searchparam = useRef({})
    const controller = useRef(null)

    const MAX_ITEMS = 1000
    const PAGE_SIZE = 100

    const [geojsonResults, setGeojsonResults] = useState(null)
    const [loading, setLoading] = useState(false)
    const [status, setStatus] = useState(-1) // not really a status. changes whenever a 401 occurs`
    // const [token,setToken] = useState(null)
    const [ state, dispatch ] = useContext(AppContext) //remove!

    const token = useRef(null)

    const {fetchURL, init_fetcher, abort_fetchURL} = useFetcher()

    const getcredential = (key,credentials) => {
        for(let i=0; i < credentials.length; i++) {
            if(credentials[i].key === key) {
                return {user:credentials[i].user,pass:credentials[i].pass}
            }
        }
        return {user:"",pass:""}
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




    const fetchURLpaginated = async (url,index,target,user,pass) => {
        setLoading(true)
        controller.current = new AbortController()
        let newurl = url
        newurl = newurl.replace("{startindex}",index)
        newurl = newurl.replace("{pagesize}",PAGE_SIZE)
        let page = Math.ceil(index / PAGE_SIZE)
        newurl = newurl.replace("{page}",page)
        console.log('Search: '+newurl)
        let paging = {totalresults:0, startindex:0, itemsperpage:0}
  

        let idx = target.grantType?target.tokenEndpoint.split('/', 3).join('/').length:0
        let server = target.grantType?target.tokenEndpoint.substring(0,idx):null

        let tokenendpoint = target.grantType?target.tokenEndpoint.substring(idx):null
        let granttype = target.grantType
        let response
        try {
            response = await fetchURL(newurl, server, tokenendpoint, granttype, user, pass)    
        }
        catch (err) {
            console.log(err.message)
            if(err.message  == 'Error: 401') setStatus(Math.random())
            setLoading(false)           
            return
        }
        // console.log(response)

        if(!response) {
            // setStatus(Math.random())
            setLoading(false)
            return null
        }
        

        // if (!response.ok) {
        //     window.alert(`HTTP error! status: ${response.status}`)
        //     if(response.status == 401) {
        //         // setStatus(newurl)
        //         throw new Error('401')
        //     } else {
        //         throw new Error(`HTTP error! status: ${response.status}`)
        //     }
        // }

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
                    case "CDSEStac":
                        console.log("CDSEStac")
                        geoJson = CDSEStacToGeojson(json,index)
                        break;
                    case "LTA":
                        console.log("LTA")
                        geoJson = LTAToGeojson(json,index)
                        break;
                    default:
                        setLoading(false)
                        
    
                }
                console.log(geoJson)

                // console.log('totalResults: ' + geoJson.properties.totalResults)
                paging = {
                    totalresults: geoJson.properties.totalResults == null ? MAX_ITEMS : Number(geoJson.properties.totalResults) ,
                    startindex:  Number(geoJson.properties.startIndex), 
                    itemsperpage:  Number(geoJson.properties.itemsPerPage)
                }
                console.log(paging)

                // setPagination(paging)
                if(paging.totalresults>0) setGeojsonResults(geoJson) 

                if (paging.startindex + paging.itemsperpage < Math.min(paging.totalresults,MAX_ITEMS) && paging.itemsperpage != 0 ) {
                    console.log("There's More...")  
                    // uncomment to get other pages
                    fetchURLpaginated(url,(paging.startindex + paging.itemsperpage),target,user,pass)
                } else {
                    console.log("Finished...")  

                    // token.current = null
                    // dispatch({ type: "set_token", value: null})
                    setLoading(false)  
                }

            } catch (err) {
                console.log("Didn't receive a json !")
                console.log(err)
                setLoading(false)
                setStatus(Math.random())
            }
    }

    const abort = () => {
        if(controller && controller.current) {
            abort_fetchURL()
        }
    }



    const search = ({searchdate, dataset, freetext, searchpoint, windowStart, windowEnd,credentials}) => {
        // console.log(windowStart)
        //  console.log(searchdate+' / '+ dataset+' / '+ searchpoint)
        // console.log(credentials) 
        let startdate, enddate = ''
        // let target = getcollection(dataset)
        
        if(!dataset || windowStart == 0) {
            console.log('No dataset to search')
            return null
        }

        if(loading) controller.current.abort()


        if(searchdate) {
            // let windowSize = state.searchWindow
            // let windowSize = target.windowSize
            // console.log('start date: '+searchdate)
            // console.log('windowSize: '+windowSize)
            // let julianstart = Math.floor(searchdate.getTime()/windowSize) * windowSize
            startdate = (new Date(windowStart)).toJSON()
            enddate = (new Date(windowEnd - 1000)).toJSON()
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

        let credential = getcredential(url.split("/")[2],credentials)


        fetchURLpaginated(url,startindex,dataset,credential.user,credential.pass,tokenendpoint)
        
    }
    


    return {geojsonResults, loading, status, search, abort}
}
