import React, {  useEffect, useState } from 'react';
import {AppContext} from '../components/app/context'

import DateManager from "../components/datemanager"

function DateManagerContainer() {

    const [ state, dispatch ] = React.useContext(AppContext)


    const [tics, settics] = useState([])
    const [startdate, setstartdate] = useState(new Date(state.goToDate))

    const handleFinalDate =  (finaldate) => {
        dispatch({type:'set_searchDate', value: finaldate})
    }

    const handleDateChanged = (date) => {
        // console.log('handleDateChanged')
        // console.log(date)
        dispatch({type:'onDateChanged', value: date})
    }

    const handleStateChange = (animated) => {
        dispatch({type:'set_animated', value: animated})
    }

    useEffect(() => {
        let newtics = []
        if(!state.geojson) return
        newtics = state.geojson.features.map( (item) => {
            return item.properties.earthObservation.acquisitionInformation[0].acquisitionParameter.acquisitionStartTime.getTime()
        })
        settics((tics)=>[...tics,...newtics])
    }, [state.geojson]);

    useEffect(() => {
        settics([])
    }, [state.clearResultsTrigger]);

    useEffect(() => {
        console.log('state.goToDate')
        console.log(state.goToDate)
        setstartdate((state.goToDate === null)?null:new Date(state.goToDate))
    }, [state.goToDate]);

    // let startDate = (state.goToDate === null)?null:new Date(state.goToDate)
    // console.log(startDate)

    return (
        <DateManager onDateChange={handleDateChanged} onFinalDateChange={handleFinalDate} startdate={startdate} tics={state.tics} onStateChange={handleStateChange} animated={state.animated}/> 
     )
}

export default DateManagerContainer;
