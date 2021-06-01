import React, {useEffect, useState, useGlobal, useRef, useMemo } from 'reactn';
import './Earth.css'
import { useEww } from "./useEww"
import { useHotkeys } from 'react-hotkeys-hook'
import { useDebounce } from '../../hooks/useDebounce';
import {FluidWorldWindowController} from './FluidWorldWindowController'
import InfoPanel from "../infopanel"
import LookAtWidget from './LookAtWidget'
import ViewProductControl from './ViewProductControl'
import { useKey } from 'rooks'

const Earth = ({ id, alt }) => {


    const [mapSettings, setMapSettings] = useGlobal('mapSettings')
    const [ position, setPosition] = useGlobal('position')
    const [ altitude, setAltitude] = useGlobal('altitude')
    const [ viewDate, setViewDate] = useGlobal('viewDate')
    const [ geojson, setgeojson] = useGlobal('geojson')
    const [ clearResultsTrigger, ] = useGlobal('clearResultsTrigger')
    const [ addQuicklookWMSTrigger, setaddQuicklookWMSTrigger] = useGlobal('addQuicklookWMSTrigger')
    const [ searchPoint, setSearchPoint] = useGlobal('searchPoint')
    const [ closestItem, setclosestItem] = useGlobal('closestItem')
    const [ pointSearchMaxAltitude, ] = useGlobal('pointSearchMaxAltitude')
    const [ selectedProduct, setselectedProduct] = useGlobal('selectedProduct')
    const [ moveToClosestItemTrigger, setmoveToClosestItemTrigger ] = useGlobal('moveToClosestItemTrigger')
    const [ resetStartDateTrigger, setresetStartDateTrigger] = useGlobal('resetStartDateTrigger')
    

    const [ goToDate, setgoToDate ] = useGlobal('goToDate')
    // const [atm, setAtm] = useGlobal('mapSettings.atmosphere')


    const [productOn, setproductOn] = useState(true)
    const [lookwidget, setlookwidget] = useState(false)

    const debouncedclosestItem = useDebounce(closestItem, 200)

    const handleSimpleClick = (e) => {
        let selection = getRenderables(e.pageX,e.pageY)
        if (selection.length === 0) return
        if(selectedProduct === selection[0]) {
            setaddQuicklookWMSTrigger(Math.random())
        } else {
            setselectedProduct( selection[0] )
        }
        
    }

    const {
        eww,
        ewwstate,
        initMap,
        moveTo,
        addGeojson,
        removeGeojson,
        toggleGeojson,
        toggleQuicklooks,
        addQuicklook,
        removeQuicklooks,
        getRenderables,
        addQuicklookWMS,
        removeQuicklookWMS,
        toggleQuicklookWMS,
        toggleProjection,
        toggleAtmosphere,
        toggleStarfield,
        toggleBg,
        toggleNames,
        toggleOv,
        toggleModel,
        setTime,
        toggleDem,
        northUp
    } = useEww({
        id: id,
    })

    useKey(['p'],() => setMapSettings({...mapSettings, projection:mapSettings.projection+1})) 
    useKey(['c'],removeGeojson)
    useKey(['u'],northUp)
    useKey(['w'],()=>toggleQuicklookWMS(null))
    useKey(['b'],() => setMapSettings({...mapSettings, background:mapSettings.background+1})) 
    useKey(['m'],() => setMapSettings({...mapSettings, satellites:!mapSettings.satellites}))
    useKey(['d'],() => setMapSettings({...mapSettings, dem:!mapSettings.dem}))
    useKey(['o'],() => setMapSettings({...mapSettings, overlay:mapSettings.overlay+1}))
    // useHotkeys("a",() => setMapSettings((mapSettings)=>({...mapSettings, atmosphere:!mapSettings.atmosphere})))  
    useKey(['a'],() =>  setMapSettings({...mapSettings, atmosphere:!mapSettings.atmosphere}))
    useKey(['s'],() => setMapSettings({...mapSettings, starfield:!mapSettings.starfield}))
    useKey(['n'],() => setMapSettings({...mapSettings, names:!mapSettings.names}))

    // useHotkeys("a",(mapSettings) => setMapSettings({...mapSettings, atmosphere:!mapSettings.atmosphere}))

    // const toggleAtmosphere = () => setMapSettings((mapSettings)=>({...mapSettings, atmosphere:!mapSettings.atmosphere}))
    // const toggleStarfield = () => setMapSettings((mapSettings)=>({...mapSettings, starfield:!mapSettings.starfield}))
    // const toggleNames = () => setMapSettings((mapSettings)=>({...mapSettings, names:!mapSettings.names}))
    // const toggleBg = () => setMapSettings((mapSettings)=>({...mapSettings, background:Math.random()}))

    // const [QLimage,setQLimage] = useState(ewwstate.image)

    useEffect(() => {
        setAltitude(ewwstate.altitude)
        if(ewwstate.altitude > 3000000) setproductOn(true)
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
        setproductOn(true)
    },[viewDate])

    useEffect(() => {
        toggleGeojson(productOn)
        toggleQuicklooks(productOn)
        toggleQuicklookWMS(!productOn)
    },[productOn])

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
        removeQuicklookWMS()
        setselectedProduct(null)
        setclosestItem(null)
        setgoToDate(null)
  
    }, [clearResultsTrigger]);

    useEffect(() => {
        toggleAtmosphere(mapSettings.atmosphere)
    }, [mapSettings.atmosphere]);

    useEffect(() => {
        toggleModel(mapSettings.satellites)
    }, [mapSettings.satellites]);

    useEffect(() => {
        toggleStarfield(mapSettings.starfield)
    }, [mapSettings.starfield]);

    useEffect(() => {
        toggleNames(mapSettings.names)
    }, [mapSettings.names]);

    useEffect(() => {
        toggleProjection(mapSettings.projection)
    }, [mapSettings.projection]);

    useEffect(() => {
        toggleBg(mapSettings.background)
    }, [mapSettings.background]);

    useEffect(() => {
        toggleOv(mapSettings.overlay)
    }, [mapSettings.overlay]);

    useEffect(() => {
        toggleDem(mapSettings.dem)
    }, [mapSettings.dem]);

    useEffect(() => {
        toggleQuicklooks(mapSettings.quicklooks)
    }, [mapSettings.quicklooks]);

    useEffect(() => {
        if(mapSettings.quicklooks)
            addQuicklook(debouncedclosestItem)
    }, [debouncedclosestItem]);

    useEffect(() => {
        setlookwidget(()=>(altitude<pointSearchMaxAltitude))
     }, [pointSearchMaxAltitude,altitude]);
 
     useEffect(() => {
        console.log(selectedProduct)
        if(selectedProduct !== null) {
            let p = selectedProduct
            let lat = selectedProduct._sector.minLatitude
            let lon = selectedProduct._sector.minLongitude
            console.log('selected product lat/lon: '+lat+' / '+lon)
            setgoToDate(selectedProduct.timeRange[1])
            setresetStartDateTrigger(Math.random())
            // setTime(selectedProduct[0].timeRange[1])
            // setViewDate(selectedProduct[0].timeRange[1])
        }
    }, [selectedProduct]);

    useEffect(() => {
        if(closestItem !== null) {
            let lat = closestItem._sector.minLatitude
            let lon = closestItem._sector.minLongitude
            moveTo(lat,lon)
            setgoToDate(closestItem.timeRange[1])
            setresetStartDateTrigger(Math.random())
        }
    }, [moveToClosestItemTrigger]);
 
    useEffect(() => {
        if(addQuicklookWMSTrigger !== null) {
            setproductOn(false)
            addQuicklookWMS(selectedProduct)
        }
    }, [addQuicklookWMSTrigger]);
 
 
    
    useEffect(() => {
        console.log("world created"+' / '+position.clat+' / '+position.clon+' / '+altitude)
        setTimeout(() => {
            initMap({
                clat: position.clat,
                clon: position.clon,
                alt: altitude,
                starfield: mapSettings.starfield,
                atmosphere: mapSettings.atmosphere,
                background: mapSettings.background,
                overlay: mapSettings.overlay,
                satellites: mapSettings.satellites,
                names: mapSettings.names,
                projection: mapSettings.projection,
                dem: mapSettings.dem
            })
    
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
            {/* {useMemo(
                () => { return(<canvas className={'Earth'} id={id} />)},
                [id]
            )} */}
            <canvas id={id} className={'Earth'} />
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
