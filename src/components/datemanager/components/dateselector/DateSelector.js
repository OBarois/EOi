import React, {useState, useEffect, useRef, useCallback} from 'react'
import {useSpring} from 'react-spring'
import { useGesture } from 'react-use-gesture'
// import { add, scale } from 'vec-la'
import DateSelectorScale from './DateSelectorScale'
// import useLog from '../../../../hooks/useLog.js';



import './DateSelector.css';
// import { start } from 'repl';

function DateSelector({startdate, tics, gotoscalezoom, onDateChange, onFinalDateChange, onStepChange, onZoomChange, satcycle, leftHanded, searchWinStart, searchWinEnd}) {


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

    
    const isActive = useRef(false)
    // const [step, setStep ] = useState([60000])
    const [stepLabel, setStepLabel ] = useState('hour')
    // const [cycle, setcycle ] = useState('hour')

    // to detect double taps
    const lastTap = useRef()
    const lastTapdate = useRef(new Date(0))
    const doubleTap = useRef()
    const button = useRef()

    const startingdate = useRef(startdate)
    const discreetdate = useRef(startdate)
    const cycle = useRef(satcycle)
    const step = useRef(satcycle)

    // const setStep = (value) => step.current = value

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
        //     isActive.current = false
        //     onFinalDateChange(discreetdate.current)
        //     console.log('finaldate')
        //         // lastZoom.current = zoomfactor
        // },

        onWheel: ( {active, delta, first, down, direction, velocity, xy, movement, wheeling, ctrlKey, shiftKey } ) => {
            // console.log(down)
            // console.log(first)
            
            if (first) {
                springtest.stop()
            //   isActive.current = true
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
                    isActive.current = true
                    let newdate
                    const rounder = (posy_wheel.get() < 0)?Math.ceil:Math.floor
                    let nbstep = rounder(posy_wheel.get() * zoomfactor  / step.current[0])
                    if(nbstep === 0) {
                        // onFinalDateChange(discreetdate.current)
                        // isActive.current = false
                        setyOnWheel.stop()
                        // return
                    }
                    if(stepLabel==='month') {
                        
                        // setlog({olddate:discreetdate.current.toJSON()})
                        newdate = new Date(discreetdate.current.getTime())
                        newdate.setUTCMonth( newdate.getUTCMonth()-nbstep )
                        // setlog({newdate:discreetdate.current.toJSON()})
                    } else { 
                        newdate = new Date(discreetdate.current.getTime() - nbstep * step.current[0]) 
                    }
                    discreetdate.current = newdate
                    setScaledate(newdate)
                    onDateChange(newdate)
                },
                onRest: ()=>{
                    if (!wheeling) {
                        onFinalDateChange(discreetdate.current)
                        isActive.current = false
                    }
                }
            })
        },
        onDragStart: ()=>{
            isActive.current = true
        },

        onDrag: ({  event, active, first, down, touches, offset, delta, initial, distance, velocity, direction, shiftKey, ctrlKey, xy, movement,vxvy, wheeling}) => {
            event.preventDefault()
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
                    isActive.current = true
                    

                    // if(Math.floor(Math.abs(test.get()*zoomfactor   / step.current[0]))==0) test.stop()

                    // let even = (test.get()<0 ? Math.ceil:Math.floor)
                        // setlog({anim:test.get(), velocity: velocity*5})

                        // this avoids the double tap to be detected while touch dragging fast
                        if(Math.abs(movement[1]) > 5) lastTap.current = new Date(0)

                        if(stepLabel==='month') {
                            let nbstep = Math.ceil(test.get() * zoomfactor  / step.current[0])
                            // setlog({olddate:discreetdate.current.toJSON()})
                            let adate = new Date(startingdate.current.getTime())
                            adate.setUTCMonth( adate.getUTCMonth()-nbstep )
                            discreetdate.current = adate
                            // setlog({newdate:discreetdate.current.toJSON()})
                        } else {
                            discreetdate.current = new Date(startingdate.current.getTime() - Math.ceil(test.get()*zoomfactor   / step.current[0]) * step.current[0])
                        }
                        
                    
                    setScaledate(discreetdate.current)
                    onDateChange(discreetdate.current)
                    // lastTapdate.current = new Date(0)
                },
                onRest: () => {
                    if (!down) {
                        // console.log('rest')
                        onFinalDateChange(discreetdate.current)
                        isActive.current = false
                    }
                },
                // stop: (spring)=>{
                //     let even = (test.get()<0 ? Math.ceil:Math.floor)
                //     return (even(test.get()*zoomfactor   / step.current[0])<=0)
                // }
            }) 


        },
        onDragEnd: (down) => { 
            // isActive.current = false
            onFinalDateChange(discreetdate.current)
            isActive.current = false


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

    // // new approach where spring value is the actual zoom value
    // const [ {zoom2} , springzoom2] = useSpring(() => ( {zoom2: 0} ))
    // const handleZoom2 = (delta,down,velocity,offset,wheeling,movement,vxvy) => {
    //     // console.log('delta / vy: '+delta[1]+ ' / '+vxvy[1])
    //     let deltadest = down?delta[1]:vxvy[1]*1000
    //     let newzoom = zoomfactor - deltadest * zoomfactor/100
    //     let zoomdest = Math.max(newzoom,MINZOOM)
    //     zoomdest = Math.min(zoomdest,MAXZOOM)
    //     springzoom2.start({
    //         zoom2: zoomdest,
    //         immediate: down,
    //         config: { mass: 1, tension: 170, friction: 25},
    //         onChange: () => {
    //             setZoomfactor(zoom2.get())
    //             // console.log(zoom.get())
    //         },
    //         onProps: ()=> {

    //         }
    //     })
        
    // }

    const [{ xy2 }, sety2] = useSpring(() => ({ xy2: [0,0] }))
    const moveToDate = useCallback( (newdate) => {
        // console.log('go from: '+discreetdate.current.toJSON()+' to: '+newdate.toJSON())
        if(newdate.getTime() === discreetdate.current.getTime()) return
        let fromtime = discreetdate.current.getTime()
        // sety2.stop()
        // if (!isActive.current) {
            let deltaoffset = [0,(fromtime - newdate.getTime())  ]

            sety2.start({ 
                from: {xy2: [0,0]},
                to: {xy2: deltaoffset},
                immediate: false, 
                config: {reset: true, duration: 300 },
                // config: { mass: 1, tension: 100, friction: 25, precision: 0.1 },
                onChange: ()=>{
                    // setlog(({animgoto: xy2.get()[1]}))
                    // isActive.current = true

                    let adate = new Date(fromtime - xy2.get()[1] )
                    // console.log('adate: '+adate.toJSON() )
                    discreetdate.current = adate
                    setScaledate(adate)
                    onDateChange(adate)
                },
                onRest: ()=>{
                    // isActive.current = false
                // console.log("rest move")
                    onFinalDateChange(discreetdate.current)
                }
            })
        // }

    }, [])

    useEffect(() => {
        if(!isActive.current) {
            moveToDate(startdate)
        } 
    },[startdate, moveToDate])

    useEffect(() => {
        console.log('gotoscalezoom: '+gotoscalezoom)
        if(gotoscalezoom) {
            setZoomfactor(gotoscalezoom)
            lastZoom.current = gotoscalezoom
        }
        switch (gotoscalezoom) {
            case 'year':
                setZoomfactor(1029135270)
                lastZoom.current = 1029135270
                break
            case 'month':
                setZoomfactor(167184283)
                lastZoom.current = 167184283
                break
            case 'day':
                setZoomfactor(17046262)
                lastZoom.current = 17046262
                break
            case 'hour':
                setZoomfactor(735260)
                lastZoom.current = 735260
                break
            case 'minute':
                setZoomfactor(32276)
                lastZoom.current = 32276
                break
            case 'second':
                setZoomfactor(1058)
                lastZoom.current = 1058
                break
        }

    },[gotoscalezoom])


// },[startdate, resetToStartDateTrigger])

    // useEffect(() => {
    //     console.log('laststartdate changed: '+lastStartdate.toJSON())
    // },[lastStartdate])

    // useEffect(() => {
    //     console.log('Selector active: '+isActive.current)
    // },[isActive.current])


    useEffect(() => {
        onStepChange(stepLabel)
    },[stepLabel,onStepChange])

    // useEffect(() => {
    //     console.log(searchWindow/86400000+' Days')
    // },[searchWindow])

    useEffect(() => {
        console.log('cycle changed to: '+satcycle)
        cycle.current = satcycle
        if(stepLabel === 'cycle') {
            console.log('new step')
            step.current= [satcycle]
        }
    },[satcycle])

    
    useEffect(() => {
        // console.log(zoomfactor)
        switch (true) {
            case zoomfactor > 120426316:
                step.current = [
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
                    ]
                setStepLabel('month')
                break
            case zoomfactor > 94544702:
                step.current = [cycle.current]
                setStepLabel('cycle')
                break
            case zoomfactor > 14544702:
                step.current = [1000*60*60*24]
                setStepLabel('day')
                break
            case zoomfactor > 735259:
                step.current = [1000*60*60]
                setStepLabel('hour')
                break
            case zoomfactor > 32274:
                step.current = [1000*60]
                setStepLabel('minute')
                break
            default:
                step.current = [1000]
                setStepLabel('second')
        }
        onZoomChange(zoomfactor)
    },[zoomfactor])

    


    return (
        <div>
            <div className={leftHanded?'DateSelectorL':'DateSelector'} ref={selector} >
            <div {...bind()} className={leftHanded?"touchMaskL":"touchMask"}> </div>
            <div className="Mask"  >

                    <DateSelectorScale className={leftHanded?'scale lefthanded':'scale'} 
                        date={scaledate} 
                        zoomfactor={zoomfactor} 
                        resulttics={tics} 
                        lefthanded={leftHanded} 
                        searchWinStart={searchWinStart}
                        searchWinEnd={searchWinEnd}>
                    </DateSelectorScale>
                    
                    <div className={leftHanded?'TriangleContainerL':'TriangleContainer'} >
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
