import { useState, useEffect, useRef, useCallback } from "react";


export function useClock({  initdate }) {
    // console.log('useClock renders')
    //const { autoStart, duration } = settings || {};
  
    // let initDate = startdate
    const [date, setDate] = useState(initdate)
    const [speed, setSpeed] = useState(1)
    const [playing, setplaying] = useState(false)
    // const [stepstate, setStepstate] = useState(1000*60*60)
    // const [refreshrate, setrefreshrate] = useState(200)
    // const playing = useRef()
    const step = useRef() 
    const refreshrate = useRef() 
    refreshrate.current = 200
    // step.current = refreshrate.current
    
    const ldate = useRef()

      // Control functions
    const intervalRef = useRef()
    const timeoutRef = useRef()
    

    function increaseSpeed() {
        // stop()
        step.current = (step.current > 0)? step.current *= 2:step.current /= 2
        if(Math.abs(step.current) < refreshrate.current) step.current = refreshrate.current
        console.log('step: '+step.current)
        setSpeed(step.current/200)
        // setStepstate((st)=>st*2)
        // start()
    }
    function decreaseSpeed() {
        step.current = (step.current > 0)? step.current /= 2:step.current *= 2
        if(Math.abs(step.current) < refreshrate.current) step.current = -1 * refreshrate.current
        console.log('step: '+step.current)
        setSpeed(step.current/200)
        // setStepstate((st)=>st/2)
    }

    function togglePause() {
        if (playing) {
            stop()
        } else {
            start()
        }
    }
    
    const start = useCallback( () => {
        console.log('start clock')
        if(!step.current) step.current = refreshrate.current
        if (!playing) {
            intervalRef.current = setInterval( ()=>{
                ldate.current += step.current
                setDate(new Date(ldate.current))
            },refreshrate.current)
        }
        setplaying(true)
    }, [])
    
    const stop = useCallback( () => {
        console.log('stop clock')
        if(timeoutRef.current) clearTimeout(timeoutRef.current)
        if (intervalRef.current) clearInterval(intervalRef.current)
        setplaying(false)
    }, [])
    

    function reset() {
        ldate.current = new Date().getTime()
        setDate(new Date(ldate.current))

    }

     
    function forceDate(newdate) {
        // console.log('forcedate useclock: '+newdate.toJSON())
        ldate.current = newdate.getTime()
        setDate(new Date(ldate.current))
    }

    // useEffect(() => {
    //     console.log('init start useclock '+initdate.toJSON())
    //     ldate.current = initdate.getTime()
    //     setDate(new Date(ldate.current))
    // }, [initdate])



  
  return { date, speed, playing, togglePause, start, stop, reset, increaseSpeed, decreaseSpeed, forceDate };
}
