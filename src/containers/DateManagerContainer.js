import React, {  useEffect, useGlobal, useState } from 'reactn';

import DateManager from "../components/datemanager"

function DateManagerContainer() {

    const [, setViewDate] = useGlobal('viewDate')
    const [SearchDate, setSearchDate] = useGlobal('searchDate')
    const [animated, setanimated] = useGlobal('animated')
    const [ GoToDate,  ] = useGlobal('goToDate')
    const [ geojson, setgeojson] = useGlobal('geojson')
    const [ clearGeojsonTrigger, ] = useGlobal('clearGeojsonTrigger')
    const [tics, settics] = useState([])


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
    }, [clearGeojsonTrigger]);



    return (
        <DateManager onDateChange={setViewDate} onFinalDateChange={setSearchDate} startdate={GoToDate} tics={tics} onStateChange={setanimated} animated={animated}/> 
     )
}

export default DateManagerContainer;
