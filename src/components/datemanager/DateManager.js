import React, {useState, useEffect} from 'react';
import DateLabel from './components/datelabel'
import DateController from './components/datecontroller'
import DateSelector from './components/dateselector'


function DateManager({startdate, onDateChange, onFinalDateChange, animated}) {

    const [selectorStartdate, setselectorStartdate] = useState(startdate)
    const [controllerStartdate, setcontrollerStartdate] = useState(startdate)
    const [labeldate, setLabelDate] = useState(startdate)
    const [dateLabelHighlight,setDateLabelHighlight] = useState(1)

    const handleSelectorDateChange = (date) => {
        // console.log('handleSelectorDateChange:' + date.toJSON())
        setLabelDate(date)
        onDateChange(date)
        // setscontrollerStartdate(date)
    }

    const handleSelectorFinalDateChange = (date) => {
        // console.log('handleSelectorFinalDateChange:' + date.toJSON())
        setcontrollerStartdate(date)
        onFinalDateChange(date)
    }
    
    const handleControllerDateChange = (date) => {
        // console.log('handleControllerDateChange' + date.toJSON())
        setselectorStartdate(date)
        // onFinalDateChange(date)
    }

    const handleSelectorStepChange = (step) => {
        console.log('handleSelectorStepChange' + step)
        setDateLabelHighlight(step)
    }

    // useEffect(() => {
    //     // console.log('startdate in date manager: '+startdate.toJSON())
    //     setselectorStartdate(startdate)
    // },[startdate])



    return (
        <div >
          <DateController startdate={controllerStartdate} onDateChange={handleControllerDateChange}/>
          <DateLabel date={labeldate} animated={animated} highlight={dateLabelHighlight}/>
          <DateSelector startdate={selectorStartdate} 
                onDateChange={handleSelectorDateChange} 
                onFinalDateChange={handleSelectorFinalDateChange} 
                onStepChange={handleSelectorStepChange}/>
        </div>
    ) 
}
export default DateManager