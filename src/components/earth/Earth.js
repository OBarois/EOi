import React, { useEffect} from 'react'
import './Earth.css'
import { useEww } from "./useEww"
import { useHotkeys } from 'react-hotkeys-hook'






function Earth({ viewdate, id, clat, clon, alt, starfield, atmosphere, names, background }) {

    const {
        ewwstate,
        moveTo,
        addGeojson,
        removeGeojson,
        addWMS,
        toggleProjection,
        toggleAtmosphere,
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
        starfield: starfield,
        atmosphere: atmosphere,
        background: background,
        names: names
    })

    useHotkeys("p",toggleProjection)  
    useHotkeys("c",removeGeojson)
    useHotkeys("u",northUp)
    useHotkeys("b",toggleBg)
    useHotkeys("m",toggleModel)
    useHotkeys("d",toggleDem)
    useHotkeys("o",toggleOv)
    useHotkeys("a",(state)=>toggleAtmosphere(!state))  
    useHotkeys("s",(state)=>toggleStarfield(!state))
    useHotkeys("n",(state)=>toggleNames(!state))  

    useEffect(() => {
        setTime(viewdate.getTime())
    },[viewdate, setTime])

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
