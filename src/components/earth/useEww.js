import  { useState, useEffect, useRef } from "react";
import WorldWind from "webworldwind-esa";
import StarFieldLayer from "./wwwx/layer/starfield/StarFieldLayer"
import TexturedSurfacePolygon from './wwwx/shapes/TexturedSurfacePolygon'
import modelsLayer from './satelliteLayer';
import {bgLayers, ovLayers} from './layerConfig';


// BasicWorldWindowController.prototype.applyLimits = function () {
//     var navigator = this.wwd.navigator;

//     // Clamp latitude to between -90 and +90, and normalize longitude to between -180 and +180.
//     navigator.lookAtLocation.latitude = WWMath.clamp(navigator.lookAtLocation.latitude, -90, 90);
//     navigator.lookAtLocation.longitude = Angle.normalizedDegreesLongitude(navigator.lookAtLocation.longitude);

//     // Clamp range to values greater than 1 in order to prevent degenerating to a first-person navigator when
//     // range is zero.
//     navigator.range = WWMath.clamp(navigator.range, 1, Number.MAX_VALUE);

//     // Normalize heading to between -180 and +180.
//     navigator.heading = Angle.normalizedDegrees(navigator.heading);

//     // Clamp tilt to between 0 and +90 to prevent the viewer from going upside down.
//     navigator.tilt = WWMath.clamp(navigator.tilt, 0, 90);

//     // Normalize heading to between -180 and +180.
//     navigator.roll = Angle.normalizedDegrees(navigator.roll);

//     // Apply 2D limits when the globe is 2D.
//     if (this.wwd.globe.is2D() && navigator.enable2DLimits) {
//         // Clamp range to prevent more than 360 degrees of visible longitude. Assumes a 45 degree horizontal
//         // field of view.
//         var maxRange = 2  Math.PI  this.wwd.globe.equatorialRadius;
//         navigator.range = WWMath.clamp(navigator.range, 1, maxRange);

//         // Force tilt to 0 when in 2D mode to keep the viewer looking straight down.
//         navigator.tilt = 0;
//     }
// };

