import React, {  useEffect, useState, useCallback } from 'react';
import {AppContext} from '../components/app/context'

import DateManager from "../components/datemanager"

function DateManagerContainer() {

    const [ state, dispatch ] = React.useContext(AppContext)


    const [tics, settics] = useState(state.tics)
    const [startdate, setstartdate] = useState(new Date(state.goToDate))

    const handleFinalDate =  useCallback( (finaldate) => {
        dispatch({type:'set_searchDate', value: finaldate})
    },[dispatch])

    const handleDateChanged = useCallback( (date) => {
        // console.log('handleDateChanged')
        // console.log(date)
        dispatch({type:'set_viewDate', value: date})
    },[dispatch])

    const handleStateChange = useCallback( (animated) => {
        dispatch({type:'set_animated', value: animated})
    },[dispatch])

    const handleZoomChange = useCallback( (zoom) => {
        dispatch({type:'set_zoomscale', value: zoom})
    },[dispatch])

    const handleStepChange = useCallback( (step) => {
         dispatch({type:'set_step', value: step})
    },[dispatch])

    // useEffect(() => {
    //     let newtics = []
    //     if(!state.geojson) return
    //     newtics = state.geojson.features.map( (item) => {
    //         return item.properties.earthObservation.acquisitionInformation[0].acquisitionParameter.acquisitionStartTime.getTime()
    //     })
    //     settics((tics)=>[...tics,...newtics])
    // }, [state.geojson]);

    // useEffect(() => {
    //     console.log(state.tics)
    //     settics(state.tics)
    // }, [state.tics]);

    useEffect(() => {
        // console.log('state.goToDate:')
        // console.log(new Date(state.goToDate))
        setstartdate((state.goToDate === null)?null:new Date(state.goToDate))
    }, [state.goToDate]);

    // let startDate = (state.goToDate === null)?null:new Date(state.goToDate)
    // console.log(startDate)

    return (
        <DateManager 
            onDateChange={handleDateChanged} 
            onFinalDateChange={handleFinalDate} 
            onStepChange={handleStepChange} 
            onZoomChange={handleZoomChange} 
            startdate={startdate} tics={state.tics} 
            gotoscalezoom={state.zoomScale} 
            onStateChange={handleStateChange} 
            animated={state.animated} 
            cycle={state.cycle} 
            searching={state.searching} 
            leftHanded={state.leftHanded} 
            searchWinStart={state.searchWinStart} 
            searchWinEnd={state.searchWinEnd} /> 
     )
}

export default DateManagerContainer;
