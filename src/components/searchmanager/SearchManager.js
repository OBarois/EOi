import React, { useState, useEffect, useRef } from "react";

import { useKey } from 'rooks'
import './SearchManager.css'
import useDatahub from "./useDatahub"
import useHandleDoubleTap from '../../hooks/useHandleDoubleTap'

 
// npm install --save-dev @iconify/react @iconify-icons/ic
import { Icon } from '@iconify/react';
import outlineRefresh from '@iconify-icons/ic/outline-refresh';
// import useFetcher  from '../../hooks/useFetcher';



function SearchManager({searchdate, searchpoint, searchmode, searchWinStart, searchWinEnd, credentials, dataset, freetext, trigger, altitude, onClearResult, onSearchStart, onPageSearch, onSearchComplete, on401, lefthanded}) {


    const [ searching, setsearching ] = useState(false);
    const [ searchtrigger, setsearchtrigger ] = useState(0);
    const firstresultdate = useRef(new Date(0))
    const lastresultdate = useRef(new Date())
    const totalresults = useRef(0)
    const totalloaded = useRef(0)


    const [param, setparam] = useState({})

    const { geojsonResults, loading, status, search, abort } = useDatahub({});
    
    const {handleTap} = useHandleDoubleTap( ()=>{setsearchtrigger(Math.random())}, onClearResult )


    // useKey(['x'],(e) => myDispatch(e,{ type: "toggle_projection" }))
    useKey(["x"],()=>setsearchtrigger(Math.random())) 



    useEffect(() => {
        setsearchtrigger(Math.random())
    }, [trigger])

    useEffect(() => {
        if(geojsonResults) {
            // console.slog(JSON.stringify(geojsonResults))

            // saves first and last item dates
            let firstitemdate = (new Date(geojsonResults.features[0].properties.earthObservation.acquisitionInformation[0].acquisitionParameter.acquisitionStartTime))
            if(firstresultdate.current.getTime() < firstitemdate.getTime() || firstresultdate.current === null) {
                firstresultdate.current = firstitemdate
            }
            let lastitemdate = (new Date(geojsonResults.features[geojsonResults.features.length-1].properties.earthObservation.acquisitionInformation[0].acquisitionParameter.acquisitionStartTime))
            if(lastresultdate.current.getTime() > lastitemdate.getTime() || lastitemdate.current === null) {
                lastresultdate.current = lastitemdate
            }
            totalloaded.current += geojsonResults.features.length
            totalresults.current = Number(geojsonResults.properties.totalResults)
            let resultdesc = {
                totalResults: totalresults.current, 
                totalLoaded: totalloaded.current
            }
            onPageSearch(geojsonResults, resultdesc)

        }
    }, [geojsonResults]);

    useEffect(() => {
        setsearching(loading)
        if(loading === false && firstresultdate.current.getTime() !== 0 ) {
            onSearchComplete({
                firstResultDate: firstresultdate.current, 
                lastResultDate: lastresultdate.current,
                totalResults: totalresults.current,
                totalLoaded: totalloaded.current
            })
        }
    }, [loading])

    useEffect(() => {
        console.log('status: ')
        console.log(status)
        // console.log(credentials)
        if(status !== -1) on401(dataset)
    }, [status]);

    useEffect(() => {
        if(!searchtrigger || searchtrigger == 0) return
        if(loading) {
            abort()
        } else {
            firstresultdate.current = new Date(0)
            lastresultdate.current = new Date()
            totalloaded.current = 0
            totalresults.current = 0

            onSearchStart()
            // console.log(param)
            search(param)    
        }

    }, [searchtrigger]);


    useEffect(() => {
        console.log('should reset token')
    }, [dataset]);


    useEffect(() => {
        // console.log('search param changed:')
        // console.log(searchdate)
        // console.log(searchWindow)
        let sd = new Date(searchdate)
        let sp = searchpoint
        if(searchmode === 'global') {
            sp = null
        } else {
            sd = null
        }
        setparam((param)=>{ return {...param, searchdate: sd, dataset: dataset, freetext: freetext, searchpoint: sp, windowStart: searchWinStart, windowEnd: searchWinEnd, credentials: credentials}})
    }, [searchdate, dataset, freetext, searchpoint, searchmode, searchWinStart, searchWinEnd, credentials]);


    //console.log('dataset rendering')
    return (
            <div className={(searching === true?'SearchController Active':'SearchController')+ (lefthanded?' lefthanded':'')} onClick={handleTap}>
                {/* {searching === true?<Icon icon={outlineSync} width='50px'/>:<span/>} */}
                <Icon icon={outlineRefresh} width='50px'/>
            </div>
    )
}

export default SearchManager;
