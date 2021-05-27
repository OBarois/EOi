import React, {useState, useEffect, useRef} from 'react'
import {useSpring} from 'react-spring'
import { useGesture } from 'react-use-gesture'
// import { add, scale } from 'vec-la'
import DateSelectorScale from './DateSelectorScale'
// import useLog from '../../../../hooks/useLog.js';



import './DateSelector.css';
// import { start } from 'repl';

function DateSelector({startdate, resetToStartDateTrigger, tics, onDateChange, onFinalDateChange, onStepChange}) {


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
    
    const [Selector_is_active, setSelector_is_active ] = useState(false)
    const [step, setStep ] = useState([60000])
    const [stepLabel, setStepLabel ] = useState('hour')

    // to detect double taps
    const lastTap = useRef()
    const lastTapdate = useRef(new Date(0))
    const doubleTap = useRef()
    const dragging = useRef(false)
    const draggingTimeout = useRef()
    const button = useRef()

    const startingdate = useRef(startdate)
    const discreetdate = useRef(startdate)

    const detectDoubleTap = (e) => {
        const now = Date.now();
        button.current = e.button
        // console.log(lastTapdate.current.getTime()-discreetdate.current.getTime())
        // if (lastTap.current && (now - lastTap.current) < 300  && Math.abs(lastTapdate.current.getTime()-scaledate.getTime()) < 1 ) {
        if (lastTap.current && (now - lastTap.current) < 300 ) {
            doubleTap.current = true
        } else {
            lastTap.current = now
            lastTapdate.current = scaledate
            doubleTap.current = false
        }
    }


    const [{ posy_wheel }, setyOnWheel] = useSpring(() => ({posy_wheel: 0 }))
    const [{ zoom }, springzoom] = useSpring(() => ({ zoom: 0 }))

    const [{ test }, springtest] = useSpring(() => ({ test: 0 }))
    
    const bind = useGesture({

        // onWheelEnd: () => { 
        //     setSelector_is_active(false)
        //     onFinalDateChange(discreetdate.current)
        //     console.log('finaldate')
        //         // lastZoom.current = zoomfactor
        // },

        onWheel: ( {active, delta, first, down, direction, velocity, xy, movement, wheeling, ctrlKey, shiftKey } ) => {
            // console.log(down)
            // console.log(first)
            
            if (first) {
                springtest.stop()
            //   setSelector_is_active(true)
              discreetdate.current = scaledate
            }

            if (ctrlKey || shiftKey) {

                springzoom.start({
                    zoom: delta[1],
                    immediate: true,
                    config: { mass: 1, tension: 100, friction: 25, precision: 0.1 },
                    onChange: () => {
                        let newzoom = lastZoom.current + lastZoom.current / 300 * zoom.get() * ZOOMDIR
                        // let newzoom = lastZoom.current + zoom.get() * ZOOMDIR *5000
                        if (newzoom < MINZOOM) newzoom = MINZOOM
                        if (newzoom > MAXZOOM) newzoom = MAXZOOM
                        setZoomfactor(newzoom)
                        lastZoom.current = newzoom
        
                    }
                })
                return
            }

            setyOnWheel.start({                 
                posy_wheel: delta[1], 
                immediate: true, 
                config: { mass: 1, tension: 100, friction: 40},
                onChange: ()=>{
                    setSelector_is_active(true)
                    let newdate
                    const rounder = (posy_wheel.get() < 0)?Math.ceil:Math.floor
                    let nbstep = rounder(posy_wheel.get() * zoomfactor  / step[0])
                    if(nbstep === 0) {
                        // onFinalDateChange(discreetdate.current)
                        // setSelector_is_active(false)
                        setyOnWheel.stop()
                        // return
                    }
                    if(stepLabel==='month') {
                        
                        // setlog({olddate:discreetdate.current.toJSON()})
                        newdate = new Date(discreetdate.current.getTime())
                        newdate.setUTCMonth( newdate.getUTCMonth()-nbstep )
                        // setlog({newdate:discreetdate.current.toJSON()})
                    } else { 
                        newdate = new Date(discreetdate.current.getTime() - nbstep * step[0]) 
                    }
                    discreetdate.current = newdate
                    setScaledate(newdate)
                    onDateChange(newdate)
                },
                onRest: ()=>{
                    if (!wheeling) {
                        onFinalDateChange(discreetdate.current)
                        setSelector_is_active(false)
                    }
                }
            })
        },
        onDragStart: ()=>{
            setSelector_is_active(true)
        },

        onDrag: ({  event, active, first, down, touches, offset, delta, initial, distance, velocity, direction, shiftKey, ctrlKey, xy, movement,vxvy, wheeling}) => {
            if (first) {
                setyOnWheel.stop()
                detectDoubleTap(event)
                startingdate.current = discreetdate.current
                // setlog2({ startingdate: startingdate.current.toJSON()  })

   
            }

            // setlog2({velocity1: velocity})
            velocity = (velocity < 0.2)?0:velocity

            if ((doubleTap.current || shiftKey || ctrlKey || button.current === 2) ) {
                // let zoom = lastZoom.current + lastZoom.current / 50 *  delta[1] * ZOOMDIR
                // if (zoom < MINZOOM) zoom = MINZOOM
                // if (zoom > MAXZOOM) zoom = MAXZOOM
                // setZoomfactor(zoom)
                // lastZoom.current = zoom


                handleZoom(delta,down,velocity,false)
                // handleZoom2(delta,down,velocity,offset,wheeling,movement,vxvy)
                
                // 
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
                    setSelector_is_active(true)
                    

                    // if(Math.floor(Math.abs(test.get()*zoomfactor   / step[0]))==0) test.stop()

                    // let even = (test.get()<0 ? Math.ceil:Math.floor)
                        // setlog({anim:test.get(), velocity: velocity*5})

                        // this avoids the double tap to be detected while touch dragging fast
                        if(Math.abs(movement[1]) > 5) lastTap.current = new Date(0)


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
                        
                    
                    setScaledate(discreetdate.current)
                    onDateChange(discreetdate.current)
                    // lastTapdate.current = new Date(0)
                },
                onRest: () => {
                    if (!down) {
                        // console.log('rest')
                        onFinalDateChange(discreetdate.current)
                        setSelector_is_active(false)
                    }
                },
                // stop: (spring)=>{
                //     let even = (test.get()<0 ? Math.ceil:Math.floor)
                //     return (even(test.get()*zoomfactor   / step[0])<=0)
                // }
            }) 


        },
        onDragEnd: (down) => { 
            // setSelector_is_active(false)
            onFinalDateChange(discreetdate.current)
            setSelector_is_active(false)


                // lastZoom.current = zoomfactor
        }
    },
    // {initial: ()=> [0,test.get()],drag: {useTouch: true} }
    {drag: {useTouch: true} }
    )

    const handleZoom = (delta,down,velocity,wheeling) => {
        let enabler = 1
        if (!down) enabler = (velocity < 0.2)?0:0.5

        springzoom.start({
            zoom: delta[1],
            immediate: down,
            config: { mass: 1, tension: 100, friction: 25, precision: 0.1 },
            onChange: () => {
                let newzoom = lastZoom.current + lastZoom.current / 50 *  zoom.get() * ZOOMDIR * enabler
                if (newzoom < MINZOOM) newzoom = MINZOOM
                if (newzoom > MAXZOOM) newzoom = MAXZOOM
                setZoomfactor(newzoom)
                lastZoom.current = newzoom

            }
        })
    }

    // new approach where spring value is the actual zoom value
    const [ {zoom2} , springzoom2] = useSpring(() => ( {zoom2: 0} ))
    const handleZoom2 = (delta,down,velocity,offset,wheeling,movement,vxvy) => {
        // console.log('delta / vy: '+delta[1]+ ' / '+vxvy[1])
        let deltadest = down?delta[1]:vxvy[1]*1000
        let newzoom = zoomfactor - deltadest * zoomfactor/100
        let zoomdest = Math.max(newzoom,MINZOOM)
        zoomdest = Math.min(zoomdest,MAXZOOM)
        springzoom2.start({
            zoom2: zoomdest,
            immediate: down,
            config: { mass: 1, tension: 170, friction: 25},
            onChange: () => {
                setZoomfactor(zoom2.get())
                // console.log(zoom.get())
            },
            onProps: ()=> {

            }
        })
        
    }

    const [{ xy2 }, sety2] = useSpring(() => ({ xy2: [0,0] }))
    const moveToDate = (newdate) => {
        // console.log('go from: '+discreetdate.current.toJSON()+' to: '+newdate.toJSON())
        let fromtime = discreetdate.current.getTime()
        // sety2.stop()
        // if (!Selector_is_active) {
            let deltaoffset = [0,(fromtime - newdate.getTime())  ]

            sety2.start({ 
                from: {xy2: [0,0]},
                to: {xy2: deltaoffset},
                immediate: false, 
                config: {reset: true, duration: 300 },
                // config: { mass: 1, tension: 100, friction: 25, precision: 0.1 },
                onChange: ()=>{
                    // setlog(({animgoto: xy2.get()[1]}))
                    // setSelector_is_active(true)

                    let adate = new Date(fromtime - xy2.get()[1] )
                    // console.log('adate: '+adate.toJSON() )
                    discreetdate.current = adate
                    setScaledate(adate)
                    onDateChange(adate)
                },
                // onRest: ()=>{
                //     // setSelector_is_active(false)
                // console.log("rest move")
                //     onFinalDateChange(discreetdate.current)
                // }
            })
        // }

    }

    useEffect(() => {
        // console.log('startdate changed')
        if(!Selector_is_active) {
            // console.log(startdate.toJSON())
            moveToDate(startdate)
        }
    },[startdate, resetToStartDateTrigger])

    // useEffect(() => {
    //     console.log('laststartdate changed: '+lastStartdate.toJSON())
    // },[lastStartdate])

    // useEffect(() => {
    //     console.log('Selector active: '+Selector_is_active)
    // },[Selector_is_active])


    useEffect(() => {
        onStepChange(stepLabel)
    },[stepLabel,onStepChange])

    
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
            <div className='DateSelector' ref={selector} >
            <div {...bind()} className="touchMask"> </div>
            <div className="Mask"  >

                    <DateSelectorScale className='scale' date={scaledate} zoomfactor={zoomfactor} resulttics={tics}></DateSelectorScale>
                    
                    <div className="TriangleContainer" >
                        <svg height="40" width="20" className="Triangle">
                            <polygon points="20,5 20,35 12,20" />   
                        </svg> 
                    </div>        
                </div>
            </div>
            {/* {renderlog()}
            {renderlog2()} */}
        </div>
                                   )
}
export default DateSelector
