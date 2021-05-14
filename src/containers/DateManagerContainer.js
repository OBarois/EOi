import React, {  useEffect, useGlobal } from 'reactn';

import DateManager from "../components/datemanager"

function DateManagerContainer() {

    const [, setViewDate] = useGlobal('viewDate')
    const [SearchDate, setSearchDate] = useGlobal('searchDate')

    // useEffect(() => {
    //     console.log('Searching: '+SearchDate)
    // }, [SearchDate]);



    return (
        <DateManager onDateChange={setViewDate} onFinalDateChange={setSearchDate} /> 
     )
}

export default DateManagerContainer;
