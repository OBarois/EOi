import React, { useState, useEffect, useRef } from "react";

import { useKey } from 'rooks'
import './SearchManager.css'
import useDatahub from "./useDatahub"
import useHandleDoubleTap from '../../hooks/useHandleDoubleTap'

 
// npm install --save-dev @iconify/react @iconify-icons/ic
import { Icon } from '@iconify/react';
import outlineRefresh from '@iconify-icons/ic/outline-refresh';



function SearchManager({searchdate, searchpoint, mission, altitude, onSearchStart, onPageSearch, onSearchComplete}) {


    const [ searching, setsearching ] = useState(false);
    const [ searchtrigger, setsearchtrigger ] = useState(0);
    const firstresultdate = useRef(new Date(0))
    const lastresultdate = useRef(new Date())
    const totalresults = useRef(0)
    const totalloaded = useRef(0)


    const [param, setparam] = useState({})



    const { geojsonResults, loading, search, abort } = useDatahub({});
    
    const {handleTap} = useHandleDoubleTap( ()=>{setsearchtrigger(Math.random())}, onSearchStart )


    useKey(["x"],()=>setsearchtrigger(Math.random())) 

    useEffect(() => {
        if(geojsonResults) {
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
    }, [loading]);

    useEffect(() => {
        if(loading) {
            abort()
        } else {
            firstresultdate.current = new Date(0)
            lastresultdate.current = new Date()
            totalloaded.current = 0
            totalresults.current = 0

            onSearchStart()
            search(param)    
        }

    }, [searchtrigger]);


    useEffect(() => {
        // console.log('set param')
        let sd = searchdate
        let sp = searchpoint
        if(altitude > 3000000) {
            sp = null
        } else {
            sd = null
        }
        setparam((param)=>{ return {...param, searchdate: sd, mission: mission, searchpoint: sp }})
    }, [searchdate, mission, searchpoint, altitude]);

    //console.log('mission rendering')
    return (
        <div>
            <div className={searching === true?'SearchController Active':'SearchController'} onClick={handleTap}>
                {/* {searching === true?<Icon icon={outlineSync} width='50px'/>:<span/>} */}
                <Icon icon={outlineRefresh} width='50px'/>
            </div>
        </div>
    )
}

export default SearchManager;
