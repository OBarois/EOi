import React, {useState, useEffect, useRef} from 'react'
import WorldWind from 'webworldwind-esa';
import { useGesture } from 'react-use-gesture'
import {useSpring} from 'react-spring'
import { sub, scale } from 'vec-la'
import './Earth.css'


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
    const range = useRef()
    
    
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
    {reset: true, drag: {useTouch: true}, filterTaps: true }
    )

    const [{ posxy_drag}, setyOnDrag] = useSpring(() => ({ posxy_drag: [0,0]  }))


    const zoom = (initial,down,delta,offset,movement,velocity, direction, xy, previous,first) => {

        velocity= Math.sqrt(velocity)
        // console.log('velocity: '+velocity)
        if (first) {
            range.current = world.current.navigator.range
            console.log("staring from range: "+range.current)
            // setyOnDrag.stop()
        }

        setyOnDrag({                 
            posxy_drag:  movement,
            immediate: down, 
            config: { velocity: scale(direction, velocity),  decay: true},
            onFrame: ()=>{
                // if (first) {
                //     range.current = world.current.navigator.range
                //     console.log("staring from range: "+range.current)
                // }

                // console.log('movement:  '+movement)
                // console.log(down+" "+posxy_drag.getValue()[1]+" / "+previous[1])
                let scale = 1 - (posxy_drag.getValue()[1])/1000
                let newrange = range.current * scale
                // console.log("newrange: "+newrange)
                // moveZoom(initial[0],initial[1],scale)
                // console.log("scale:"+scale)
                world.current.navigator.range = newrange;
                world.current.navigator.camera.applyLimits()
                world.current.redraw();

            },
            onRest: ()=>{
                // console.log('rest')
            }
        })

    }

    const moveZoom = function (x, y, amount) {
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
            var intermediateLocation = Location.interpolateGreatCircle(1 / amount, pointerLocation.current,
                lookAtLocation, new Location(0, 0));

            var distanceRadians = Location.greatCircleDistance(lookAtLocation, intermediateLocation);

            var greatCircleAzimuthDegrees = Location.greatCircleAzimuth(lookAtLocation, intermediateLocation);

            location = Location.greatCircleLocation(lookAtLocation, greatCircleAzimuthDegrees - 180,
                distanceRadians, new Location(0, 0));
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
        <div {...bind()} className={'EarthController'} onClick={()=>console.log('click')}></div>
    )

    
}