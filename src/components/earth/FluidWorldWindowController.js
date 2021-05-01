import React, {useState, useEffect, useRef} from 'react'
import WorldWind from 'webworldwind-esa';
import { useGesture, useDrag } from 'react-use-gesture'
import {useSpring, config, animated} from 'react-spring'
// import { sub, scale } from 'vec-la'
import './Earth.css'
import LogPanel from '../logpanel';


// todo:
//      set limits to the navigator.camera


export default function FluidWorldWindowController({world}) {


    // to detect double taps
    const lastTap = useRef()
    const doubleTap = useRef()
    const button = useRef()
    const clicktimeout = useRef()

    //
    const pointerLocation = useRef()
    const [logitems,setlogitems] = useState({})

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
    // const [{ y }, api] = useSpring(() => ({ y: 0 }))

    

    const bind = useGesture({
        onDrag: ({  event, xy, previous, first, down, initial, delta, movement, offset, velocity, direction, tap}) => {

            if(first) {
                detectDoubleTap(event)
            }

            switch (true) {
                case (doubleTap.current && tap): {
                    console.log("north up")
                    clearTimeout(clicktimeout.current)
                    break
                }
                case (!doubleTap.current && tap && button.current == 0):  
                    clicktimeout.current = setTimeout(() => {
                        console.log("simple click")
                      }, 300);
                    break
                case (!doubleTap.current && !tap && button.current == 0):
                    // should cancel animations here
                    zoomspring.stop()
                    console.log("pan")
                    break
                case (doubleTap.current && !tap):
                    // console.log("zoom")
                    zoom(initial,down,delta,offset,movement,velocity, direction, xy, previous,first)
                    break

                case (!doubleTap.current && !tap && button.current == 2):
                    console.log("tilt")
                    break

                default:
                console.log("default ")

            }

        },
        onWheel: ({}) => {
            console.log('zoom')
        }
    },
    {reset: false, drag: {useTouch: true}, filterTaps: true }
    )

    const normalize = (val,min,max)=> {
        var delta = max - min;
        return (val - min) / delta
    }

    const [{ scale }, zoomspring] = useSpring(() => ({ scale: 1 }))
    const zoom = (initial,down,delta,offset,movement,velocity, direction, xy, previous,first) => {

        if(first) {
            console.log('first')
            console.log(locationAtPickPoint(xy[0], xy[1]))

            pointerLocation.current = locationAtPickPoint(xy[0], xy[1])
        }

        zoomspring.start({
            to: {scale: 1-delta[1]/250},
            immediate: down,
            // config: config.stiff,
            config: { mass: 1, tension: 100, friction: 40 },
            onChange: (spring)=>{
                    logdebug({movc: movement[1]})
                    logdebug({delta: delta[1]})
                    logdebug({x: initial[0]})
                    logdebug({y: initial[1], scale: scale.get()})
                    setlogitems({x: initial[0], y: initial[1],scale: spring.value.scale})
                    setlogitems({scalec: spring.value.scale})

                    moveZoom(initial[0],initial[1],spring.value.scale)
                    world.current.navigator.range *= spring.value.scale
                    world.current.redraw()

            },
            onRest: () => {
                logdebug({status: 'finsished: '+world.current.navigator.range})
            }
        })

    }
    const moveZoom = function (x, y, amount) {
        var lookAtLocation = world.current.navigator.lookAtLocation;
        pointerLocation.current = locationAtPickPoint(x, y);
        if (!pointerLocation.current) return
        let intermediateLocation = WorldWind.Location.interpolateGreatCircle(
            amount, 
            pointerLocation.current,
            lookAtLocation, 
            new WorldWind.Location(0, 0)
            )

        var distanceRadians = WorldWind.Location.greatCircleDistance(lookAtLocation, intermediateLocation);

        var greatCircleAzimuthDegrees = WorldWind.Location.greatCircleAzimuth(lookAtLocation, intermediateLocation);

        var location = WorldWind.Location.greatCircleLocation(lookAtLocation, greatCircleAzimuthDegrees ,
            distanceRadians, new WorldWind.Location(0, 0));
        lookAtLocation.latitude = location.latitude;
        lookAtLocation.longitude = location.longitude;
    }

    const moveZoom2 = function (x, y, amount) {
        if (amount === 1) {
            return;
        }

        pointerLocation.current = locationAtPickPoint(x, y);

        if (!pointerLocation.current) {
            console.log("outside globe!")
            return;
        }

        var lookAtLocation = world.current.navigator.lookAtLocation;
        var location;

        if (amount < 1) {
            // var distanceRemaining = Location.greatCircleDistance(lookAtLocation,
            //     this.pointerLocation) * this.wwd.globe.equatorialRadius;

            // if (distanceRemaining <= 50000) {
            //     console.log("below")
            //     location = this.pointerLocation;
            // }
            // else {
            //     location = Location.interpolateGreatCircle(amount, this.pointerLocation,
            //         lookAtLocation, new Location(0, 0));
            // }
            location = WorldWind.Location.interpolateGreatCircle(amount, pointerLocation.current,
                lookAtLocation, new WorldWind.Location(0, 0));
        }
        else {
            var intermediateLocation = WorldWind.Location.interpolateGreatCircle(1 / amount, pointerLocation.current,
                lookAtLocation, new WorldWind.Location(0, 0));

            var distanceRadians = WorldWind.Location.greatCircleDistance(lookAtLocation, intermediateLocation);

            var greatCircleAzimuthDegrees = WorldWind.Location.greatCircleAzimuth(lookAtLocation, intermediateLocation);

            location = WorldWind.Location.greatCircleLocation(lookAtLocation, greatCircleAzimuthDegrees - 180,
                distanceRadians, new WorldWind.Location(0, 0));
        }

        lookAtLocation.latitude = location.latitude;
        lookAtLocation.longitude = location.longitude;
    };

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

    useEffect(() => {
        window.addEventListener("contextmenu", e => e.preventDefault());
    },[])


    return (
        <div>
            <div {...bind()} className={'EarthController'} ></div>
            {/* <div  className='Debug'>
                {debugtext.current}
            </div> */}
            {/* <animated.div {...bind2()} style={{ x, y }}  className='Debug'>
                {debugtext}
            </animated.div> */}
            {debughtml}
            {/* <LogPanel items={logitems}/> */}
        </div>
    )

    
}