import React, {useEffect, useState, useGlobal } from 'reactn';
import './Earth.css'
import { useEww } from "./useEww"
import { useHotkeys } from 'react-hotkeys-hook'






function Earth({ id, alt }) {

    const [mapSettings, setMapSettings] = useGlobal('mapSettings')
    const [ position, setPosition] = useGlobal('position')
    const [ viewDate, setViewDate] = useGlobal('viewDate')

    const [mapSet, setMapSet] = useState(mapSettings)


    const {
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
        alt: alt,
        starfield: mapSettings.starfield,
        atmosphere: mapSettings.atmosphere,
        background: mapSettings.background,
        names: mapSettings.names,
        dem: mapSettings.dem
    })

    useHotkeys("p",toggleProjection)  
    useHotkeys("c",removeGeojson)
    useHotkeys("u",northUp)
    useHotkeys("b",() => setMapSet((mapSet)=>({...mapSet, background:mapSet.background+1})))  
    useHotkeys("m",toggleModel)
    useHotkeys("d",() => setMapSet((mapSet)=>({...mapSet, dem:!mapSet.dem})))  
    useHotkeys("o",toggleOv)
    useHotkeys("a",() => setMapSet((mapSet)=>({...mapSet, atmosphere:!mapSet.atmosphere})))  
    useHotkeys("s",() => setMapSet((mapSet)=>({...mapSet, starfield:!mapSet.starfield})))  
    useHotkeys("n",() => setMapSet((mapSet)=>({...mapSet, names:!mapSet.names})))  

    // useHotkeys("a",(mapSettings) => setMapSettings({...mapSettings, atmosphere:!mapSettings.atmosphere}))

    // const toggleAtmosphere = () => setMapSettings((mapSettings)=>({...mapSettings, atmosphere:!mapSettings.atmosphere}))
    // const toggleStarfield = () => setMapSettings((mapSettings)=>({...mapSettings, starfield:!mapSettings.starfield}))
    // const toggleNames = () => setMapSettings((mapSettings)=>({...mapSettings, names:!mapSettings.names}))
    // const toggleBg = () => setMapSettings((mapSettings)=>({...mapSettings, background:Math.random()}))



    useEffect(() => {
        console.log('date chsnged')
        setTime(viewDate.getTime())
    },[viewDate])

    useEffect(() => {
        setMapSettings(mapSet)
    }, [mapSet]);

    useEffect(() => {
        setMapSet(mapSettings)
    }, [mapSettings]);

    let globeStyle = {
        background: 'black',
        position: "fixed",
        left: 0,
        width: '100%',
        height: '100%'
    };
        
    return (
            <canvas id={id} style={globeStyle} />
    );
}

export default Earth
