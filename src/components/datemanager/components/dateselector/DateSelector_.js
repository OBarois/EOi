import React, {useState, useEffect, useRef} from 'react'
import {useSpring, animated} from 'react-spring'
import { useGesture } from 'react-use-gesture'
import { add, sub, scale } from 'vec-la'
import DateSelectorScale from './DateSelectorScale'

import './DateSelector.css';
// import { start } from 'repl';

function DateSelector({startdate, onDateChange, onFinalDateChange, onStepChange}) {

    const MAXZOOM = 1000*60*60*24*15
    const MINZOOM = 1000
    const DEFZOOM = 1000*60*60
    
    const selector = useRef()
    const lastZoom = useRef()
    const lastPos = useRef()
    if(!lastZoom.current) lastZoom.current = DEFZOOM
    if(!lastPos.current) lastPos.current = 0

    
    const [scaledate, setScaledate ] = useState(startdate)
    // const debouncedScaledate = useDebounce(scaledate, 10);

    const [lastStartdate, setlLastStartdate ] = useState(startdate)
    
    const [active, setActive ] = useState(false)
    const [step, setStep ] = useState(60000)
    const [stepLabel, setStepLabel ] = useState('hour')

    // zoomfactor: how long is a pixel in ms
    const [zoomfactor, setZoomfactor ] = useState(DEFZOOM)
    if (!lastZoom.current) lastZoom.current = DEFZOOM

    // to detect double taps
    const lastTap = useRef()
    const doubleTap = useRef()


    const handleDoubleTap = () => {
        const now = Date.now();
        if (lastTap.current && (now - lastTap.current) < 300) {
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
                posy_wheel: movement[1] + lastPos.current, 
                immediate: false, 
                config: { },
                onFrame: ()=>{
                    // console.log('y / posy / movement / memo:  '+xy[1]+'/ '+posy_wheel.getValue()+'/ '+movement[1]+'/ '+lastPos.current)
                    if (!first) {
                        let newdate = new Date(lastStartdate.getTime() + Math.ceil(posy_wheel.getValue() * zoomfactor  / step) * step)
                        setScaledate(newdate)
                        onDateChange(newdate)
                        }
                        // lastPos.current = posy_wheel.getValue()

                    // setlLastStartdate(newdate)
                },
                onRest: ()=>{
                    if (!down) {
                        setActive(false)
                        let newdate = new Date(lastStartdate.getTime() + Math.ceil(posy_wheel.getValue() * zoomfactor  / step) * step)
                        onFinalDateChange(newdate)
                        setlLastStartdate(newdate)
                        // lastPos.current=0
                    }
                }
            })
        return memo
        },

        onDrag: ({  event, first, down, delta, velocity, direction, shiftKey, xy, movement, temp = {
            lastzoom: zoomfactor,
            lastdelta: [0,0],
            currentzoom: zoomfactor
            }
        }) => {
            //event.preventDefault()
            let zoom

            if (first) {
                console.log('shiftKey: '+shiftKey)
                setActive(true)
                handleDoubleTap()
                setlLastStartdate(scaledate)
                lastPos.current = 0
                
            }

            if (doubleTap.current || shiftKey) {
                console.log('in double tap')
                console.log(' / movement / delta :  '+'/ '+movement[1]+'/ '+ delta[1] )
                // zoom = temp.currentzoom + temp.currentzoom / 50 * (temp.lastdelta[1] - delta[1] )
                zoom = temp.currentzoom + temp.currentzoom / 50 *  delta[1] 
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
                immediate: down, 
                // immediate: false, 
                config: { velocity: scale(direction, velocity), decay: true},
                onFrame: ()=>{
                    // console.log('y / movement / delta:  '+xy[1]+'/ '+movement[1]+'/ '+delta[1])
                    if (!first) {
                        let newdate = new Date(lastStartdate.getTime() - Math.ceil(posxy_drag.getValue()[1] * zoomfactor  / step) * step)
                        setScaledate(newdate)
                        onDateChange(newdate)
                        }

                    // setlLastStartdate(newdate)
                },
                onRest: ()=>{
                    if (!down) {
                        setActive(false)
                        let newdate = new Date(lastStartdate.getTime() - Math.ceil(posxy_drag.getValue()[1] * zoomfactor  / step) * step)
                        onFinalDateChange(newdate)
                        setlLastStartdate(newdate)
                    }
                }
            })
            return temp
        }
    },
    {reset: true}
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
                setStep(1000*60*60*24*30)
                setStepLabel('month')
                break
            case zoomfactor > 14544702:
                setStep(1000*60*60*24)
                setStepLabel('day')
                break
            case zoomfactor > 735259:
                setStep(1000*60*60)
                setStepLabel('hour')
                break
            case zoomfactor > 32274:
                setStep(1000*60)
                setStepLabel('minute')
                break
            default:
                setStep(1000)
                setStepLabel('second')
        }
    },[zoomfactor])

    


    return (
        <animated.div className='DateSelector' ref={selector} >
            <div className="Mask"  >
                <div {...bind()} className="touchMask"> </div>

                <DateSelectorScale className='scale' date={scaledate} zoomfactor={zoomfactor} step={step}></DateSelectorScale>
                
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
