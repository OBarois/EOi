import React, {useState, useEffect, useRef} from 'react'
import {useSpring, animated} from 'react-spring'
import { useGesture } from 'react-use-gesture'
import { scale } from 'vec-la'
import DateSelectorScale from './DateSelectorScale'

import './DateSelector.css';
// import { start } from 'repl';

function DateSelector({startdate, onDateChange, onFinalDateChange, onStepChange}) {

    const MAXZOOM = 1000*60*60*24*15
    const MINZOOM = 1000
    const DEFZOOM = 1000*60*60
    const ZOOMDIR = -1
    
    const selector = useRef()
    const lastZoom = useRef()
    const lastPos = useRef()
    if(!lastZoom.current) lastZoom.current = DEFZOOM
    if(!lastPos.current) lastPos.current = 0

    
    const [scaledate, setScaledate ] = useState(startdate)
    // const debouncedScaledate = useDebounce(scaledate, 10);

    const [lastStartdate, setlLastStartdate ] = useState(startdate)
    
    const [active, setActive ] = useState(false)
    const [step, setStep ] = useState([60000])
    const [stepLabel, setStepLabel ] = useState('hour')

    // zoomfactor: how long is a pixel in ms
    const [zoomfactor, setZoomfactor ] = useState(DEFZOOM)
    if (!lastZoom.current) lastZoom.current = DEFZOOM

    // to detect double taps
    const lastTap = useRef()
    const doubleTap = useRef()

    const month = useRef()


    const handleDoubleTap = () => {
        const now = Date.now();
        if (lastTap.current && (now - lastTap.current) < 300  && !active) {
            doubleTap.current = true
        } else {
            lastTap.current = now
            doubleTap.current = false
        }
    }


    const [{ posxy_drag}, setyOnDrag] = useSpring(() => ({ posxy_drag: [0,0]  }))
    const [{ xy2 }, sety2] = useSpring(() => ({ xy2: [0,0] }))
    const [{ posy_wheel }, setyOnWheel] = useSpring(() => ({posy_wheel: 0 }))
    // const [{ zoom }, setz] = useSpring(() => ({ zoom: DEFZOOM }))


    
    const bind = useGesture({

        onDragEnd: () => {
                lastZoom.current = zoomfactor
        },

        onWheel: ( {delta, first, down, direction, velocity, xy, movement, memo = posy_wheel.getValue() } ) => {
            // console.log(down)
            // console.log(first)
            setyOnWheel({                 
                posy_wheel: movement[1]/2 + lastPos.current, 
                immediate: true, 
                config: { },
                onFrame: ()=>{
                    // console.log('y / posy / movement / memo:  '+xy[1]+'/ '+posy_wheel.getValue()+'/ '+movement[1]+'/ '+lastPos.current)
                    if (!first) {
                        // let newdate = new Date(lastStartdate.getTime() + Math.ceil(posy_wheel.getValue() * zoomfactor  / step) * step)
                        let newdate = new Date(lastStartdate.getTime() + Math.ceil(movement[1] * zoomfactor  / step[0]) * step[0]) 
                        setScaledate(newdate)
                        onDateChange(newdate)
                        }
                        lastPos.current = posy_wheel.getValue()

                    // setlLastStartdate(newdate)
                },
                onRest: ()=>{
                    if (!down) {
                        setActive(false)
                        let newdate = new Date(lastStartdate.getTime() + Math.ceil(posy_wheel.getValue() * zoomfactor  / step[0]) * step[0]) 
                        onFinalDateChange(newdate)
                        setlLastStartdate(newdate)
                        lastPos.current=0
                    }
                }
            })
        return memo
        },

        onDrag: ({  event, active, first, down, touches, delta, velocity, direction, shiftKey, xy, movement, temp = {
            lastzoom: zoomfactor,
            lastdelta: [0,0],
            currentzoom: zoomfactor
            }
        }) => {
            //event.preventDefault()
            let zoom
            if (first) {
                setActive(true)
                handleDoubleTap()
                setlLastStartdate(scaledate)
                lastPos.current = 0
                
            }

            if (doubleTap.current || shiftKey) {
                zoom = temp.currentzoom + temp.currentzoom / 50 *  delta[1] * ZOOMDIR
                if (zoom < MINZOOM) zoom = MINZOOM
                if (zoom > MAXZOOM) zoom = MAXZOOM
                setZoomfactor(zoom)
                // temp.xy = [0,0]
                temp.currentzoom = zoom
                temp.lastdelta = delta
                if(!down) setActive(false)
                return temp
            }
            velocity = (Math.abs(velocity)<.2)?0:velocity  

            setyOnDrag({                 
                posxy_drag:  movement,
                immediate: (active), 
                config: { velocity: scale(direction, velocity), decay: true},
                onFrame: ()=>{
                    // console.log('y / movement / delta:  '+xy[1]+'/ '+movement[1]+'/ '+delta[1])
                    if (!first) {
                        let newdate
                        if(stepLabel==='month') {
                            let nbstep = Math.ceil(posxy_drag.getValue()[1] * zoomfactor  / step[0])
                            newdate = new Date(lastStartdate.getTime())
                            newdate.setUTCMonth(lastStartdate.getUTCMonth()-nbstep)

                        } else {
                            newdate = new Date(lastStartdate.getTime() - Math.ceil(posxy_drag.getValue()[1] * zoomfactor  / step[0]) * step[0]) 

                        }
                        setScaledate(newdate)
                        onDateChange(newdate)
                        }

                    // setlLastStartdate(newdate)
                },
                onRest: ()=>{
                    if (!down) {
                        setActive(false)
                        let thisstep = (stepLabel==='month')?step[scaledate.getUTCMonth()]:step[0]
                        let newdate = new Date(lastStartdate.getTime() - Math.ceil(posxy_drag.getValue()[1] * zoomfactor  / thisstep) * thisstep) 
                        onFinalDateChange(newdate)
                        setlLastStartdate(newdate)
                    }
                }
            })
            return temp
        }
    },
    {reset: true,drag: {useTouch: true} }
    )


    const moveToDate = (startdate) => {
        if (!active) {
            let deltaoffset = [0,(lastStartdate.getTime() - startdate.getTime())  / zoomfactor]
            
            sety2({ 
                xy2: deltaoffset,
                immediate: false, 
                config: {reset: true, config: {duration: 200} },
                onFrame: ()=>{
                    let newdate = new Date(lastStartdate.getTime() - xy2.getValue()[1] * zoomfactor)
                    setScaledate(newdate)
                    onDateChange(newdate)
                },
                onRest: ()=>{
                    // setActive(false)
                    let newdate = new Date(lastStartdate.getTime() - xy2.getValue()[1] * zoomfactor)
                    xy2.setValue([0,0])
                    setScaledate(newdate)
                    setlLastStartdate(newdate)
                }
            })
        }

    }

    useEffect(() => {
        // console.log('startdate changed')
        if(!active) {
            moveToDate(startdate)
        }
    },[startdate])

    // useEffect(() => {
    //     console.log('laststartdate changed: '+lastStartdate.toJSON())
    // },[lastStartdate])

    useEffect(() => {
        console.log('Selector active: '+active)
    },[active])


    useEffect(() => {
        onStepChange(stepLabel)
    },[stepLabel])

    
    useEffect(() => {
        switch (true) {
            case zoomfactor > 120426316:
                setStep([
                    1000*60*60*24*31,
                    1000*60*60*24*28,
                    1000*60*60*24*31,
                    1000*60*60*24*30,
                    1000*60*60*24*31,
                    1000*60*60*24*30,
                    1000*60*60*24*31,
                    1000*60*60*24*31,
                    1000*60*60*24*30,
                    1000*60*60*24*31,
                    1000*60*60*24*30,
                    1000*60*60*24*31,
                    ])
                setStepLabel('month')
                break
            case zoomfactor > 14544702:
                setStep([1000*60*60*24])
                setStepLabel('day')
                break
            case zoomfactor > 735259:
                setStep([1000*60*60])
                setStepLabel('hour')
                break
            case zoomfactor > 32274:
                setStep([1000*60])
                setStepLabel('minute')
                break
            default:
                setStep([1000])
                setStepLabel('second')
        }
    },[zoomfactor])

    


    return (
        <animated.div className='DateSelector' ref={selector} >
            <div className="Mask"  >
                <div {...bind()} className="touchMask"> </div>

                <DateSelectorScale className='scale' date={scaledate} zoomfactor={zoomfactor} ></DateSelectorScale>
                
                <div className="TriangleContainer" >
                    <svg height="40" width="20" className="Triangle">
                        <polygon points="20,5 20,35 12,20" />   
                    </svg> 
                </div>        
            </div>

        </animated.div>
                                  )
}
export default DateSelector
