import React, {  useEffect, useGlobal, useState } from 'reactn';

import DateManager from "../components/datemanager"

function DateManagerContainer() {

    const [, setViewDate] = useGlobal('viewDate')
    const [SearchDate, setSearchDate] = useGlobal('searchDate')
    const [animated, setanimated] = useGlobal('animated')
    const [ GoToDate, setGoToDate ] = useGlobal('goToDate')
    const [ geojson, setgeojson] = useGlobal('geojson')
    const [ clearResultsTrigger, ] = useGlobal('clearResultsTrigger')
    const [tics, settics] = useState([])

    const handleFinalDate = (finaldate) => {
        setSearchDate(finaldate)
        setGoToDate(null)
    }

    useEffect(() => {
        let newtics = []
        if(!geojson) return
        newtics = geojson.features.map( (item) => {
            return item.properties.earthObservation.acquisitionInformation[0].acquisitionParameter.acquisitionStartTime.getTime()
        })
        // newtics.push(tics)
        settics([...tics,...newtics])
    }, [geojson]);

    useEffect(() => {
        settics([])
    }, [clearResultsTrigger]);

    // // could bypass...
    // useEffect(() => {
    //     setGoToDate(null)
    // }, [SearchDate]);



    return (
        <DateManager onDateChange={setViewDate} onFinalDateChange={handleFinalDate} startdate={GoToDate} tics={tics} onStateChange={setanimated} animated={animated}/> 
     )
}

export default DateManagerContainer;
