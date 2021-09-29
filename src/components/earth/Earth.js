import React, {useEffect} from 'react';
import {AppContext} from '../app/context'

import './Earth.css'
import { useEww } from "./useEww"
import { useDebounce } from '../../hooks/useDebounce';
import {FluidWorldWindowController} from './FluidWorldWindowController'
// import InfoPanel from "../infopanel"
import LookAtWidget from './LookAtWidget'
import ViewProductControl from './ViewProductControl'
import FilterProductControl from './FilterProductControl'
import { useKey } from 'rooks'

const Earth = ({ id }) => {

    const [ state, dispatch ] = React.useContext(AppContext)


    const debouncedclosestItem = useDebounce(state.closestItem, 200)

    const handleSimpleClick = (e) => {
        let selection = getRenderables(e.pageX,e.pageY)
        if (selection.length === 0) return
        // selection[0].highlighted = true
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
        northUp
    } = useEww({
        id: id,
    })

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
        dispatch({ type: "altitude_changed", value: ewwstate.altitude})
    },[ewwstate.altitude])

    useEffect(() => {
        dispatch({ type: "set_searchPoint", value: ewwstate.viewpoint})
    },[ewwstate.viewpoint])

    useEffect(() => {
        dispatch({ type: "set_closestitem", value: ewwstate.closestRenderable})
    },[ewwstate.closestRenderable])

    useEffect(() => {
        dispatch({ type: "set_tics", value: ewwstate.tics})
    },[ewwstate.tics])



    useEffect(() => {
        setTime(state.viewDate.getTime())
    },[state.viewDate])

    useEffect(() => {
        toggleGeojson(state.productOn)
        toggleQuicklooks(state.productOn)
        toggleQuicklookWMS(!state.productOn)
    },[state.productOn])

    useEffect(() => {
        if(state.geojson !== null) {
            addGeojson(state.geojson,state.viewDate.getTime())
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
        dispatch({type: 'set_selectedProduct', value: null})

        // dispatch({ type: "set_closestitem", value: null})
        // dispatch({ type: "set_goToDate", value: null})
    }, [state.clearResultsTrigger]);

    useEffect(() => {
        toggleAtmosphere(state.mapSettings.atmosphere)
    }, [state.mapSettings.atmosphere]);

    useEffect(() => {
        toggleModel(state.mapSettings.satellites)
    }, [state.mapSettings.satellites]);

    useEffect(() => {
        toggleStarfield(state.mapSettings.starfield)
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
        if(state.mapSettings.quicklooks)
            addQuicklook(debouncedclosestItem)
    }, [debouncedclosestItem]);

    useEffect(() => {
        if(state.closestItem !== null && state.goToPos !== null) {
            moveTo(state.goToPos.lat, state.goToPos.lon)
        }
    }, [state.goToPos])
 
    useEffect(() => {
        if(state.addQuicklookWMSTrigger !== null) {
            addQuicklookWMS(state.selectedProduct)
        }
    }, [state.addQuicklookWMSTrigger]);
 
 
    
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
                names: state.mapSettings.names,
                projection: state.mapSettings.projection,
                dem: state.mapSettings.dem
            })
    
            moveTo(state.position.clat, state.position.clon, state.altitude) 
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
            <ViewProductControl active={state.closestItem !== null}/>
            <FilterProductControl active={state.closestItem !== null}/>
            {/* <InfoPanel top= '100px' left= '5px'>
                <div className='Quiklook'><img src={QLimage?QLimage.src:''}  alt='' width='150px'/></div>
            </InfoPanel> */}
        </div>
    );
}

export default Earth
