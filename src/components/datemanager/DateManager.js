import React, { useState, useCallback} from 'react';
import DateLabel from './components/datelabel'
import DateController from './components/datecontroller'
import DateSelector from './components/dateselector'


function DateManager({ onDateChange, onFinalDateChange, onStateChange, animated, searching, startdate, resetstartdatetrigger, tics, gotoscalezoom, leftHanded}) {

    // if(!startdate) startdate = new Date()
    const [selectorStartdate, setselectorStartdate] = useState(startdate)
    const [labeldate, setLabelDate] = useState(startdate)
    const [scalezoom, setscalezoom] = useState(gotoscalezoom)
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

    const handleSelectorStepChange = useCallback( (step) => {
        console.log('handleSelectorStepChange' + step)
        setDateLabelHighlight(step)
    },[])

    const handleLabelClick = useCallback( (zoom) => {
        console.log(zoom)
        setscalezoom(zoom)
    },[])

    // useEffect(() => {
    //     console.log(tics)
    // }, [tics]);



    return (
        <div >
          <DateController startdate={startdate}  onDateChange={handleControllerDateChange} onStateChange={onStateChange} animated={animated} lefthanded={leftHanded}/>
          <DateLabel date={labeldate} highlight={dateLabelHighlight} handleLabelClick={handleLabelClick}/>
          <DateSelector startdate={selectorStartdate} resetToStartDateTrigger={resetstartdatetrigger} tics={tics} gotoscalezoom={scalezoom}
                onDateChange={handleSelectorDateChange} 
                onFinalDateChange={handleSelectorFinalDateChange} 
                onStepChange={handleSelectorStepChange}
                leftHanded={leftHanded}/>
        </div>
    ) 
}
export default DateManager