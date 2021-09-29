import React, {  useEffect, useState } from 'react';
import {AppContext} from '../components/app/context'

import DateManager from "../components/datemanager"

function DateManagerContainer() {

    const [ state, dispatch ] = React.useContext(AppContext)


    const [tics, settics] = useState([])

    const handleFinalDate =  (finaldate) => {
        dispatch({type:'set_searchDate', value: finaldate})
    }

    const handleDateChanged = (date) => {
        // console.log('handleDateChanged')
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


    return (
        <DateManager onDateChange={handleDateChanged} onFinalDateChange={handleFinalDate} startdate={state.goToDate} tics={state.tics} onStateChange={handleStateChange} animated={state.animated}/> 
     )
}

export default DateManagerContainer;
