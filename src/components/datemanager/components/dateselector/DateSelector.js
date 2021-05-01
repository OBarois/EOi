import React, {useState, useEffect, useRef} from 'react'
import {useSpring, animated} from 'react-spring'
import { useGesture, useDrag } from 'react-use-gesture'
import { add, scale } from 'vec-la'
import DateSelectorScale from './DateSelectorScale'
import useLog from '../../../../hooks/useLog.js';



import './DateSelector.css';
// import { start } from 'repl';

function DateSelector({startdate, onDateChange, onFinalDateChange, onStepChange}) {


    // const [ setlog, renderlog] = useLog()
    // const [ setlog2, renderlog2] = useLog()

    // zoomfactor of the date scale: ms/pixel
    const MAXZOOM = 1000*60*60*24*15
    const MINZOOM = 1000
    const DEFZOOM = 1000*60*60
    const ZOOMDIR = -1
    const lastZoom = useRef(DEFZOOM)
    const [zoomfactor, setZoomfactor ] = useState(DEFZOOM)

    const selector = useRef()

    const [scaledate, setScaledate ] = useState(startdate)
    // const debouncedScaledate = useDebounce(scaledate, 10);

    // const [lastStartdate, setlLastStartdate ] = useState(startdate)
    
    const [status, setstatus ] = useState(false)
    const [step, setStep ] = useState([60000])
    const [stepLabel, setStepLabel ] = useState('hour')

    // to detect double taps
    const lastTap = useRef()
    const doubleTap = useRef()
    const button = useRef()

    const startingdate = useRef(startdate)
    const runningdate = useRef(startdate)
    const discreetdate = useRef(startdate)
    const lastPos = useRef(0)

    const detectDoubleTap = (e) => {
        const now = Date.now();
        button.current = e.button
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

    const [{ test }, springtest] = useSpring(() => ({ test: 0 }))
    const [{ y }, springtest2] = useSpring(() => ({ y: 0 }))
    
    const bind = useGesture({

        onDragEnd: () => { // sert a rien!
            // setstatus(false)

                // lastZoom.current = zoomfactor
        },

        // va trop vite !!
        onWheel: ( {active, delta, first, down, direction, velocity, xy, movement, memo = posy_wheel.get() } ) => {
            // console.log(down)
            // console.log(first)
            setstatus(active)
            setyOnWheel.start({                 
                posy_wheel: movement[1]/2 + lastPos.current, 
                immediate: true, 
                config: { mass: 1, tension: 100, friction: 80, precision:0.1 },
                onChange: ()=>{
                    console.log('y / posy / movement / memo:  '+xy[1]+'/ '+posy_wheel.get()+'/ '+movement[1]+'/ '+lastPos.current)
                    if (!first) {
                        // let newdate = new Date(lastStartdate.getTime() + Math.ceil(posy_wheel.getValue() * zoomfactor  / step) * step)
                        let newdate = new Date(discreetdate.current.getTime() + Math.ceil(movement[1] * zoomfactor  / step[0]) * step[0]) 
                        discreetdate.current = newdate
                        onDateChange(newdate)
                        }
                        lastPos.current = posy_wheel.get()

                    // setlLastStartdate(newdate)
                },
                onRest: ()=>{
                    if (!down) {
                        // setstatus(false)
                        let newdate = new Date(discreetdate.current.getTime() + Math.ceil(posy_wheel.get() * zoomfactor  / step[0]) * step[0]) 
                        onFinalDateChange(newdate)
                        discreetdate.current = newdate
                        setScaledate(newdate)
                        onDateChange(newdate)
                        lastPos.current=0
                    }
                }
            })
        return memo
        },


        onDrag: ({  event, active, first, down, touches, delta, initial, distance, velocity, direction, shiftKey, xy, movement,vxvy}) => {
            setstatus(active)

            if (first) {
                // setstatus(true)

                // setstatus(active)
                // handleDoubleTap()
                detectDoubleTap(event)

                // setlLastStartdate(scaledate)
                startingdate.current = scaledate
                // setlog2({ startingdate: startingdate.current.toJSON()  })

   
            }

            // setlog2({velocity1: velocity})
            velocity = (velocity < 0.2)?0:velocity

            if (doubleTap.current || shiftKey) {
                let zoom = lastZoom.current + lastZoom.current / 50 *  delta[1] * ZOOMDIR
                if (zoom < MINZOOM) zoom = MINZOOM
                if (zoom > MAXZOOM) zoom = MAXZOOM
                setZoomfactor(zoom)
                // temp.xy = [0,0]
                lastZoom.current = zoom
                // setlog({zoomfactor:zoomfactor})
                // temp.lastdelta = delta
                return
                // if(!down) setActive(false)
            }

 

            // Working !!
            springtest.start({  
                // test: scale(delta,[0,zoomfactor]),
                // test: delta[1]*zoomfactor,
                test: (down)?movement[1]:movement[1]+movement[1]*velocity*5,
                immediate: down,
                config: { mass: 1, tension: 100, friction: 25, precision: 0.1 },
                onChange: () => {
                    setstatus(true)
                    // if(Math.floor(Math.abs(test.get()*zoomfactor   / step[0]))==0) test.stop()

                    let even = (test.get()<0 ? Math.ceil:Math.floor)
                        // setlog({anim:test.get(), velocity: velocity*5})

                        if(stepLabel==='month') {
                            let nbstep = Math.ceil(test.get() * zoomfactor  / step[0])
                            // setlog({olddate:discreetdate.current.toJSON()})
                            let adate = new Date(startingdate.current.getTime())
                            adate.setUTCMonth( adate.getUTCMonth()-nbstep )
                            discreetdate.current = adate
                            // setlog({newdate:discreetdate.current.toJSON()})
                        } else {
                            discreetdate.current = new Date(startingdate.current.getTime() - Math.ceil(test.get()*zoomfactor   / step[0]) * step[0])
                        }
                        

                    // } else {
                    //     discreetdate.current = new Date(discreetdate.current.getTime() - even(test.get()*zoomfactor   / step[0]) * step[0])
                    //     // runningdate.current = new Date(runningdate.current.getTime() - even(spring.value.test*zoomfactor ))
                    //     setlog({nbsteps:even(test.get()*zoomfactor   / step[0])})
                    // }
                    
                    
                    setScaledate(discreetdate.current)
                    onDateChange(discreetdate.current)
                },
                onRest: (spring) => {
                    if (!down) {
                        console.log('res2t')
                        onFinalDateChange(discreetdate.current)
                        setstatus(false)
                    }
                },
                // stop: (spring)=>{
                //     let even = (test.get()<0 ? Math.ceil:Math.floor)
                //     return (even(test.get()*zoomfactor   / step[0])<=0)
                // }
            })   


        }
    },
    // {initial: ()=> [0,test.get()],drag: {useTouch: true} }
    {drag: {useTouch: true} }
    )


    const moveToDate = (newdate) => {
        // console.log('go to')
        if (!status) {
            let deltaoffset = [0,(discreetdate.current.getTime() - newdate.getTime())  / zoomfactor]
            
            sety2({ 
                xy2: deltaoffset,
                immediate: false, 
                config: {reset: false, config: {duration: 200} },
                onChange: ()=>{
                    // setlog(({animgoto: xy2.get()[1]}))
                    let adate = new Date(discreetdate.current.getTime() - xy2.get()[1] * zoomfactor)
                    // discreetdate.current = adate
                    setScaledate(adate)
                    onDateChange(adate)
                },
                onRest: (spring)=>{
                //     // setActive(false)
                    onFinalDateChange(discreetdate.current)
                }
            })
        }

    }

    useEffect(() => {
        console.log('startdate changed')
        if(!status) {
            moveToDate(startdate)
        }
    },[startdate])

    // useEffect(() => {
    //     console.log('laststartdate changed: '+lastStartdate.toJSON())
    // },[lastStartdate])

    // useEffect(() => {
    //     console.log('Selector active: '+status)
    // },[status])


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
            case zoomfactor > 94544702:
                setStep([1000*60*60*24*12])
                setStepLabel('cycle')
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
        <div>
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
            {/* {renderlog()}
            {renderlog2()} */}
        </div>
                                   )
}
export default DateSelector
