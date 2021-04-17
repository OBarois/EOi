import { useState, useEffect, useRef } from "react";


export function useClock({ autoStart, initdate }) {
    // console.log('useClock renders')
    //const { autoStart, duration } = settings || {};
  
    // let initDate = startdate
    const [date, setDate] = useState(initdate)
    // const [playing, setPlaying] = useState(false)
    // const [stepstate, setStepstate] = useState(1000*60*60)
    // const [refreshrate, setrefreshrate] = useState(200)
    const playing = useRef()
    const step = useRef() 
    const refreshrate = useRef() 
    refreshrate.current = 200
    // step.current = refreshrate.current
    
    const ldate = useRef()

      // Control functions
    const intervalRef = useRef()
    const timeoutRef = useRef()
    

    // function increaseSpeed() {
    //     setStep ( () => {
    //         let newstate = (step > 0)? step * 2:step / 2
    //         if(Math.abs(newstate) < refreshrate) newstate = refreshrate
    //         return newstate
    //     })
    // }
    // function decreaseSpeed() {
    //     setStep (() => {
    //         let newstate = (step > 0)? step / 2:step * 2
    //         if(Math.abs(newstate) < refreshrate) newstate = refreshrate
    //         return newstate
    //     })
    // }
    function increaseSpeed() {
        // stop()
        step.current = (step.current > 0)? step.current *= 2:step.current /= 2
        if(Math.abs(step.current) < refreshrate.current) step.current = refreshrate.current
        console.log('step: '+step.current)
        // setStepstate((st)=>st*2)
        // start()
    }
    function decreaseSpeed() {
        step.current = (step.current > 0)? step.current /= 2:step.current *= 2
        if(Math.abs(step.current) < refreshrate.current) step.current = -1 * refreshrate.current
        console.log('step: '+step.current)
        // setStepstate((st)=>st/2)
    }

    function togglePause() {
        if (playing.current) {
            stop()
        } else {
            start()
        }
    }
    
    function start() {
        console.log('start clock')
        if(!step.current) step.current = refreshrate.current
        if (!playing.current) {
            intervalRef.current = setInterval( ()=>{
                ldate.current += step.current
                setDate(new Date(ldate.current))
            },refreshrate.current)
        }
        playing.current = true
    }
    
    function stop() {
        console.log('stop clock')
        if(timeoutRef.current) clearTimeout(timeoutRef.current)
        if (intervalRef.current) clearInterval(intervalRef.current)
        playing.current = false
    }
    

    function reset() {
        ldate.current = new Date().getTime()
        setDate(new Date(ldate.current))

    }

     
    function forceDate(newdate) {
        console.log('forcedate useclock: '+newdate.toJSON())
        ldate.current = newdate.getTime()
    }

    useEffect(() => {
        console.log('init start useclock '+initdate.toJSON())
        ldate.current = initdate.getTime()
    }, [initdate])



    // didMount effect
    useEffect(() => {
        console.log('render useclock')
        // setDate((new Date()).getTime())
        ldate.current = new Date().getTime()
        if (autoStart) {
            start();
        }
        //return reset;
    }, [autoStart]);

  
  return { date, playing, togglePause, reset, increaseSpeed, decreaseSpeed, forceDate };
}
