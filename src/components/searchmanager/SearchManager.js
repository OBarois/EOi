import React, { useState, useEffect, useRef } from "react";

import { useHotkeys } from 'react-hotkeys-hook';
import './SearchManager.css'
import useDatahub from "./useDatahub"
import useHandleDoubleTap from '../../hooks/useHandleDoubleTap'

 
// npm install --save-dev @iconify/react @iconify-icons/ic
import { Icon, InlineIcon } from '@iconify/react';
import outlineRefresh from '@iconify-icons/ic/outline-refresh';



function SearchManager({searchdate, searchpoint, mission, altitude, onSearchStart, onPageSearch, onSearchComplete}) {


    // const [results, setresults] = useState([])
    const [ searching, setsearching ] = useState(false);
    const [ searchmode, setsearchmode ] = useState('backward');
    const [ searchtrigger, setsearchtrigger ] = useState(0);
    const searchtimeout = useRef()
    const firstresultdate = useRef(new Date(0))
    const lastresultdate = useRef(new Date())


    const [param, setparam] = useState({})



    const { geojsonResults, loading, search, abort } = useDatahub({
    });
    
    const {handleTap} = useHandleDoubleTap( ()=>{setsearchtrigger(Math.random())}, onSearchStart )

    // const search = () => {
    //     searchtimeout.current = setTimeout( ()=>{
    //         setsearching(false)
    //     }, 2000)
    // }

    const handleTap2 = () => { setsearchtrigger(Math.random()) }

    useHotkeys("x",()=>setsearchtrigger(Math.random())) 

    // useEffect(() => {
    //     // console.log('will search: '+searchdate)
    //     search()
    // }, [searchdate, mission, searchpoint, searchtrigger]);

    // useEffect(() => {
    //     console.log(geojsonResults)
    //     setresults(geojsonResults)
    //     setsearching(false)
    // }, [geojsonResults]);

    useEffect(() => {
        if(geojsonResults) {
            // if(parseInt(geojsonResults.properties.startIndex) < 2) {
            //     onSearchStart()
            // }

            onPageSearch(geojsonResults)

            // saves first and last item dates
            let firstitemdate = (new Date(geojsonResults.features[0].properties.earthObservation.acquisitionInformation[0].acquisitionParameter.acquisitionStartTime))
            if(firstresultdate.current.getTime() < firstitemdate.getTime() || firstresultdate.current === null) {
                // console.log('most recent: '+firstitemdate)
                firstresultdate.current = firstitemdate
            }
            let lastitemdate = (new Date(geojsonResults.features[geojsonResults.features.length-1].properties.earthObservation.acquisitionInformation[0].acquisitionParameter.acquisitionStartTime))
            if(lastresultdate.current.getTime() > lastitemdate.getTime() || lastitemdate.current === null) {
                // console.log('oldest: '+lastitemdate)
                lastresultdate.current = lastitemdate
                // console.log(geojsonResults.features)
            }


        }
    }, [geojsonResults]);

    useEffect(() => {
        setsearching(loading)
        if(loading === false && firstresultdate.current.getTime() !== 0 ) {
            onSearchComplete(firstresultdate.current, lastresultdate.current)
        }
    }, [loading]);

    useEffect(() => {
        // onPageSearch()
        if(loading) {
            abort()
        } else {
            firstresultdate.current = new Date(0)
            lastresultdate.current = new Date()
            onSearchStart()
            search(param)    
        }

    }, [searchtrigger]);

    // useEffect(() => {
    //     clearTimeout(searchtimeout.current)
    //     searchtimeout.current = setTimeout( () => {
    //         setsearchtrigger(Math.random())
    //     },1000)
    // }, [param]);

    useEffect(() => {
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
