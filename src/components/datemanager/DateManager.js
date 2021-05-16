import React, {useState, useCallback, useEffect} from 'react';
import DateLabel from './components/datelabel'
import DateController from './components/datecontroller'
import DateSelector from './components/dateselector'


function DateManager({ onDateChange, onFinalDateChange, onStateChange, animated, startdate}) {

    // if(!startdate) startdate = new Date()
    const [selectorStartdate, setselectorStartdate] = useState(startdate)
    const [controllerStartdate, setcontrollerStartdate] = useState(startdate)
    const [labeldate, setLabelDate] = useState(startdate)
    const [dateLabelHighlight,setDateLabelHighlight] = useState(1)

    const handleSelectorDateChange = useCallback( (date) => {
        // console.log('handleSelectorDateChange:' + date.toJSON())
        setLabelDate(date)
        onDateChange(date)
        // setscontrollerStartdate(date)
    }, [])

    const handleSelectorFinalDateChange = useCallback( (date) => {
        // console.log('handleSelectorFinalDateChange:' + date.toJSON())
        setcontrollerStartdate(date)
        onFinalDateChange(date)
    }, [])
    
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
        // console.log('startdate changed '+startdate)
        setcontrollerStartdate(startdate)
    }, [startdate]);


    return (
        <div >
          <DateController startdate={controllerStartdate}  onDateChange={handleControllerDateChange} onStateChange={onStateChange} animated={animated}/>
          <DateLabel date={labeldate} animated={animated} highlight={dateLabelHighlight}/>
          <DateSelector startdate={selectorStartdate} 
                onDateChange={handleSelectorDateChange} 
                onFinalDateChange={handleSelectorFinalDateChange} 
                onStepChange={handleSelectorStepChange}/>
        </div>
    ) 
}
export default DateManager