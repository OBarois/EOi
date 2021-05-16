import React, {  useEffect, useGlobal } from 'reactn';

import DateManager from "../components/datemanager"

function DateManagerContainer() {

    const [, setViewDate] = useGlobal('viewDate')
    const [SearchDate, setSearchDate] = useGlobal('searchDate')
    const [animated, setanimated] = useGlobal('animated')
    const [ GoToDate,  ] = useGlobal('goToDate')

    // useEffect(() => {
    //     console.log('Searching: '+SearchDate)
    // }, [SearchDate]);



    return (
        <DateManager onDateChange={setViewDate} onFinalDateChange={setSearchDate} startdate={GoToDate} onStateChange={setanimated} animated={animated}/> 
     )
}

export default DateManagerContainer;
