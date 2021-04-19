import React, {useEffect, useState, useGlobal } from 'reactn';
import './Earth.css'
import { useEww } from "./useEww"
import { useHotkeys } from 'react-hotkeys-hook'






function Earth({ viewdate, id, clat, clon, alt, starfield, atmosphere, names, background }) {

    const [mapSettings, setMapSettings] = useGlobal('mapSettings')

    const [mapSet, setMapSet] = useState(mapSettings)

    // const toggleAtmosphere = () => setMapSet((mapSet)=>({...mapSet, atmosphere:!mapSet.atmosphere}))
    // const toggleStarfield = () => setMapSet((mapSet)=>({...mapSet, starfield:!mapSet.starfield}))
    // const toggleNames = () => setMapSet((mapSet)=>({...mapSet, names:!mapSet.names}))
    // const toggleBg = () => setMapSet((mapSet)=>({...mapSet, background:Math.random()}))



    const {
        ewwstate,
        moveTo,
        addGeojson,
        removeGeojson,
        addWMS,
        toggleProjection,
        // toggleAtmosphere,
        toggleStarfield,
        toggleNames,
        toggleBg,
        toggleOv,
        toggleModel,
        setTime,
        toggleDem,
        northUp
    } = useEww({
        id: id,
        clat: clat,
        clon: clon,
        alt: alt,
        starfield: mapSettings.starfield,
        atmosphere: mapSettings.atmosphere,
        background: mapSettings.background,
        names: mapSettings.names
    })

    useHotkeys("p",toggleProjection)  
    useHotkeys("c",removeGeojson)
    useHotkeys("u",northUp)
    useHotkeys("b",() => setMapSet((mapSet)=>({...mapSet, background:Math.random()})))  
    useHotkeys("m",toggleModel)
    useHotkeys("d",toggleDem)
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
        setTime(viewdate.getTime())
    },[viewdate])

    useEffect(() => {
        console.log("mapset:")
        console.log(mapSet)
        setMapSettings(mapSet)
    }, [mapSet]);

    useEffect(() => {
        console.log("mapSettings:")
        console.log(mapSettings)
    }, [mapSettings]);



    // useEffect(() => {
    //     toggleStarfield(starfield)
    // },[starfield])

    // useEffect(() => {
    //     setNames(names)
    // },[names])

    // useEffect(() => {
    //     toggleAtmosphere(atmosphere)
    // },[atmosphere])

    // useEffect(() => {
    //     toggleBg()
    //     console.log("bg changed")
    // },[background])



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
