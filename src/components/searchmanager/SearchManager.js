import React, { useState, useEffect, useRef } from "react";

import { useHotkeys } from 'react-hotkeys-hook';
import './SearchManager.css'
import useDatahub from "./useDatahub"
 
// npm install --save-dev @iconify/react @iconify-icons/ic
import { Icon, InlineIcon } from '@iconify/react';
import outlineSync from '@iconify-icons/ic/outline-sync';



function SearchManager({searchdate, searchpoint, mission, altitude, onPageSearch, onSearchComplete}) {


    // const [results, setresults] = useState([])
    const [ searching, setsearching ] = useState(false);
    const [ searchtrigger, setsearchtrigger ] = useState(0);
    const searchtimeout = useRef()
    const firstresultdate = useRef(new Date(0))


    const [param, setparam] = useState({})



    const { geojsonResults, loading, search } = useDatahub({
    });
    

    // const search = () => {
    //     searchtimeout.current = setTimeout( ()=>{
    //         setsearching(false)
    //     }, 2000)
    // }

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
            // console.log(geojsonResults)
            onPageSearch(geojsonResults)
            let firstitemdate = (new Date(geojsonResults.features[0].properties.earthObservation.acquisitionInformation[0].acquisitionParameter.acquisitionStartTime))
            if(firstresultdate.current.getTime() < firstitemdate.getTime() || firstresultdate.current === null) {
                firstresultdate.current = firstitemdate
            }
        }
    }, [geojsonResults]);

    useEffect(() => {
        setsearching(loading)
        if(loading === false && firstresultdate.current.getTime() !== 0 ) {
            onSearchComplete(firstresultdate.current)
        }
    }, [loading]);

    useEffect(() => {
        onPageSearch()
        firstresultdate.current = new Date(0)
        search(param)
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
            <div className={searching === true?'SearchController Active':'SearchController'} onClick={()=>{setsearchtrigger(Math.random())}}>
                {/* {searching === true?<Icon icon={outlineSync} width='50px'/>:<span/>} */}
                <Icon icon={outlineSync} width='50px'/>
            </div>
        </div>
    )
}

export default SearchManager;
