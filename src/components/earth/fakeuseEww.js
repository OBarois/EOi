import WorldWind from "webworldwind-esa";
import './wwwxx/www-overrides/DrawContext';
import './wwwxx/www-overrides/SurfaceShapeTileBuilder';
import SurfaceShape from './wwwxx/www-overrides/SurfaceShape';
import './wwwxx/www-overrides/SurfaceShapeTile';
import './wwwxx/www-overrides/TiledImageLayer';
import './wwwxx/www-overrides/GeoJSONParser';
import  WorldWindow  from './wwwxx/WorldWindow';
import  { useState, useEffect, useRef } from "react";
import StarFieldLayer from "./wwwxx/layer/starfield/StarFieldLayer" // import a custom one as the base url is not set when using wwwx
import TexturedSurfacePolygon from './wwwxx/textured/TexturedSurfacePolygon'
// import wwwx from "webworldwind-x";

// import modelsLayer from './satelliteLayer';
import satelliteLayers from './satelliteLayers';

import {bgLayers, ovLayers} from './layerConfig';
import { useCallback } from "reactn";
// import SurfaceShape from './wwwxx/www-overrides/SurfaceShape';

export const useEww = ({ id, clon, clat, alt, starfield, atmosphere, background, overlay, names, satellites, dem }) => {
    console.log('useEww renders')
    
    const TRAIL_PRODUCT = 1000 * 60 * 60 * 24 //1 day
    const TRAIL_QUICKLOOK = 1000 * 60 * 60  //1 hour

  
    const eww = useRef(null)
   
    const [projection, setProjection] = useState("3D")
    // const [aoi, setAoi] = useState({type: null, value: null})
    const [aoi, setAoi] = useState('')
    const [ewwstate, setEwwState] = useState({latitude: clat, longitude: clon, altitude: alt, aoi:'', pickedItems: []})
    const copDemOn = useRef(dem)
    const bgIndex = useRef(0)
    const ovIndex = useRef(0)
    const [satOn, setsatOn] = useState(satellites)
    const [starOn, setstarOn] = useState(starfield)
    const [atmOn, setatmOn] = useState(atmosphere)

    const lastepoch = useRef(new Date())

    // Turn the globe up north
    function northUp() {
        console.log('northUp')
    }

    //toggle atmosphere
    function toggleAtmosphere(bool) {
        console.log('toggleAtmosphere: '+bool)
    }

    //toggle model
    function toggleModel(bool) {
        console.log('toggleModel: '+bool)
   }

    //toggle starField
    function toggleStarfield(bool) {
        console.log('toggleStarfield: '+bool)
    }

    //toggle name overlay
    function toggleNames(bool) {
        console.log('toggleNames: '+bool)
    }
    //toggle background overlay
    function setBg(background) {
        console.log('setBg: '+background)
    }
    function toggleBg(background) {
        console.log("toggleBg: "+background)
    }
    function toggleOv(overlay) {
        console.log("toggleOv: "+overlay)
    }
    
    //toggle DEM 
    function toggleDem(dem) {
        console.log("toggleDem: "+dem)
    }

 
    function  getViewPolygon () {
    }
    
    const addGeojson = (url,epoch) => {

        console.log('addGeojson')
    }

    function removeGeojson() {
        console.log('removeGeojson')
    }

    function addWMS() {
    }

    function addQuicklookWMS(renderable) {
    }

    const addQuicklook = async (renderable) => {
        console.log('addQuicklook')

    }


    function removeQuicklooks() {
        console.log('removeQuicklooks')
    }

    const  setTime = useCallback( (epoch) => {
        console.log('setTime')
     })

     function moveTo(clat, clon, alt) {
        console.log('moveTo: '+clat+' / '+clon+' / '+ alt)
        }


    function toggleProjection() {
      }


    // didMount effect
    useEffect(() => {
        console.log("Creating the world...")


        eww.current = new WorldWindow(id);
     
    }, []); // effect runs only once
        
      // useEffect(() => {
    //     console.log("useEffect aoi: " + aoi)
    //     let newewwstate = {...ewwstate, aoi: aoi}
    //     setEwwState(newewwstate)
    // }, [aoi]); 
    useEffect(() => {
        // console.log('background changed effect: '+background)

        toggleBg(background)
    }, [background]);

    useEffect(() => {
        // console.log('overlay changed effect: '+overlay)

        toggleOv(overlay)
    }, [overlay]);

    useEffect(() => {
        // console.log('names changed effect: '+names)
        toggleNames(names)
    }, [names]);

    useEffect(() => {
        // console.log('atmosphere changed effect: '+satellites)

        toggleAtmosphere(atmosphere)
        setatmOn(atmosphere)
    }, [atmosphere]);

    useEffect(() => {
        // console.log('starfield changed effect: '+starfield)
        toggleStarfield(starfield)
        setstarOn(starfield)
    }, [starfield]);

    useEffect(() => {
        // console.log('sat changed effect: '+satellites)
        setsatOn(satellites)
        toggleModel(satellites)
    }, [satellites]);

    useEffect(() => {
        toggleDem(dem)
    }, [dem]); 

  return { eww, ewwstate, moveTo, removeGeojson, addGeojson, addWMS, removeQuicklooks, addQuicklook, toggleStarfield, toggleAtmosphere, setTime, toggleProjection, toggleNames, toggleModel, toggleBg, toggleOv, toggleDem, northUp };
}
