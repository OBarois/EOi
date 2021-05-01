import React, {useEffect, useState, useGlobal } from 'reactn';
import './Earth.css'
import { useEww } from "./useEww"
import { useHotkeys } from 'react-hotkeys-hook'
import FluidWorldWindowController from './FluidWorldWindowController'





function Earth({ id, alt }) {

    const [mapSettings, setMapSettings] = useGlobal('mapSettings')
    const [ position, setPosition] = useGlobal('position')
    const [ altitude, setAltitude] = useGlobal('altitude')
    const [ viewDate, setViewDate] = useGlobal('viewDate')
    const [ satellites, setSatellites ] = useGlobal('satellites')

    const [mapSet, setMapSet] = useState(mapSettings)
    const [sat, setSat] = useState(satellites)


    const {
        eww,
        ewwstate,
        moveTo,
        addGeojson,
        removeGeojson,
        addWMS,
        toggleProjection,
        toggleOv,
        toggleModel,
        setTime,
        toggleDem,
        northUp
    } = useEww({
        id: id,
        clat: position.clat,
        clon: position.clon,
        alt: altitude,
        starfield: mapSettings.starfield,
        atmosphere: mapSettings.atmosphere,
        background: mapSettings.background,
        overlay: mapSettings.overlay,
        satellites: satellites,
        names: mapSettings.names,
        dem: mapSettings.dem
    })

    useHotkeys("p",toggleProjection)  
    useHotkeys("c",removeGeojson)
    useHotkeys("u",northUp)
    useHotkeys("b",() => setMapSet((mapSet)=>({...mapSet, background:mapSet.background+1})))  
    useHotkeys("m",() => setSat((sat)=>(!sat)))  
    // useHotkeys("m",() => setSatellites((satellites)=>(!satellites)))  
    useHotkeys("d",() => setMapSet((mapSet)=>({...mapSet, dem:!mapSet.dem})))  
    useHotkeys("o",() => setMapSet((mapSet)=>({...mapSet, overlay:mapSet.overlay+1})))  
    useHotkeys("a",() => setMapSet((mapSet)=>({...mapSet, atmosphere:!mapSet.atmosphere})))  
    useHotkeys("s",() => setMapSet((mapSet)=>({...mapSet, starfield:!mapSet.starfield})))  
    useHotkeys("n",() => setMapSet((mapSet)=>({...mapSet, names:!mapSet.names})))  

    // useHotkeys("a",(mapSettings) => setMapSettings({...mapSettings, atmosphere:!mapSettings.atmosphere}))

    // const toggleAtmosphere = () => setMapSettings((mapSettings)=>({...mapSettings, atmosphere:!mapSettings.atmosphere}))
    // const toggleStarfield = () => setMapSettings((mapSettings)=>({...mapSettings, starfield:!mapSettings.starfield}))
    // const toggleNames = () => setMapSettings((mapSettings)=>({...mapSettings, names:!mapSettings.names}))
    // const toggleBg = () => setMapSettings((mapSettings)=>({...mapSettings, background:Math.random()}))

    useEffect(() => {
        setAltitude(ewwstate.altitude)
    },[ewwstate.altitude])


    useEffect(() => {
        setTime(viewDate.getTime())
    },[viewDate])

    useEffect(() => {
        setMapSettings(mapSet)
    }, [mapSet]);

    useEffect(() => {
        // console.log(mapSettings)
        setMapSet(mapSettings)
    }, [mapSettings]);

    useEffect(() => {
        setSatellites(sat)
    }, [sat]);

    useEffect(() => {
        setSat(satellites)
    }, [satellites]);
    
    useEffect(() => {
        console.log("eww changed")
    }, [eww]);
    
    useEffect(() => {
        console.log("world created"+' / '+position.clat+' / '+position.clon+' / '+altitude)
        setTimeout(() => {
            moveTo(position.clat, position.clon, altitude) 
        }, 1000)

    }, []);
    


    let globeStyle = {
        background: 'black',
        position: "fixed",
        left: 0,
        top: 10,
        width: '100%',
        height: '100%'
    };

    let globeControllerStyle = {
        background: 'red',
        position: "fixed",
        left: '100px',
        bottom:'100px',
        width: '100%',
        height: '200px',
    };

        
    return (
        <div>
            <canvas className={'Earth'} id={id} />
            {/* <canvas id={id} style={globeStyle} /> */}
            <FluidWorldWindowController world={eww}/>
        </div>
    );
}

export default Earth
