import React, { useState, useCallback, useEffect} from 'react';
import DateLabel from './components/datelabel'
import DateController from './components/datecontroller'
import DateSelector from './components/dateselector'


function DateManager({ onDateChange, onFinalDateChange, onStateChange, onStepChange, onZoomChange, animated, searching, startdate, tics, gotoscalezoom, cycle, leftHanded, searchWinStart, searchWinEnd, searchDate}) {

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
        onStepChange(step)
        setDateLabelHighlight(step)
    },[])

    const handleSelectorZoomChange = useCallback( (zoom) => {
        onZoomChange(zoom)
    },[])

    const handleLabelClick = useCallback( (zoom) => {
        console.log(zoom)
        setscalezoom(zoom)
    },[])



    return (
        <div >
          <DateController startdate={startdate}  onDateChange={handleControllerDateChange} onStateChange={onStateChange} animated={animated} lefthanded={leftHanded}/>
          <DateLabel date={labeldate} highlight={dateLabelHighlight} handleLabelClick={handleLabelClick}/>
          <DateSelector startdate={selectorStartdate}  tics={tics} gotoscalezoom={scalezoom} satcycle={cycle}
                onDateChange={handleSelectorDateChange} 
                onFinalDateChange={handleSelectorFinalDateChange} 
                onStepChange={handleSelectorStepChange}
                onZoomChange={handleSelectorZoomChange}
                leftHanded={leftHanded}
                searchWinStart={searchWinStart}
                searchWinEnd={searchWinEnd}/>
        </div>
    ) 
}
export default DateManager