export function useEww({ id, clon, clat, alt, starfield, atmosphere, names }) {
    //console.log('useEww renders')
    
  
    const eww = useRef(null)
    const [projection, setProjection] = useState("3D")
    // const [aoi, setAoi] = useState({type: null, value: null})
    const [aoi, setAoi] = useState('')
    const [geojsonlayers, setGeojsonlayers] = useState([])
    const [quicklooklayers, setQuicklooklayers] = useState([])
    const [ewwstate, setEwwState] = useState({latitude: clat, longitude: clon, altitude: alt, aoi:'', pickedItems: []})
    const [demOn,setDemOn] = useState(true)
    const copDemOn = useRef(false)
    const bgIndex = useRef(0)
    const ovIndex = useRef(0)


    // Turn the globe up north
    function northUp() {
        const wwd = eww.current
        let headingIncrement = 1.0;
        if (Math.abs(wwd.navigator.heading) > 60) {
            headingIncrement = 2.0;
        } else if (Math.abs(navigator.heading) > 120) {
            headingIncrement = 3.0;
        }
        if (wwd.navigator.heading > 0) {
            headingIncrement = -headingIncrement;
        }

        let runOperation = () => {
            if (Math.abs(wwd.navigator.heading) > Math.abs(headingIncrement)) {
                wwd.navigator.heading += headingIncrement;
                setTimeout(runOperation, 10);
            } else {
                wwd.navigator.heading = 0;
            }
            wwd.redraw();
        };
        setTimeout(runOperation, 10);
    }

    // useEffect(() => {
    //     console.log('toggleStarfield')
    //     getLayerByName('StarField').enabled = !getLayerByName('StarField').enabled
    //     eww.current.redraw();
    // }, [starfield]);

    //toggle atmosphere
    function setAtmosphere(bool) {
        console.log('toggleAtmosphere')
        getLayerByName('Atmosphere').enabled = bool
        eww.current.redraw();
    }
    //toggle model
    function toggleModel() {
        console.log('toggleModel')
        getLayerByName('Model').enabled = !getLayerByName('Model').enabled
        eww.current.redraw();
    }

    //toggle starField
    function setStarfield(bool) {
        console.log('toggleStarfield')
        getLayerByName('StarField').enabled = bool
        eww.current.redraw();
    }

    //toggle name overlay
    function setNames(bool) {
        console.log('toggleNames')
        getLayerByName('overlay_bright').enabled = bool
        eww.current.redraw();
    }
    //toggle background overlay
    function toggleBg2() {
        console.log('toggleTerrain')
        getLayerByName('terrain').enabled = !getLayerByName('terrain').enabled
        getLayerByName('s2cloudless-2018').enabled = !getLayerByName('s2cloudless-2018').enabled
        eww.current.redraw();
    }
    function toggleBg() {
        eww.current.layers[bgIndex.current].enabled=false

        bgIndex.current = (bgIndex.current + 1)%bgLayers.length
        console.log("Background Layer: "+eww.current.layers[bgIndex.current].displayName)
        eww.current.layers[bgIndex.current].enabled=true
    }
    function toggleOv() {
        eww.current.layers[ovIndex.current+bgLayers.length].enabled=false

        ovIndex.current = (ovIndex.current + 1)%ovLayers.length
        console.log("Overlay Layer: "+eww.current.layers[ovIndex.current+bgLayers.length].displayName)
        eww.current.layers[ovIndex.current+bgLayers.length].enabled=true
    }
    
    //toggle DEM 
    function toggleDem() {
        // var elevationModel
        // console.log("Dem state in toggle: "+((demOn)<=!demOn))
        // if(!copDemOn.current) {
        //     console.log('Switching to Copernicus Dem')
        //     elevationModel = new WorldWind.ElevationModel();
        //     elevationModel.addCoverage(new WorldWind.TiledElevationCoverage({
        //         coverageSector: WorldWind.Sector.FULL_SPHERE,
        //         resolution: 0.008333333333333,
        //         retrievalImageFormat: "image/tiff",
        //         minElevation: -11000,
        //         maxElevation: 8850,
        //         urlBuilder: new WorldWind.WcsTileUrlBuilder("https://dem.esa.maps.eox.at/elevation", "copdem", "2.0.1")
        //         }));    
            
        // } else {
        //     console.log('Switching to NASA Dem')
        //     elevationModel = new WorldWind.EarthElevationModel()
        // }
        // eww.current.globe.elevationModel = elevationModel
        // eww.current.redraw();
        copDemOn.current = !copDemOn.current
        setDemOn(copDemOn.current)
    }

    function toggleDem2() {
        var elevationModel
        console.log("Dem state: "+demOn)
        if(!copDemOn.current) {
            console.log('Switching to Copernicus Dem')
            elevationModel = new WorldWind.ElevationModel();
            elevationModel.addCoverage(new WorldWind.TiledElevationCoverage({
                coverageSector: WorldWind.Sector.FULL_SPHERE,
                resolution: 0.008333333333333,
                retrievalImageFormat: "image/tiff",
                minElevation: -11000,
                maxElevation: 8850,
                urlBuilder: new WorldWind.WcsTileUrlBuilder("https://dem.esa.maps.eox.at/elevation", "copdem", "2.0.1")
                }));    
            
        } else {
            console.log('Switching to NASA Dem')
            elevationModel = new WorldWind.EarthElevationModel()
        }
        eww.current.globe.elevationModel = elevationModel
        eww.current.redraw();
        copDemOn.current = !copDemOn.current
        setDemOn(!demOn)
    }

    function  getViewPolygon () {
        let view = eww.current.viewport
        let area = {}
        let polygon = ''
        // console.log('view: ' + view.x + '/' + view.y + '/' + view.width + '/' + view.height);

        let bl ;
        try { 
            bl =  eww.current.pickTerrain(eww.current.canvasCoordinates(view.x, view.y + view.height)).terrainObject().position
            bl.latitude = Math.round(bl.latitude * 10000)/10000
            bl.longitude = Math.round(bl.longitude * 10000)/10000
        }
        catch(err) {bl = null;}


        let tr ;
        try { 
            tr = eww.current.pickTerrain(eww.current.canvasCoordinates(view.x + view.width, view.y)).terrainObject().position
            tr.latitude = Math.round(tr.latitude * 10000)/10000
            tr.longitude = Math.round(tr.longitude * 10000)/10000
        }
        catch(err) {tr = null;}

        //console.log(bl.longitude+'/'+bl.latitude+'/'+tr.longitude+'/'+tr.latitude);
        if(bl == null || tr == null )  {
            //   area = {type:"bbox", value:"-180,-90,180,90"};
              polygon = ''
        } else {
              area = {
                    type: "bbox",
                    value:
                           bl.longitude +','
                          + bl.latitude +','
                          +tr.longitude +','
                          +tr.latitude
              };

              polygon = 'POLYGON((' 
                + bl.longitude + ' ' + bl.latitude + ',' 
                + tr.longitude + ' ' + bl.latitude + ',' 
                + tr.longitude + ' ' + tr.latitude + ',' 
                + bl.longitude + ' ' + tr.latitude + ',' 
                + bl.longitude + ' ' + bl.latitude + '))' 
        }
        return polygon

    }
    
    const addGeojson = (url,epoch) => {

        // console.log('replace: '+replace)

        function shapeConfigurationCallback(geometry, properties) {
            let configuration = {};
            configuration.userProperties = properties
    
            let placemarkAttributes = new WorldWind.PlacemarkAttributes(null);
            placemarkAttributes.imageScale = 10;
            placemarkAttributes.imageColor = new WorldWind.Color(0, 1, 1, 0.2);
            placemarkAttributes.labelAttributes.offset = new WorldWind.Offset(
                WorldWind.OFFSET_FRACTION, 5,
                WorldWind.OFFSET_FRACTION, 5);
            //placemarkAttributes.imageSource = whiteDot;
    
    
            if (geometry.isPointType() || geometry.isMultiPointType()) {
                configuration.attributes = new WorldWind.PlacemarkAttributes(placemarkAttributes);
                
            } else if (geometry.isLineStringType() || geometry.isMultiLineStringType()) {
                configuration.attributes.drawOutline = true;
                configuration.attributes.outlineColor = new WorldWind.Color(
                    0.1 * configuration.attributes.interiorColor.red,
                    0.3 * configuration.attributes.interiorColor.green,
                    0.7 * configuration.attributes.interiorColor.blue,
                    1
                );
                configuration.attributes.outlineWidth = 1;
            } else if (geometry.isPolygonType() || geometry.isMultiPolygonType()) {
                configuration.attributes = new WorldWind.ShapeAttributes(null);
                configuration.attributes.interiorColor = new WorldWind.Color(1, 0, 0, 0.2);
                configuration.attributes.outlineColor = new WorldWind.Color(1, 0, 0, 0.3);

                configuration.highlightAttributes = new WorldWind.ShapeAttributes(configuration.attributes);
                configuration.highlightAttributes.outlineColor = new WorldWind.Color(1, 0, 0, 0.4);
                configuration.highlightAttributes.interiorColor = new WorldWind.Color(1, 0, 0, 0);
                // configuration.attributes.outlineWidth = 0.3;

                // configuration.attributes.applyLighting = true;
                // configuration.attributes.imageSource = properties.quicklookUrl

            }
    
            //console.log(configuration.attributes);
            return configuration;
        }

        
        function loadCompleteCallback() {
            console.log(renderableLayer)
            setGeojsonlayers((geojsonlayers)=>[...geojsonlayers,renderableLayer])
            enableRenderables(epoch) // uncomment to disable renderables
            eww.current.redraw();
        }
    
        // if (replace) removeGeojson()
        let renderableLayer = new WorldWind.RenderableLayer('Products: '+url.properties.updated+Math.ceil(Math.random() * 10000))
        
        eww.current.addLayer(renderableLayer);
        // setGeojsonlayers((geojsonlayers)=>[...geojsonlayers,renderableLayer])
        // setGeojsonlayers((geojsonlayers)=>[...geojsonlayers,renderableLayer])
        // setGeojsonlayers(eww.current.layers)
        let geoJson = new WorldWind.GeoJSONParser(url);
        geoJson.load(loadCompleteCallback, shapeConfigurationCallback, renderableLayer);
        // setGeojsonlayers((geojsonlayers)=>[...geojsonlayers,renderableLayer])        
    }

    function removeGeojson() {
        for(let i=0;i<geojsonlayers.length;i++) {
          eww.current.removeLayer(geojsonlayers[i])
        //   console.log('removing json layers: ')
        //   console.log(geojsonlayers[i])
        }
        setGeojsonlayers((geojsonlayers)=>[])
        // console.log(geojsonlayers)
        eww.current.redraw();
      }

    function addWMS() {
    }

    function addQuicklookWMS(renderable) {

        console.log(renderable.computeSectors(eww.current.drawContext))
        console.log(WorldWind.Sector.FULL_SPHERE)

        // for S2:  
        // https://view.onda-dias.eu/instance00/ows?&service=WMS&request=GetMap&layers=S2L1C_TRUE_COLOR&styles=&format=image/png&transparent=true&version=1.1.1&width=1500&height=1000&srs=EPSG:4326&bbox=12.357903,41.800495,12.625694,41.984760

        
        // https://view.onda-dias.eu/instance00/ows?&service=WMS&request=GetMap&layers=S1B_IW_GRDH_1SDV_20190520T050758_20190520T050823_016323_01EB81_6EB6&styles=&format=image%2Fpng&transparent=true&version=1.1.1&width=256&height=256&srs=EPSG%3A3857&bbox=2035059.441064533,7044436.526761846,2191602.4749925737,7200979.560689885
        let wmsConfigQL = {
            service: "https://view.onda-dias.eu/instance00/ows",
            // layerNames: renderable.userProperties.title,
            // layerNames: 'S2L1C_TRUE_COLOR',
            layerNames: 'S1_IW_GRDH_FullResolution',
            
            // title: renderable.userProperties.title,
            title: 'quicklook',
            numLevels: 19,
            format: "image/png",
            size: 256,
            sector: renderable.computeSectors(eww.current.drawContext)[0],
            // sector: renderable.sector,
            // sector: WorldWind.Sector.FULL_SPHERE,
            levelZeroDelta: new WorldWind.Location(90, 90)
        }

        // let wmsConfigQL = {
        //     service: "https://tiles.maps.eox.at/wms",
        //     layerNames: "overlay_bright",
        //     title: "overlay_bright",
        //     numLevels: 19,
        //     format: "image/png",
        //     size: 256,
        //     sector: WorldWind.Sector.FULL_SPHERE,
        //     levelZeroDelta: new WorldWind.Location(90, 90)
        // }
        // eww.current.removeLayer(getLayerByName('quicklook') )
        let qllayer =  new WorldWind.WmsLayer(wmsConfigQL, renderable.userProperties.date)
        eww.current.addLayer(qllayer)
        eww.current.redraw()
        console.log(eww.current.layers)
    }

    function getLayerByName(name) {
        for (let i = 0; i < eww.current.layers.length; i++) {
            // console.log('display name: '+eww.current.layers[i].displayName)
            if (eww.current.layers[i].displayName === name) return eww.current.layers[i]
        }
        return null
    }

    async function enableRenderables(time) {
        let timeOffset = 1000 * 60 * 60 * 3 // 3 hours
        for (let i = 0; i < eww.current.layers.length; i++) {
            if (eww.current.layers[i].displayName.includes('Products:')) {
                
                for (let j = 0; j < eww.current.layers[i].renderables.length; j++) {
                    let renderable = eww.current.layers[i].renderables[j]
                    if (time != 0) {
                        let renderableStartDate = (new Date(renderable.userProperties.earthObservation.acquisitionInformation[0].acquisitionParameter.acquisitionStartTime)).getTime()
                        let renderableStopDate = (new Date(renderable.userProperties.earthObservation.acquisitionInformation[0].acquisitionParameter.acquisitionStopTime)).getTime()
                        renderable.enabled = (renderableStartDate <= time+timeOffset/2 && renderableStopDate >= time-timeOffset/2) ? true : false   
                    } else {
                        renderable.enabled = false
                    }         
                }
            }
            if (eww.current.layers[i].displayName === 'quicklook') {
                // eww.current.layers[i].enabled = 
            }
        }

    }

    function addQuicklook(renderable) {

        function imageLoader(url, useCredentials) {
            return new Promise((resolve, reject) => {
                const img = new Image();
        
                img.onload = function() {
                    resolve(img);
                };
        
                img.onerror = function(e){
                    reject(e);
                };
        
                img.crossOrigin = useCredentials ? 'Use-Credentials' : 'Anonymous';
                img.src = url;
                console.log(' adding QL')
            });
        }


        // console.log(' adding QL')
        //  console.log(renderable.attributes)
        // let quicklook =  new TexturedSurfacePolygon(renderable.sector)
        // let quicklookLayer = new WorldWind.RenderableLayer('Quicklooks')
        // // quicklookLayer.addRenderable(quicklook)
        // // setQuicklooklayers((quicklooklayers)=>[...quicklooklayers,quicklookLayer])
        // // eww.current.addLayer(quicklookLayer)
        // let ql = new Image()
        // ql.src = renderable.userProperties.quicklookUrl
        // quicklook.image = ql
        
        imageLoader(renderable.userProperties.quicklookUrl,true).then(image => {
            let quicklookLayer = getLayerByName('Quicklooks')
            removeQuicklooks()
            let footprint = [
                renderable.boundaries[0][0],
                renderable.boundaries[0][3],
                renderable.boundaries[0][2],
                renderable.boundaries[0][1]
            ]
            // footprint[0].pop()
            console.log(footprint)
            let quicklook =  new TexturedSurfacePolygon(footprint,renderable.attributes)
            quicklook.maxImageWidth = 64
            quicklook.maxImageHeight = 64
            
            quicklook.image = image
            quicklookLayer.addRenderable(quicklook)
            eww.current.addLayer(quicklookLayer)
            eww.current.redraw()
        })
    }

    function removeQuicklooks() {
        getLayerByName('Quicklooks').removeAllRenderables()
        eww.current.redraw()
    }

    function setTime(epoch) {
        getLayerByName('StarField').time = getLayerByName('Atmosphere').time = new Date(epoch)
        enableRenderables(epoch)
        // console.log('display name: ')
        // console.log(getLayerByName('StarField').displayName)
        eww.current.redraw();
        

     }


    function toggleProjection() {
        setProjection( prevProj => {
          console.log("prevProjection: "+prevProj)
          let supportedProjections = [ "3D", "Equirectangular", "Mercator"];
          let newProj = (supportedProjections.indexOf(prevProj) + 1)%supportedProjections.length
          console.log("newProjection: "+supportedProjections[newProj])
          switch (supportedProjections[newProj]) {
            case "3D":
                eww.current.globe.projection = new WorldWind.ProjectionWgs84();
                break;
            case "Equirectangular":
                eww.current.globe.projection = new WorldWind.ProjectionEquirectangular();
                break;
            case "Mercator":
                eww.current.globe.projection = new WorldWind.ProjectionMercator();
                break;
            case "North Polar":
                eww.current.globe.projection = new WorldWind.ProjectionPolarEquidistant("North");
                break;
            case "South Polar":
                eww.current.globe.projection = new WorldWind.ProjectionPolarEquidistant("South");
                break;
            default:
            eww.current.globe.projection = new WorldWind.ProjectionWgs84();
            }
          eww.current.redraw();
          return supportedProjections[newProj]
          })      
      }

    // callback from eww   
    const setGlobeStates = () => {
        
        let lo = eww.current.navigator.lookAtLocation.longitude
        let la = eww.current.navigator.lookAtLocation.latitude
        let al = eww.current.navigator.range
        let vp = (al < 2000000?getViewPolygon():'')

        setEwwState((ewwstate) => { return {...ewwstate, longitude:lo, latitude: la, altitude: al, viewpolygon: vp}}) 

    }

    // handler for tap/click

    const handleClick  = (recognizer) => {
        // console.log('click')
        let x = recognizer.clientX
        let y = recognizer.clientY
        // Perform the pick. Must first convert from window coordinates to canvas coordinates, which are
        // relative to the upper left corner of the canvas rather than the upper left corner of the page.
        let pickList = eww.current.pick(eww.current.canvasCoordinates(x, y));
        // console.log(pickList)
        if (pickList.terrainObject()) {
            // position = pickList.terrainObject().position;
            // store list of selected footprints in a string for later comparison
            eww.current.removeLayer(getLayerByName('quicklook') )
            // de-highlight all rendereables
            for (let i = 0; i < eww.current.layers.length; i++) {
                if (eww.current.layers[i].displayName.includes('Products:')) {                    
                    for (let j = 0; j < eww.current.layers[i].renderables.length; j++) {
                        let renderable = eww.current.layers[i].renderables[j]
                        renderable.highlighted = false
                    }
                }
            }
    
            // ... and now highlight all picked rendereables
            let pickedItems = []
            for (let i = 0; i < pickList.objects.length; i++) {
                if (pickList.objects[i].userObject instanceof WorldWind.SurfaceShape) {
                    pickedItems.push(pickList.objects[i].userObject) 
                    pickList.objects[i].userObject.highlighted = !pickList.objects[i].userObject.highlighted
                    
                    addQuicklookWMS(pickList.objects[i].userObject)
                }
            }
            // console.log(pickedItems)
            setEwwState((ewwstate) => { return {...ewwstate, pickedItems: pickedItems}})
            eww.current.redraw()
        } else {
            console.log('No position !');
            return;
        }


    }

    const handleDoubleClick  = (recognizer) => {
        console.log('double click')
        let x = recognizer.clientX
        let y = recognizer.clientY
        let pickList = eww.current.pick(eww.current.canvasCoordinates(x, y));

        let position;
  
  
        // Get coordinates of clicked point and list of selected footprints. Do nothing if click done outside the globe.
        if (pickList.terrainObject()) {
            position = pickList.terrainObject().position;
            // eww.current.goTo(new WorldWind.Location(position.latitude, position.longitude));

            let point = "POINT("+position.longitude+' '+position.latitude+")"
            
            setEwwState((ewwstate) => { return {...ewwstate, aoi: point}}) 
    
        } else {
              console.log('No position !');
              setEwwState((ewwstate) => { return {...ewwstate, aoi: ''}})
        }
  
        

       
    }


    // didMount effect
    useEffect(() => {
        console.log("Creating the world...")

        // to use DEM from Eox ESA Map server
        var elevationModel = new WorldWind.ElevationModel();
        elevationModel.removeAllCoverages()
        elevationModel.addCoverage(new WorldWind.TiledElevationCoverage({
            coverageSector: WorldWind.Sector.FULL_SPHERE,
            resolution: 0.008333333333333,
            retrievalImageFormat: "image/tiff",
            minElevation: -11000,
            maxElevation: 8850,
            urlBuilder: new WorldWind.WcsTileUrlBuilder("https://dem.esa.maps.eox.at/elevation", "copdem", "2.0.1")
            }));
        // eww.current = new WorldWind.WorldWindow(id, elevationModel);


        eww.current = new WorldWind.WorldWindow(id);
        eww.current.redrawCallbacks.push(setGlobeStates)

        // Define a min/max altitude limit
        WorldWind.BasicWorldWindowController.prototype.applyLimits = function () {
            eww.current.navigator.range = WorldWind.WWMath.clamp(eww.current.navigator.range, 2000, 300000000);
        }

        // define click/tap recognisers
        // let tapRecognizer = new WorldWind.TapRecognizer(eww.current, handleClick);
        // tapRecognizer.numberOfTaps = 1;
        // let doubleTapRecognizer = new WorldWind.TapRecognizer(eww.current, handleDoubleClick);
        // doubleTapRecognizer.numberOfTaps = 2;
        // doubleTapRecognizer.recognizeSimultaneouslyWith(tapRecognizer);

        // let clickRecognizer = new WorldWind.ClickRecognizer(eww.current, handleClick);
        // clickRecognizer.numberOfClicks = 1;
        // let doubleClickRecognizer = new WorldWind.ClickRecognizer(eww.current, handleDoubleClick);
        // doubleClickRecognizer.numberOfClicks = 2;
        // doubleClickRecognizer.recognizeSimultaneouslyWith(clickRecognizer);
        // doubleClickRecognizer.maxClickInterval = 200;

        // let tapRecognizer = new WorldWind.TapRecognizer(eww.current, handleClick);
        // tapRecognizer.numberOfTaps = 1;
        // let doubleTapRecognizer = new WorldWind.TapRecognizer(eww.current, handleDoubleClick);
        // doubleTapRecognizer.numberOfTaps = 2;
        // doubleTapRecognizer.recognizeSimultaneouslyWith(tapRecognizer);
        // doubleTapRecognizer.maxTapInterval = 200;



        //setWwd(eww);

        WorldWind.configuration.baseUrl = WorldWind.configuration.baseUrl.slice(0,-3)

        //let starFieldLayer = new WorldWindX.StarFieldLayer();
        // let starFieldLayer = new WorldWind.StarFieldLayer();
        let starFieldLayer = new StarFieldLayer();
        let atmosphereLayer = new WorldWind.AtmosphereLayer('images/BlackMarble_2016_01deg.jpg');
        // let atmosphereLayer = new WorldWind.AtmosphereLayer('images/BlackMarble_2016_3km.jpg');
        
        //atmosphereLayer.minActiveAltitude = 5000000

        let quicklookLayer = new WorldWind.RenderableLayer('Quicklooks')
    
        let layers = [
            // { layer: new WorldWind.WmsLayer(wmsConfigBg_s2, ""), enabled: true },
            // { layer: new WorldWind.WmsLayer(wmsConfigBg_terrain, ""), enabled: false },
            // { layer: new WorldWind.WmsLayer(wmsConfigNames, ""), enabled: names },
            { layer: starFieldLayer, enabled: starfield },
            { layer: atmosphereLayer, enabled: atmosphere },
            { layer: quicklookLayer, enabled: true },
            { layer: modelsLayer, enabled: false }
        ];
    
        for (let l = 0; l < bgLayers.length; l++) {
            let layer = new WorldWind.WmsLayer(bgLayers[l], "")
            layer.enabled = false
            eww.current.addLayer(layer, "")
        }
        for (let l = 0; l < ovLayers.length; l++) {
            let layer = new WorldWind.WmsLayer(ovLayers[l], "")
            layer.enabled = false
            eww.current.addLayer(layer, "")
        }

        for (let l = 0; l < layers.length; l++) {
            layers[l].layer.enabled = layers[l].enabled;
            eww.current.addLayer(layers[l].layer);
        }
        console.log(eww.current.layers)
        //let date = new Date();
        starFieldLayer.time = new Date();
        atmosphereLayer.time = new Date();
        setTimeout(() => {
            eww.current.goToAnimator.travelTime = 1000;
            eww.current.goTo(new WorldWind.Position(clat, clon, alt));
            eww.current.redraw();
            }, 2000)
    
        eww.current.redraw();
        eww.current.deepPicking = true;
        // eww.current.orderedRenderingFilters.push(declutterByTime)
    }, []); // effect runs only once
        
      // useEffect(() => {
    //     console.log("useEffect aoi: " + aoi)
    //     let newewwstate = {...ewwstate, aoi: aoi}
    //     setEwwState(newewwstate)
    // }, [aoi]); 
    useEffect(() => {
        console.log("Copernicus Dem: " + demOn)
        var elevationModel
        if(!copDemOn.current) {
            console.log('Switching to Copernicus Dem')
            elevationModel = new WorldWind.ElevationModel();
            elevationModel.addCoverage(new WorldWind.TiledElevationCoverage({
                coverageSector: WorldWind.Sector.FULL_SPHERE,
                resolution: 0.008333333333333,
                retrievalImageFormat: "image/tiff",
                minElevation: -11000,
                maxElevation: 8850,
                urlBuilder: new WorldWind.WcsTileUrlBuilder("https://dem.esa.maps.eox.at/elevation", "copdem", "2.0.1")
                }));    
            
        } else {
            console.log('Switching to NASA Dem')
            elevationModel = new WorldWind.EarthElevationModel()
        }
        eww.current.globe.elevationModel = elevationModel
        eww.current.redraw();

    }, [demOn]); 

  return { ewwstate, removeGeojson, addGeojson, addWMS, setStarfield, setAtmosphere, setTime, toggleProjection, setNames, toggleModel, toggleBg, toggleOv, toggleDem, northUp };
}
