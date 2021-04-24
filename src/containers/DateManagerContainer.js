import React, {  useGlobal } from 'reactn';

import DateManager from "../components/datemanager"

function C_DateManager() {

    const [viewDate, setViewDate] = useGlobal('viewDate')

    return (
        <DateManager onDateChange={setViewDate} onFinalDateChange={setViewDate} /> 
     )
}

export default C_DateManager;
