import React, {useState, useEffect, useRef, memo} from 'react'
import WorldWind from 'webworldwind-esa';
import { useGesture, useDrag } from 'react-use-gesture'
import {useSpring, config, animated} from 'react-spring'
import { add, sub, scale } from 'vec-la'
import './Earth.css'
import LogPanel from '../logpanel';


// todo:
//      set limits to the navigator.camera


export const FluidWorldWindowController = memo( ({world, onSimpleClick}) => {

    const controllerRef = useRef()
    const MAX_ALT = 100000000
    const EYE_ALT = 2
    // to detect double taps
    const lastTap = useRef()
    const doubleTap = useRef()
    const button = useRef()
    const clicktimeout = useRef()
    const tilttimeout = useRef()
    const dragtimeout = useRef()

    //
    const gesturestartposition = useRef()
    // const [dragenabled, setdragenabled] = useState(true)
    const dragenabled = useRef(true)
    const rotationmode = useRef(false)
    const pinchmode = useRef('undefined')
    // const [logitems,setlogitems] = useState({})

    // debug snippet
    // add {debughtml} in returned dom
    // use with: logdebug({key:value,...})
    const debug = useRef()
    const [debugtext,setdebugtext] = useState([])
    const [{ x, y }, api] = useSpring(() => ({ x: 0, y: 0 }))
    const bind2 = useDrag(({ offset: [x, y] }) => api.start({ x, y }))
    const debughtml =     (      <animated.div {...bind2()} style={{ x, y }}  className='Debug'>{debugtext}</animated.div>)
    const logdebug = (items) => {
        let dd = []
        debug.current = {...debug.current,...items}
        // debugtext.current = []
        for (let [key, value] of Object.entries(debug.current)) {
            // console.log(`${key}: ${value}`);
            dd.push([key,value])
          }
          setdebugtext( dd.map( (item) => <div key={item[0]}>{item[0]}: {item[1]}</div> ))
    }    
    // end debug snippet  
    
    const detectDoubleTap = (e) => {
        button.current = e.button
        e.preventDefault()
        if (lastTap.current && (e.timeStamp - lastTap.current) < 300) {
            doubleTap.current = true
        } else {
            lastTap.current = e.timeStamp
            doubleTap.current = false
        }
    }


    const bind = useGesture({
        onDrag: ({  event, xy, vxvy, previous, first, down, initial, delta, movement, offset, velocity, direction, tap, scrolling, touches, pinching, origin}) => {

            if(first) {
                gesturestartposition.current = positionAtPickPoint(xy[0],xy[1])
                if(!gesturestartposition.current) {
                    gesturestartposition.current = positionAtPickPoint(world.current.canvas.clientWidth/2,world.current.canvas.clientHeight/2)
                }

                detectDoubleTap(event)
                if(doubleTap.current) clearTimeout(clicktimeout.current)
                // console.log('double:'+doubleTap.current+' tap: '+tap)
            }

            switch (true) {

                // case (touches === 2):
                //     // 2 finger tap: tilt
                //     handletilt(down, delta, false, first, vxvy)
                //     // tilttimeout.current = setTimeout(() => {
                //     //     handletilt(down, delta, false, first)
                //     // }, 300);                
                //     break


                case (!doubleTap.current && tap):  
                    // simple click or tap
                    clicktimeout.current = setTimeout(() => {
                        console.log("simple click")
                        handleSimpleClick(event)
                    }, 300);
                    break
                case (doubleTap.current && tap): {
                    clearTimeout(clicktimeout.current)

                    // double click or tap
                    console.log("double click")
                    northUp()
                    break
                }
                case ((!doubleTap.current && !tap) && button.current != 2 && touches !=2  ):
                    // Pan
                    // console.log('pan')
                    if(!dragenabled.current) return
                    zoomspring.stop()
                    pinchzoomspring.stop()
                    pinchrotatespring.stop()
                    pinchtiltspring.stop()
                    if (world.current.globe.is2D()) {
                        handlepan2d(event,initial,down,delta,offset,movement,velocity, direction, xy, previous,first,scrolling)
                    } else {
                        handlepan3d(event,initial,down,delta,offset,vxvy,velocity, direction, xy, previous,first,scrolling,touches,pinching)
                    }
                    break
                case (doubleTap.current && !tap):
                    // zoom
                    zoomspring.stop()
                    handlezoom(event,initial,down,delta,offset,movement,velocity, direction, xy, previous,first,scrolling)
                    break

                case (!doubleTap.current && !tap && button.current == 2):
                    // right click button: tilt and rotate
                    handletilt(down, delta, true)
                    break
    
        
                default:
                // console.log("default ")

            }

        },
        onDragend: () => {
            console.log('drag end')
        },
        onWheel: ({event, xy, previous, first, down, initial, delta, movement, offset, velocity, direction, tap, wheeling}) => {
            if(first) {
                gesturestartposition.current = positionAtPickPoint(event.clientX,event.clientY)
            }
            // delta[1] *= 0.1         
            // delta[0] *= 0.1         
            handlezoom(event,initial,down,delta,offset,movement,velocity, direction, xy, previous,first,wheeling)
        },
        onPinchStart: (origin)=>{
            dragenabled.current = false
            panspring.stop()
            zoomspring.stop()
            pinchzoomspring.stop()
            pinchrotatespring.stop()
            pinchzoomrotatespring.stop()
            pinchtiltspring.stop()
            // memo.lastY = origin[1]
            // gesturestartposition.current = positionAtPickPoint(origin[0],origin[1])
            pinchmode.current = 'undefined'

            // tilttimeout.current = setTimeout(() => {
            //     pinchmode.current = 'tilt'
            //     }, 300);        
                
        },
        onPinch: ({event, da, vdva, origin, pinching, delta, first, initial, direction, previous, elapsedTime, memo = {lastY:0} }) => {
            handlepinch(event, da, vdva, origin, pinching, delta, first, initial, direction, previous, memo, elapsedTime)
            memo.lastY = origin[1]
            return memo
        },
        onPinchEnd: () => { 
            clearTimeout(dragtimeout.current)
            dragtimeout.current = setTimeout(() => {
                dragenabled.current = true
                // logdebug({drag: (dragenabled.current)?'true':'false'})
                }, 300);
            pinchmode.current = 'undefined'
            
            //    console.log('pinch end')
        }
    },
    // {reset: false, drag: {useTouch: true}, filterTaps: true }
    {
        domTarget: controllerRef,
        drag: {useTouch: true},
        pinch: {useTouch: true},
        eventOptions: {passive: false}
    }
    )

    const normalize = (val,min,max)=> {
        var delta = max - min;
        return (val - min) / delta
    }

    function handleSimpleClick(event) {
        onSimpleClick(event)
    }
    // north up
    // todo: spring ?
    function northUp() {
        let headingIncrement = world.current.navigator.heading / -20;
        let runOperation = () => {
            if (Math.abs(world.current.navigator.heading) > Math.abs(headingIncrement)) {
                world.current.navigator.heading += headingIncrement;
                setTimeout(runOperation, 10);
            } else {
                world.current.navigator.heading = 0;
                rotationmode.current = false
            }
            world.current.redraw();
        };
        setTimeout(runOperation, 10);
    }

    // pinching
    const handlepinch = (event, da, vdva, origin, pinching, delta, first, initial, direction, previous, memo, elapsedTime) => {
        // if(first) console.log(event)
        // console.log(elapsedTime)
        if(pinchmode.current === 'undefined' && elapsedTime >= 100) {
            // console.log(initial)
            // pinchmode.current = (Math.abs(direction[0]) > Math.abs(direction[1]*1.2))?'zoom':'rotation'
            if(Math.abs(origin[1]-memo.lastY) > 4) {
                pinchmode.current = 'tilt' 
            } else pinchmode.current = 'zoomrotate' 
            // console.log(origin)
            // if(da[1]>3) pinchmode.current = 'rotation'
            // else if(da[0]>10) pinchmode.current = 'zoom'
        } 
        // if(pinchmode.current === 'undefined' && !first) {
        //     pinchmode.current = (Math.abs(direction[0]) > Math.abs(direction[1]*1.2))?'zoom':'rotation'
        //     clearTimeout(tilttimeout.current)    
        // }

        switch (pinchmode.current) {

            case 'tilt':
                handlepinchtilt(pinching, delta, origin, initial, memo)
                break

            // case 'zoom':
            //     // handlezoomrotate(pinching,delta)
            //     handlepinchzoom(pinching,delta,vdva)
            //     break

            // case 'rotation':
            //     handlepinchrotate(pinching, delta, vdva)
            //     break

            case 'zoomrotate':
                handlezoomrotate(pinching, delta, origin, vdva)
                break

            default:

            break
        }

    }

    const [{ pinchtiltvalue }, pinchtiltspring] = useSpring(() => ({ pinchtiltvalue: [0,0] }))
    const handlepinchtilt = (pinching, delta, origin, initial, memo ) => {
        pinchtiltspring.start({
            // pinchtiltvalue: delta,
            pinchtiltvalue: sub(origin,[0,memo.lastY]),
            immediate: pinching,
            // config: config.stiff,
            config: { mass: 1, tension: 100, friction: 40 },
            onChange: ()=>{
                let enabler = 1
                if(!pinching) pinchmode.current = 'undefined'
                // if (!pinching) enabler = (pinchtiltvalue.get()[1] < 0.2)?0:1
                let tiltfactor = (pinching)?0.5:0.2 
                world.current.navigator.tilt -= pinchtiltvalue.get()[1] * tiltfactor * enabler
                applyLimits()
                world.current.redraw()

            }
        })
    }



    const [{ pinchzoomrotatevalue }, pinchzoomrotatespring] = useSpring(() => ({ pinchzoomrotatevalue: [0,0] }))
    const handlezoomrotate = (pinching,delta,origin, vdva) => {
        let zenabler = 1
        let tenabler = 1
        if (!pinching) {
            zenabler = (Math.abs(vdva[0]) < 0.2)?0:1
            tenabler = (Math.abs(vdva[1]) < 0.2)?0:1
        }
        pinchzoomrotatespring.start({
            pinchzoomrotatevalue: delta,
            immediate: pinching,
            config: config.molasses,
            // config: {...config.molasses},
            // config: { mass: 1, tension: 100, friction: 40, duration: 200 },
            onChange: ()=>{
                let rangefactor = 1-pinchzoomrotatevalue.get()[0]/300 * zenabler
                moveZoom(gesturestartposition.current,rangefactor )
                world.current.navigator.range *= rangefactor 
                // logdebug({angle: pinchzoomrotatevalue.get()[1]})
                // logdebug({dist: pinchzoomrotatevalue.get()[0]})
                
                world.current.navigator.heading -= pinchzoomrotatevalue.get()[1] * tenabler
                if(world.current.navigator.heading !== 0) rotationmode.current = true

                // world.current.navigator.heading -= hpinchval.get()  
                applyLimits()

                world.current.redraw()

            }
        })        
    }

    const [{ pinchzoomvalue }, pinchzoomspring] = useSpring(() => ({ pinchzoomvalue: 0 }))
    const handlepinchzoom = (pinching,delta,vdva) => {
        let enabler = 1
        if (!pinching) enabler = (Math.abs(vdva[0]) < 0.2)?0:1
        pinchzoomspring.start({
            pinchzoomvalue: delta[0],
            immediate: pinching,
            // config: config.stiff,
            // config: {...config.molasses},
            config: { mass: 1, tension: 100, friction: 40 },
            onChange: ()=>{
                if(!pinching) pinchmode.current = 'undefined'
                let rangefactor = 1-pinchzoomvalue.get()/300 * enabler
                moveZoom(gesturestartposition.current,rangefactor)
                world.current.navigator.range *= rangefactor
                // world.current.navigator.heading -= hpinchval.get()  
                applyLimits()

                world.current.redraw()

            }
        })        
    }


    const [{ pinchrotatevalue }, pinchrotatespring] = useSpring(() => ({ pinchrotatevalue: 0 }))
    const handlepinchrotate = (pinching,delta,vdva) => {
        let enabler = 1
        if (!pinching) enabler = (Math.abs(vdva[1]) < 0.2)?0:1
        pinchrotatespring.start({
            pinchrotatevalue: delta[1],
            immediate: pinching,
            // config: config.stiff,
            config: { mass: 1, tension: 100, friction: 40 },
            // config: { mass: 1, tension: 100, friction: 40, duration: 200 },
            onChange: ()=>{
                    world.current.navigator.heading -= pinchrotatevalue.get() * enabler 
                    if(world.current.navigator.heading !== 0) rotationmode.current = true
                    applyLimits()

                    world.current.redraw()

            }
        })
    
    }


     // tilting
    const [{ tiltvalue }, tiltspring] = useSpring(() => ({ tiltvalue: [0,0] }))

    const handletilt = (down, delta, dorotation ) => {
        // let enabler = 1
        // if (!pinching) enabler = (Math.abs(vdva[1]) < 0.2)?0:1
        tiltspring.start({
            to: {tiltvalue: delta},
            immediate: down,
            // config: config.stiff,
            config: { mass: 1, tension: 100, friction: 40 },
            onChange: ()=>{
                let tiltoffset = -90 * tiltvalue.get()[1]*2 / world.current.canvas.clientHeight
                let headingoffset = -90 * tiltvalue.get()[0]*2 / world.current.canvas.clientWidth
                // world.current.navigator.tilt += tiltvalue.get()[1]/8
                world.current.navigator.tilt -= tiltoffset 
                if(dorotation) {
                    world.current.navigator.heading -= headingoffset
                    if(world.current.navigator.heading !== 0) rotationmode.current = true
                }
                applyLimits()
                world.current.redraw()

            }
        })
    }

    // panning
    const [{ panvalue }, panspring] = useSpring(() => ({ panvalue: [0,0] }))

    const handlepan2d = (event,initial,down,delta,offset,movement,velocity, direction, xy, previous,first,wheeling) => {
        let enabler = 1
        if (!down) enabler = (velocity < 0.2)?0:1
        let correction = (event.type === 'touchmove')?1:1
        // logdebug({pinching: pinching})
        panspring.start({
            panvalue: delta,
            // to: {panvalue: (down)?movement:add(movement,scale(movement,velocity))},
            // to: {panvalue: (down)?movement:movement[1]+movement[1]*velocity*5},
            immediate: down,
            // config: config.stiff,
            config: { mass: 1, tension: 150, friction: 80 },
            onChange: ()=>{
                let lookatxy = [world.current.canvas.clientWidth/2, world.current.canvas.clientHeight/2]
                let nextlookatxy = sub(lookatxy,scale(panvalue.get(),correction*enabler))
                let currentposition = positionAtPickPoint(lookatxy[0],lookatxy[1])
                if(!currentposition) console.log('no currentpos !')
                let nextposition = positionAtPickPoint(nextlookatxy[0],nextlookatxy[1])
                if(!nextposition) console.log('no nextposition !')

                let currentpoint = new WorldWind.Vec3(0,0,0)
                let nextpoint = new WorldWind.Vec3(0,0,0)
                if(!world.current.globe.computePointFromPosition(currentposition.latitude, currentposition.longitude, currentposition.altitude, currentpoint)) return
                if(!world.current.globe.computePointFromPosition(nextposition.latitude, nextposition.longitude, nextposition.altitude, nextpoint)) return

                let viewMatrix = WorldWind.Matrix.fromIdentity();
                world.current.computeViewingTransform(null, viewMatrix)
                viewMatrix.multiplyByTranslation(currentpoint[0] - nextpoint[0], currentpoint[1] - nextpoint[1], currentpoint[2] - nextpoint[2])

                // Compute the globe point at the screen center from the perspective of the transformed navigator state.
                var ray = world.current.rayThroughScreenPoint(world.current.canvasCoordinates(xy[0], xy[1]))

                viewMatrix.extractEyePoint(ray.origin);
                viewMatrix.extractForwardVector(ray.direction);

                let origin = new WorldWind.Vec3(0, 0, 0);

                if (!world.current.globe.intersectsLine(ray, origin)) {
                    return;
                }

                // Convert the transformed modelview matrix to a set of navigator properties, then apply those
                // properties to this navigator.
                let params = viewMatrix.extractViewingParameters(origin, world.current.navigator.roll, world.current.globe, {});
                world.current.navigator.lookAtLocation.copy(params.origin);
                world.current.navigator.range = params.range;
                world.current.navigator.heading = params.heading;
                world.current.navigator.tilt = params.tilt;
                world.current.navigator.roll = params.roll;
                applyLimits();
                world.current.redraw();


            },
            onRest: () => {
                // logdebug({status: 'finsished: '})
            }
        })
    }
       

    const handlepan3d = (event,initial,down,delta,offset,vxvy,velocity, direction, xy, previous,first,wheeling, touches,pinching) => {
        try {
            if(first){
                // can crash the drag:
                // if(Math.abs(gesturestartposition.current.latitude) > 85 || world.current.navigator.heading > 2 ) {
                if(Math.abs(gesturestartposition.current.latitude) > 80 || world.current.navigator.heading > 2 ) {
                    rotationmode.current = true
                }
            }
        } catch {
            console.log('Position at start not detected')
        }


        let enabler = 1
        if (!down) enabler = (velocity < 0.2)?0:1
        let correction = (event.type === 'touchmove')?1:1
        if(!down) correction *= 1

        panspring.start({
            panvalue: delta,
            // to: {panvalue: (down)?movement:add(movement,scale(movement,velocity))},
            // to: {panvalue: (down)?movement:movement[1]+movement[1]*velocity*5},
            immediate: down,
            // config: config.stiff,
            // config: { mass: 1, tension: 150, friction: 80 },
            config: { mass: 1, tension: 100, friction: 40 },
            onChange: ()=>{
                try{
                    let lookatxy = [world.current.canvas.clientWidth/2, world.current.canvas.clientHeight/2]
                    let nextlookatxy = sub(lookatxy,scale(panvalue.get(),correction*enabler))
                    let currentposition = positionAtPickPoint2(lookatxy[0],lookatxy[1])
                    if(!currentposition) console.log('no currentpos !')
                    let nextposition = positionAtPickPoint2(nextlookatxy[0],nextlookatxy[1])
                    if(!nextposition) console.log('no nextposition !')

                    let currentpoint = new WorldWind.Vec3(0,0,0)
                    let nextpoint = new WorldWind.Vec3(0,0,0)
                    if(!world.current.globe.computePointFromPosition(currentposition.latitude, currentposition.longitude, currentposition.altitude, currentpoint)) return
                    if(!world.current.globe.computePointFromPosition(nextposition.latitude, nextposition.longitude, nextposition.altitude, nextpoint)) return

                    let rotationVector = new WorldWind.Vec3(0, 0, 0)
                    let rotationAngle = computeRotationVectorAndAngle( nextpoint,currentpoint, rotationVector);
                    // logdebug({delta: panvalue.get()[1]})

                    if(nextposition && (nextposition.latitude > 80 || nextposition.latitude < -80) && rotationmode.current === false) {
                        console.log('out')
                        panspring.stop()
                        return
                    }
                    // nextposition.latitude = WorldWind.WWMath.clamp(nextposition.latitude,-80,80)


                    rotateShpere(rotationVector, rotationAngle, nextpoint, nextposition)
                    if(rotationmode.current === false) world.current.navigator.heading = 0
                    world.current.redraw()
                }
                catch {
                    console.log('probl !')
                }
            },
            onRest: () => {
                // logdebug({status: 'finsished: '})
            }
        })
    }


    // zooming
    const [{ range }, zoomspring] = useSpring(() => ({ range: [0,0] }))
    const handlezoom = (event,initial,down,delta,offset,movement,velocity, direction, xy, previous,first,wheeling) => {

        let enabler = 1
        if (!down) enabler = (velocity < 0.2)?0:0.5

        zoomspring.start({
            // to: {range: [1-delta[1]/200,0]},
            range: delta,
            immediate: (down||wheeling),
            // immediate: (down),
            // config: config.stiff,
            config: { mass: 1, tension: 100, friction: 40 },
            onChange: ()=>{
                    // logdebug({rangefactor: spring.value.range})
                    // let rangefactor = (enabler === 0)?1:range.get()[0]
                    let rangefactor = (enabler === 0)?1:1-range.get()[1]/(wheeling?300:300)
                    moveZoom(gesturestartposition.current,rangefactor)
                    world.current.navigator.range *= rangefactor
                    applyLimits()

                    world.current.redraw()

            },
            onRest: () => {
                // logdebug({status: 'finsished: '+world.current.navigator.range})
            }
        })

    }

    const moveZoom = function (refposition, amount) {
        if (!refposition || amount >= 1) return
        let lookAtLocation = world.current.navigator.lookAtLocation;
        let lookatAltitude = world.current.globe.elevationAtLocation(lookAtLocation.latitude, lookAtLocation.longitude)
        let lookAtPosition = new WorldWind.Position(lookAtLocation.latitude, lookAtLocation.longitude, lookatAltitude)
        let position
        if(amount <1) {
            position = WorldWind.Position.interpolateGreatCircle(
                amount, 
                refposition,
                lookAtPosition, 
                new WorldWind.Position(0, 0, 0)
                )
    
        } 
        else { // may be better to do nothing...
            return
            let intermediatePosition = WorldWind.Position.interpolateGreatCircle(
                1/amount, 
                refposition,
                lookAtPosition, 
                new WorldWind.Location(0, 0)
            )
            let distanceRadians = WorldWind.Location.greatCircleDistance(lookAtPosition, intermediatePosition)
            let greatCircleAzimuthDegrees = WorldWind.Location.greatCircleAzimuth(lookAtPosition, intermediatePosition)
            let location =  WorldWind.Location.greatCircleLocation(lookAtPosition, greatCircleAzimuthDegrees ,
                    distanceRadians, new WorldWind.Location(0, 0));
            position = new WorldWind.Position(location.latitude, location.longitude, intermediatePosition.altitude)
        }

        lookAtLocation.latitude = position.latitude;
        lookAtLocation.longitude = position.longitude;
        lookAtLocation.altitude = position.altitude;
    }


    const locationAtPickPoint = (x, y) => {
        var coordinates = world.current.canvasCoordinates(x, y)
        var pickList = world.current.pickTerrain(coordinates);

        for (var i = 0; i < pickList.objects.length; i++) {
            var pickedObject = pickList.objects[i];
            if (pickedObject.isTerrain) {
                var pickedPosition = pickedObject.position;
                if (pickedPosition) {
                    return new WorldWind.Location(pickedPosition.latitude, pickedPosition.longitude);
                }
            }
        }
    };

    
    const positionAtPickPoint2 = (x, y) => {

        // another way to do it (but no altitude):
        let ray = world.current.rayThroughScreenPoint(world.current.canvasCoordinates(x, y))
        let position = new WorldWind.Position(0,0,0)
        let intersectpoint = [0,0,0]
        if (world.current.globe.intersectsLine(ray, intersectpoint)) {
            world.current.globe.computePositionFromPoint(intersectpoint[0], intersectpoint[1], intersectpoint[2], position)
            return(position)
        }
        return null
    }

    const positionAtPickPoint = (x, y) => {

        let coordinates = world.current.canvasCoordinates(x, y)
        let pickList = world.current.pickTerrain(coordinates);

        for (let i = 0; i < pickList.objects.length; i++) {
            let pickedObject = pickList.objects[i];
            if (pickedObject.isTerrain) {
                let pickedPosition = pickedObject.position;
                if (pickedPosition) {
                    return new WorldWind.Position(pickedPosition.latitude, pickedPosition.longitude, pickedPosition.altitude);
                }
            }
        }

    };

    const computeRotationVectorAndAngle = function (vec1, vec2, rotationVector) {
        var angleRad = WorldWind.MeasurerUtils.angleBetweenVectors(vec1, vec2);
        var angle = angleRad * WorldWind.Angle.RADIANS_TO_DEGREES;
        rotationVector.copy(vec1);
        rotationVector.cross(vec2);
        rotationVector.normalize();
        return angle;
    };

    const rotateShpere = function (rotationVector, angle, nextpoint, nextposition) {
        if (!isFinite(angle) || !isFinite(rotationVector[0]) || !isFinite(rotationVector[1]) || !isFinite(rotationVector[2])) {
            return false;
        }

        var wwd = world.current;
        var navigator = wwd.navigator;
        var viewMatrix = WorldWind.Matrix.fromIdentity();
        var altitude = navigator.lookAtLocation.altitude;
        var tilt = navigator.tilt;
        var scratchRay = new WorldWind.Line(new WorldWind.Vec3(0, 0, 0), new WorldWind.Vec3(0, 0, 0));
        
        navigator.tilt = 0;
        wwd.computeViewingTransform(null, viewMatrix);
        viewMatrix.multiplyByRotation(rotationVector[0], rotationVector[1], rotationVector[2], angle);

        viewMatrix.extractEyePoint(scratchRay.origin);
        viewMatrix.extractForwardVector(scratchRay.direction);
        if (!wwd.globe.intersectsLine(scratchRay, nextpoint)) {
            navigator.tilt = tilt;
            return false;
        }

        var params = viewMatrix.extractViewingParameters(nextpoint, navigator.roll, wwd.globe, {});
        // if (Math.abs(navigator.heading) < 5 && Math.abs(navigator.lookAtLocation.latitude < 70) && Math.abs(nextposition.latitude) < 70) {
        //     navigator.heading = Math.round(params.heading);
        //     console.log('rounding')
        // }
        // else {
        //     navigator.heading = params.heading;
        // }

        navigator.heading = params.heading;

        navigator.lookAtLocation.copy(params.origin);
        navigator.lookAtLocation.altitude = altitude;
        navigator.tilt = tilt;

        return true;
    }


    const applyLimits = () => {
        let nav = world.current.navigator
        nav.camera.applyLimits() // not sure if not done by default by www
        nav.range = WorldWind.WWMath.clamp(
            nav.range, 
            world.current.globe.elevationAtLocation(nav.lookAtLocation.latitude, nav.lookAtLocation.longitude) + EYE_ALT, 
            MAX_ALT 
        )
        nav.tilt = WorldWind.WWMath.clamp(nav.tilt,0,80)
        // logdebug({
        //     range: nav.range, 
        //     lookAtlat: nav.lookAtLocation.latitude, 
        //     lookAtlon: nav.lookAtLocation.longitude, 
        //     lookAtalt: nav.lookAtLocation.altitude, 
        //     clookAtalt: world.current.globe.elevationAtLocation(nav.lookAtLocation.latitude, nav.lookAtLocation.longitude),
        //     // initlat: gesturestartposition.current.latitude,
        //     // initlon: gesturestartposition.current.longitude,
        // })
    
    }

    useEffect(() => {
        // this prevents the browser from intercepting the right click
        window.addEventListener("contextmenu", e => e.preventDefault());
    },[])


    return (
        <div>
            <div className={'EarthController'} ref={controllerRef}></div>
            {/* <div  className='Debug'>
                {debugtext.current}
            </div> */}
            {/* <animated.div {...bind2()} style={{ x, y }}  className='Debug'>
                {debugtext}
            </animated.div> */}
            {/* {debughtml} */}
            {/* <LogPanel items={logitems}/> */}
        </div>
    )

    
})