import React, {useEffect, useState, useGlobal, useRef, useMemo } from 'reactn';
import './Earth.css'
import { useEww } from "./useEww"
import { useHotkeys } from 'react-hotkeys-hook'
import { useDebounce } from '../../hooks/useDebounce';
import {FluidWorldWindowController} from './FluidWorldWindowController'
import InfoPanel from "../infopanel"
import LookAtWidget from './LookAtWidget'
import ViewProductControl from './ViewProductControl'

const Earth = ({ id, alt }) => {


    const [mapSettings, setMapSettings] = useGlobal('mapSettings')
    const [ position, setPosition] = useGlobal('position')
    const [ altitude, setAltitude] = useGlobal('altitude')
    const [ viewDate, setViewDate] = useGlobal('viewDate')
    const [ geojson, setgeojson] = useGlobal('geojson')
    const [ clearGeojsonTrigger, ] = useGlobal('clearGeojsonTrigger')
    const [ searchPoint, setSearchPoint] = useGlobal('searchPoint')
    const [ closestItem, setclosestItem] = useGlobal('closestItem')
    const [ pointSearchMaxAltitude, ] = useGlobal('pointSearchMaxAltitude')
    const [ selectedProduct, setselectedProduct] = useGlobal('selectedProduct')
    const [ goToDate, setgoToDate ] = useGlobal('goToDate')
    

    const [mapSet, setMapSet] = useState(mapSettings)
    const [lookwidget, setlookwidget] = useState(false)

    const debouncedclosestItem = useDebounce(closestItem, 200)

    const handleSimpleClick = (e) => {
        let selection = getRenderables(e.pageX,e.pageY)
        setselectedProduct( selection )

    }

    const {
        eww,
        QL,
        ewwstate,
        moveTo,
        addGeojson,
        removeGeojson,
        addQuicklook,
        removeQuicklooks,
        getRenderables,
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
        satellites: mapSettings.satellites,
        names: mapSettings.names,
        dem: mapSettings.dem
    })

    useHotkeys("p",toggleProjection)  
    useHotkeys("c",removeGeojson)
    useHotkeys("u",northUp)
    useHotkeys("b",() => setMapSet((mapSet)=>({...mapSet, background:mapSet.background+1})))  
    useHotkeys("m",() => setMapSet((mapSet)=>({...mapSet, satellites:!mapSet.satellites})))
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

    // const [QLimage,setQLimage] = useState(ewwstate.image)

    useEffect(() => {
        setAltitude(ewwstate.altitude)
    },[ewwstate.altitude])

    useEffect(() => {
        setSearchPoint(ewwstate.viewpoint)
    },[ewwstate.viewpoint])

    // useEffect(() => {
    //     setQLimage(ewwstate.image)
    //     // qlzone.current.src = ewwstate.image
    // },[ewwstate.image])
    useEffect(() => {
        setclosestItem(ewwstate.closestRenderable)
    },[ewwstate.closestRenderable])



    useEffect(() => {
        setTime(viewDate.getTime())
    },[viewDate])

    useEffect(() => {
        // console.log(geojson)
        if(geojson !== null) {
            // removeGeojson()
            addGeojson(geojson,viewDate.getTime())
        } 
    },[geojson])

    useEffect(() => {
        removeGeojson()
        removeQuicklooks()
    }, [clearGeojsonTrigger]);

    useEffect(() => {
        setMapSettings(mapSet)
    }, [mapSet]);

    useEffect(() => {
        // console.log(mapSettings)
        setMapSet(mapSettings)
    }, [mapSettings]);

    useEffect(() => {
        // console.log('edclosestItem)
        if(mapSettings.quicklooks)
            addQuicklook(debouncedclosestItem)

    }, [debouncedclosestItem]);

    useEffect(() => {
        setlookwidget(()=>(altitude<pointSearchMaxAltitude))
     }, [pointSearchMaxAltitude,altitude]);
 
     useEffect(() => {
        // console.log(selectedProduct)
        if(selectedProduct.length > 0) {
            console.log(selectedProduct[0])
            let p = selectedProduct[0]
            let lat = p._sector.minLatitude
            let lon = p._sector.minLongitude
            console.log('lat/lon: '+lat+' / '+lon)
            // moveTo(lat, lon)
            setPosition({clat: lat, clon: lon})
            setgoToDate(selectedProduct[0].timeRange[1])
        }
    }, [selectedProduct]);

    useEffect(() => {
        moveTo(position.clat, position.clon)
     }, [position.clat,position.clon]);
 
 
    
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
            {useMemo(
                () => { return(<canvas className={'Earth'} id={id} />)},
                [mapSettings]
            )}
            {/* <canvas id={id} style={globeStyle} /> */}
            <FluidWorldWindowController world={eww} onSimpleClick={handleSimpleClick}/>
            <LookAtWidget active={lookwidget}/>
            <ViewProductControl active='true'/>
            {/* <InfoPanel top= '100px' left= '5px'>
                <div className='Quiklook'><img src={QLimage?QLimage.src:''}  alt='' width='150px'/></div>
            </InfoPanel> */}
        </div>
    );
}

export default Earth
