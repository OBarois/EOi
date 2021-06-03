import { useState, useRef } from "react";
import dhusToGeojson from "./dhusToGeojson";
import eocatToGeojson from "./eocatToGeojson"


// export default function useDatahub({searchdate, mission, searchpoint})  {
export default function useDatahub()  {

    const searchparam = useRef({})
    const controller = useRef(null)

    const MAX_ITEMS = 1000

    const [geojsonResults, setGeojsonResults] = useState(null)
    const [loading, setLoading] = useState(false)



    // const [ collections, setCollections ] = useState([])
    const collections = useRef([
        {
            code: 'S1',
            //templateUrl: 'https://131.176.236.55/dhus/search?q=( footprint:"Intersects({polygon})" AND beginposition:[{start} TO {end}] AND platformname:Sentinel-1 AND producttype:GRD)&start={startindex}&rows=100&sortedby=beginposition&order=desc&format=json',
            templateUrl: 'https://scihub.copernicus.eu/dhus/search?q=( footprint:"Intersects({polygon})" AND beginposition:[{start} TO {end}] AND platformname:Sentinel-1 AND producttype:GRD)&start={startindex}&rows=100&orderby=beginposition desc&format=json',
            name: 'Sentinel-1 GRD' ,
            startIndexOrigin: 0,
            dateOff: ' beginposition:[{start} TO {end}] AND',
            areaOff:  ' footprint:"Intersects({polygon})" AND',
            windowSize: 1000 * 60 * 60 * 18 
        },
        {
            code: 'S1A',
            //templateUrl: 'https://131.176.236.55/dhus/search?q=( footprint:"Intersects({polygon})" AND beginposition:[{start} TO {end}] AND platformname:Sentinel-1 AND producttype:GRD)&start={startindex}&rows=100&sortedby=beginposition&order=desc&format=json',
            templateUrl: 'https://scihub.copernicus.eu/dhus/search?q=( footprint:"Intersects({polygon})" AND beginposition:[{start} TO {end}] AND platformname:Sentinel-1 AND filename:S1A* AND producttype:GRD)&start={startindex}&rows=100&orderby=beginposition desc&format=json',
            name: 'Sentinel-1A GRD' ,
            startIndexOrigin: 0,
            dateOff: ' beginposition:[{start} TO {end}] AND',
            areaOff:  ' footprint:"Intersects({polygon})" AND',
            windowSize: 1000 * 60 * 60 * 18 
        },
        {
            code: 'S1B',
            //templateUrl: 'https://131.176.236.55/dhus/search?q=( footprint:"Intersects({polygon})" AND beginposition:[{start} TO {end}] AND platformname:Sentinel-1 AND producttype:GRD)&start={startindex}&rows=100&sortedby=beginposition&order=desc&format=json',
            templateUrl: 'https://scihub.copernicus.eu/dhus/search?q=( footprint:"Intersects({polygon})" AND beginposition:[{start} TO {end}] AND platformname:Sentinel-1 AND filename:S1B* AND producttype:GRD)&start={startindex}&rows=100&orderby=beginposition desc&format=json',
            name: 'Sentinel-1B GRD' ,
            startIndexOrigin: 0,
            dateOff: ' beginposition:[{start} TO {end}] AND',
            areaOff:  ' footprint:"Intersects({polygon})" AND',
            windowSize: 1000 * 60 * 60 * 18 
        },
        {
            code: 'S2',
            templateUrl: 'https://scihub.copernicus.eu/dhus/search?q=( footprint:"Intersects({polygon})" AND beginposition:[{start} TO {end}] AND platformname:Sentinel-2 AND filename:*MSIL1C*)&start={startindex}&rows=100&orderby=beginposition desc&format=json',
            name: 'Sentinel-2 A/B Level 1C',
            startIndexOrigin: 0,
            dateOff: ' beginposition:[{start} TO {end}] AND',
            areaOff:  ' footprint:"Intersects({polygon})" AND',
            windowSize: 1000 * 60 * 60 *3
        },
        {
            code: 'S2A',
            templateUrl: 'https://scihub.copernicus.eu/dhus/search?q=( footprint:"Intersects({polygon})" AND beginposition:[{start} TO {end}] AND platformname:Sentinel-2 AND filename:S2A_MSIL1C*)&start={startindex}&rows=100&orderby=beginposition desc&format=json',
            name: 'Sentinel-2 A/B Level 1C',
            startIndexOrigin: 0,
            dateOff: ' beginposition:[{start} TO {end}] AND',
            areaOff:  ' footprint:"Intersects({polygon})" AND',
            windowSize: 1000 * 60 * 60 * 3
        },
        {
            code: 'S2B',
            templateUrl: 'https://scihub.copernicus.eu/dhus/search?q=( footprint:"Intersects({polygon})" AND beginposition:[{start} TO {end}] AND platformname:Sentinel-2 AND filename:S2B_MSIL1C*)&start={startindex}&rows=100&orderby=beginposition desc&format=json',
            name: 'Sentinel-2 A/B Level 1C',
            startIndexOrigin: 0,
            dateOff: ' beginposition:[{start} TO {end}] AND',
            areaOff:  ' footprint:"Intersects({polygon})" AND',
            windowSize: 1000 * 60 * 60 * 3
        },
        {
            code: 'S3',
            templateUrl: 'https://scihub.copernicus.eu/dhus/search?q=( footprint:"Intersects({polygon})" AND beginposition:[{start} TO {end}] AND platformname:Sentinel-3 AND (producttype:OL_1_LFR___ OR producttype:SL_1_RBT___ OR producttype:SR_1_SRA___))&start={startindex}&rows=100&orderby=beginposition desc&format=json',
            name: 'Sentinel-3 A/B, OLCI/SLSTR/SRAL' ,
            startIndexOrigin: 0,
            dateOff: ' beginposition:[{start} TO {end}] AND',
            areaOff:  ' footprint:"Intersects({polygon})" AND',
            windowSize: 1000 * 60 * 60 * 24
        },
        {
            code: 'S3A/OLCI/LFR',
            templateUrl: 'https://scihub.copernicus.eu/dhus/search?q=( footprint:"Intersects({polygon})" AND beginposition:[{start} TO {end}] AND platformname:Sentinel-3 AND filename:S3A_*  AND (producttype:OL_2_LFR___))&start={startindex}&rows=100&orderby=beginposition desc&format=json',
            name: 'Sentinel-3 A, OLCI/LFR' ,
            startIndexOrigin: 0,
            dateOff: ' beginposition:[{start} TO {end}] AND',
            areaOff:  ' footprint:"Intersects({polygon})" AND',
            windowSize: 1000 * 60 * 60 * 24
        },
        {
            code: 'S3B/OLCI/LFR',
            templateUrl: 'https://scihub.copernicus.eu/dhus/search?q=( footprint:"Intersects({polygon})" AND beginposition:[{start} TO {end}] AND platformname:Sentinel-3 AND filename:S3B_* AND (producttype:OL_2_LFR___))&start={startindex}&rows=100&orderby=beginposition desc&format=json',
            name: 'Sentinel-3 B, OLCI/LFR' ,
            startIndexOrigin: 0,
            dateOff: ' beginposition:[{start} TO {end}] AND',
            areaOff:  ' footprint:"Intersects({polygon})" AND',
            windowSize: 1000 * 60 * 60 * 24
        },
        {
            code: 'S3A/OLCI/RBT',
            templateUrl: 'https://scihub.copernicus.eu/dhus/search?q=( footprint:"Intersects({polygon})" AND beginposition:[{start} TO {end}] AND platformname:Sentinel-3 AND filename:S3A_*  AND (producttype:SL_1_RBT___))&start={startindex}&rows=100&orderby=beginposition desc&format=json',
            name: 'Sentinel-3 A, OLCI/RBT' ,
            startIndexOrigin: 0,
            dateOff: ' beginposition:[{start} TO {end}] AND',
            areaOff:  ' footprint:"Intersects({polygon})" AND',
            windowSize: 1000 * 60 * 60 * 24
        },
        {
            code: 'S3B/SLSTR/RBT',
            templateUrl: 'https://scihub.copernicus.eu/dhus/search?q=( footprint:"Intersects({polygon})" AND beginposition:[{start} TO {end}] AND platformname:Sentinel-3 AND filename:S3B_* AND (producttype:SL_1_RBT___))&start={startindex}&rows=100&orderby=beginposition desc&format=json',
            name: 'Sentinel-3 B, SLSTR/RBT' ,
            startIndexOrigin: 0,
            dateOff: ' beginposition:[{start} TO {end}] AND',
            areaOff:  ' footprint:"Intersects({polygon})" AND',
            windowSize: 1000 * 60 * 60 * 24
        },
        {
            code: 'S3/SLSTR',
            templateUrl: 'https://scihub.copernicus.eu/dhus/search?q=( footprint:"Intersects({polygon})" AND beginposition:[{start} TO {end}] AND platformname:Sentinel-3 AND (producttype:SL_1_RBT___))&start={startindex}&rows=100&orderby=beginposition desc&format=json',
            name: 'Sentinel-3 A/B, SLSTR' ,
            startIndexOrigin: 0,
            dateOff: ' beginposition:[{start} TO {end}] AND',
            areaOff:  ' footprint:"Intersects({polygon})" AND',
            windowSize: 1000 * 60 * 60 * 24
        },
        {
            code: 'S3/SRAL',
            templateUrl: 'https://scihub.copernicus.eu/dhus/search?q=( footprint:"Intersects({polygon})" AND beginposition:[{start} TO {end}] AND platformname:Sentinel-3 AND (producttype:SR_1_SRA___))&start={startindex}&rows=100&orderby=beginposition desc&format=json',
            name: 'Sentinel-3 A/B, SRAL' ,
            startIndexOrigin: 0,
            dateOff: ' beginposition:[{start} TO {end}] AND',
            areaOff:  ' footprint:"Intersects({polygon})" AND',
            windowSize: 1000 * 60 * 60 * 24
        },
        {
            code: 'S5P',
            templateUrl: 'https://scihub.copernicus.eu/dhus/search?q=( footprint:"Intersects({polygon})" AND beginposition:[{start} TO {end}] AND platformname:Sentinel-5 precursor AND (producttype:L1B_RA_BD1 OR (producttype:L2__NO2___ AND processingmode:Near real time)))&start={startindex}&rows=100&orderby=beginposition desc&format=json',
            name: 'S5P',
            startIndexOrigin: 0,
            dateOff: ' beginposition:[{start} TO {end}] AND',
            areaOff:  ' footprint:"Intersects({polygon})" AND',
            windowSize: 1000 * 60 * 60 * 24 
        },
        {
            code: 'ENVISAT/MERIS/FRS',
            templateUrl: 'https://dhr.datahub.eodc.eu/search?q=( footprint:"Intersects({polygon})" AND beginposition:[{start} TO {end}] AND platformname:Envisat AND producttype:MER_FRS_2P) &start={startindex}&rows=100&orderby=beginposition desc&format=json',
            name: "ENVISAT/MERIS/FRS from EODC's EO Mission Data relay",
            startIndexOrigin: 0,
            dateOff: ' beginposition:[{start} TO {end}] AND',
            areaOff:  ' footprint:"Intersects({polygon})" AND',
            windowSize: 1000 * 60 * 60 * 24 
        },
        {
            code: 'ENVISAT',
            templateUrl: 'https://eocat.esa.int/api/catalogue/EOCAT-ENVISAT.ASA.IMP_1P/search?start={start}&stop={end}&geom={polygon}&format=json&count=50&startIndex={startindex}',
            startIndexOrigin: 1,
            name: 'Envisat',
            dateOff: 'start={start}&stop={end}&',
            areaOff:  '&geom={polygon}',
            windowSize: 1000 * 60 * 60 * 24 * 3
        }

    ])

    const getcollection = (code) => {
        for(let i=0; i < collections.current.length; i++) {
            if(collections.current[i].code === code) {
                return collections.current[i]
            }
        }
        return null
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

    const fetchURL = async (url,index) => {
        setLoading(true)
        controller.current = new AbortController()
        let newurl = url
        newurl = newurl.replace("{startindex}",index)
        // console.log('Search: '+newurl)
        let paging = {totalresults:0, startindex:0, itemsperpage:0}
        try {
            const response = await fetch(newurl, {mode: 'cors', credentials: 'include', signal: controller.current.signal})
            // console.log( response.text())
            if (!response.ok) {
                // Window.alert(`HTTP error! status: ${response.status}`)
                throw new Error(`HTTP error! status: ${response.status}`)
            }
            try {
                const json = await response.json()
                const geoJson = (searchparam.current.mission === 'ENVISAT')? eocatToGeojson(json) : dhusToGeojson(json)
                // console.log('totalResults: ' + geoJson.properties.totalResults)
                paging = {
                    totalresults: geoJson.properties.totalResults == null ? 0 : Number(geoJson.properties.totalResults) ,
                    startindex:  Number(geoJson.properties.startIndex), 
                    itemsperpage:  Number(geoJson.properties.itemsPerPage)
                }
                // console.log(paging)

                // setPagination(paging)
                if(paging.totalresults>0) setGeojsonResults(geoJson) 

                if (paging.startindex + paging.itemsperpage < Math.min(paging.totalresults,MAX_ITEMS) ) {
                    // console.log("There's More...")  
                    // uncomment to get other pages
                    fetchURL(url,(paging.startindex + paging.itemsperpage))
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
        searchparam.current.searchdate = searchdate
        searchparam.current.mission = mission
        searchparam.current.searchpoint = searchpoint

        let startindex = getcollection(mission).startIndexOrigin
        fetchURL(url,startindex)
        
    }
    


    return {geojsonResults, loading, search, abort}
}
