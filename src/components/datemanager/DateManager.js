import React, {useEffect, useState, useCallback} from 'react';
import DateLabel from './components/datelabel'
import DateController from './components/datecontroller'
import DateSelector from './components/dateselector'


function DateManager({ onDateChange, onFinalDateChange, onStateChange, animated, searching, startdate, resetstartdatetrigger, tics}) {

    // if(!startdate) startdate = new Date()
    const [selectorStartdate, setselectorStartdate] = useState(startdate)
    const [labeldate, setLabelDate] = useState(startdate)
    const [dateLabelHighlight,setDateLabelHighlight] = useState(1)

    const handleSelectorDateChange = useCallback( (date) => {
        // console.log('handleSelectorDateChange:' + date.toJSON())
        setLabelDate(date)
        onDateChange(date)
        // setscontrollerStartdate(date)
    }, [onDateChange])

    const handleSelectorFinalDateChange = useCallback( (date) => {
        // console.log('handleSelectorFinalDateChange:' + date.toJSON())
        // setcontrollerStartdate(date)
        onFinalDateChange(date)
    }, [onFinalDateChange])
    
    const handleControllerDateChange = useCallback( (date) => {
        // console.log('handleControllerDateChange' + date.toJSON())
        setselectorStartdate(date)
        // onFinalDateChange(date)
    }, [])

    const handleSelectorStepChange = (step) => {
        // console.log('handleSelectorStepChange' + step)
        setDateLabelHighlight(step)
    }

    useEffect(() => {
        console.log(tics)
    }, [tics]);



    return (
        <div >
          <DateController startdate={startdate}  onDateChange={handleControllerDateChange} onStateChange={onStateChange} animated={animated}/>
          <DateLabel date={labeldate} animated={animated} searching={searching} highlight={dateLabelHighlight}/>
          <DateSelector startdate={selectorStartdate} resetToStartDateTrigger={resetstartdatetrigger} tics={tics}
                onDateChange={handleSelectorDateChange} 
                onFinalDateChange={handleSelectorFinalDateChange} 
                onStepChange={handleSelectorStepChange}/>
        </div>
    ) 
}
export default DateManager