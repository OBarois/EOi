import React, {useEffect} from 'react';
import {AppContext} from '../app/context'

import './Earth.css'
import { useEww } from "./useEww"
import { useDebounce } from '../../hooks/useDebounce';
import {FluidWorldWindowController} from './FluidWorldWindowController'
// import InfoPanel from "../infopanel"
import LookAtWidget from './LookAtWidget'
import ViewProductControl from '../viewproductcontrol/ViewProductControl'
import FilterProductControl from './FilterProductControl'
import { useKey } from 'rooks'

const Earth = ({ id }) => {

    const [ state, dispatch ] = React.useContext(AppContext)



    const handleSimpleClick = (e) => {
        let selection = getRenderables(e.pageX,e.pageY)
        if (selection.length === 0) return
        // selection[0].highlighted = true
        console.log('items clicked: '+selection.length)
        dispatch({type: 'set_selectedProduct', value: selection[0]})
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
        setFilter,
        toggleDem,
        northUp,
        setMode,
        setColor
    } = useEww({
        id: id
    })

    const debouncedclosestItem = useDebounce(state.closestItem, 500)
    // const debouncedewwstate = useDebounce(ewwstate, 100)


    useKey(['p'],() => dispatch({ type: "toggle_projection" }))
    useKey(['c'],removeGeojson)
    useKey(['u'],northUp)
    useKey(['w'],()=>toggleQuicklookWMS(null))
    useKey(['b'],() => dispatch({ type: "toggle_background" }))
    useKey(['m'],() => dispatch({ type: "toggle_satellites" }))
    useKey(['d'],() => dispatch({ type: "toggle_dem" }))
    useKey(['o'],() => dispatch({ type: "toggle_overlay" }))
    useKey(['a'],() => dispatch({ type: "toggle_atmosphere" }))
    useKey(['s'],() => dispatch({ type: "toggle_starfield" }))
    useKey(['n'],() => dispatch({ type: "toggle_names" }))

    useEffect(() => {
        // console.log('set_altitude')
        if(ewwstate.altitude) {
            // console.log('set_altitude: '+ewwstate.altitude)
            dispatch({ type: "set_altitude", value: ewwstate.altitude})
        }
    },[ewwstate.altitude, dispatch])

    useEffect(() => {
        // console.log('set_searchPoint')
        dispatch({ type: "set_searchPoint", value: ewwstate.viewpoint})
    },[ewwstate.viewpoint, dispatch])

    useEffect(() => {
        // console.log('set_position')
        dispatch({ type: "set_position", value: {lat:ewwstate.latitude, lon:ewwstate.longitude}})
    },[ewwstate.longitude, ewwstate.latitude, dispatch])


    useEffect(() => {
        dispatch({ type: "set_tics", value: ewwstate.tics})
    },[ewwstate.tics, dispatch])



    useEffect(() => {
        setTime(new Date(state.viewDate))
    },[state.viewDate])

    useEffect(() => {
        setColor(state.appColor)
    },[state.appColor])

    useEffect(() => {
        if(!state.productOn) return
        toggleGeojson(state.productOn)
        toggleQuicklooks(state.productOn)
        toggleQuicklookWMS(!state.productOn)
    },[state.productOn])

    useEffect(() => {
        if(state.geojson !== null) {
            addGeojson(state.geojson,new Date(state.viewDate))
        } 
    },[state.geojson])

    useEffect(() => {
        if(state.filter !== null) {
            setFilter(state.filter)
        } 
    },[state.filter])

    useEffect(() => {
        removeGeojson()
        removeQuicklooks()
        removeQuicklookWMS()
        // dispatch({type: 'set_selectedProduct', value: null})

        // dispatch({ type: "set_closestitem", value: null})
        // dispatch({ type: "set_goToDate", value: null})
        // dispatch({ type: "set_tics", value: []})
    }, [state.clearResultsTrigger]);

    useEffect(() => {
        toggleAtmosphere(state.mapSettings.atmosphere)
        setTime()
    }, [state.mapSettings.atmosphere]);

    useEffect(() => {
        if(state.mapSettings.satelliteList) toggleModel(state.mapSettings.satellites, state.mapSettings.satelliteList)
    }, [state.mapSettings.satellites, state.mapSettings.satelliteList]);

    // useEffect(() => {
    //     console.log(state.mapSettings.satelliteList)
    // }, [state.mapSettings.satelliteList]);

    useEffect(() => {
        toggleStarfield(state.mapSettings.starfield)
        setTime()

    }, [state.mapSettings.starfield]);

    useEffect(() => {
        toggleNames(state.mapSettings.names)
    }, [state.mapSettings.names]);

    useEffect(() => {
        toggleProjection(state.mapSettings.projection)
    }, [state.mapSettings.projection]);

    useEffect(() => {
        toggleBg(state.mapSettings.background)
    }, [state.mapSettings.background]);

    useEffect(() => {
        toggleOv(state.mapSettings.overlay)
    }, [state.mapSettings.overlay]);

    useEffect(() => {
        toggleDem(state.mapSettings.dem)
    }, [state.mapSettings.dem]);

    useEffect(() => {
        toggleQuicklooks(state.mapSettings.quicklooks)
    }, [state.mapSettings.quicklooks]);

    useEffect(() => {
        // console.log('closest item changed')
        dispatch({ type: "set_closestitem", value: ewwstate.closestRenderable})
    },[ewwstate.closestRenderable])

    useEffect(() => {
        if(state.mapSettings.quicklooks) {
            addQuicklook(debouncedclosestItem, state.credentials)
        }
    }, [debouncedclosestItem]);

    useEffect(() => {
        if(state.closestItem != null && state.goToPos != null) {
            moveTo(state.goToPos.lat, state.goToPos.lon, state.goToPos.alt)
        }
    }, [state.goToPos])
 
    useEffect(() => {
        if(state.addQuicklookWMSTrigger !== null) {
            addQuicklookWMS(state.selectedProduct)
        }
    }, [state.addQuicklookWMSTrigger]);
 
    useEffect(() => {
        if(state.animated) {
            setMode('animated')
        } else {
            setMode(state.browseMode)
        }
    }, [state.browseMode, state.animated]);
 
    
    useEffect(() => {
        console.log("world created"+' / '+state.position.clat+' / '+state.position.clon+' / '+state.altitude)
        setTimeout(() => {
            initMap({
                clat: state.position.clat,
                clon: state.position.clon,
                alt: state.altitude,
                starfield: state.mapSettings.starfield,
                atmosphere: state.mapSettings.atmosphere,
                background: state.mapSettings.background,
                overlay: state.mapSettings.overlay,
                satellites: state.mapSettings.satellites,
                satelliteList: state.mapSettings.satelliteList,
                names: state.mapSettings.names,
                projection: state.mapSettings.projection,
                dem: state.mapSettings.dem
            })
            setTime(new Date(state.viewDate))
            // moveTo(state.position.clat, state.position.clon, state.altitude) 
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
            <LookAtWidget active={(state.searchMode === 'point')}/>
            <ViewProductControl active={state.closestItem != null}/>
            <FilterProductControl active={state.closestItem != null}/>
            {/* <InfoPanel top= '100px' left= '5px'>
                <div className='Quiklook'><img src={QLimage?QLimage.src:''}  alt='' width='150px'/></div>
            </InfoPanel> */}
        </div>
    );
}

export default Earth
