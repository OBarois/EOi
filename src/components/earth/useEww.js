import WorldWind from "webworldwind-esa";
import './wwwxx/www-overrides/DrawContext';
import './wwwxx/www-overrides/SurfaceShapeTileBuilder';
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
import orbitLayers from './orbitLayers';

import {bgLayers, ovLayers} from './layerConfig'; 

export function useEww({ id }) {
    
    const TRAIL_PRODUCT = 1000 * 60 * 60 * 24 //1 day
    const TRAIL_QUICKLOOK = 1000 * 60 * 60  //1 hour
    const TRAIL_QUICKLOOKWMS = 1000 * 60 * 24 //1 day

    const ZINDEX_QUICKLOOKWMS = 900
    const ZINDEX_QUICKLOOKS = 800
    const ZINDEX_STARFIELD = 100
    const ZINDEX_ATMOSPHERE = 600
    const ZINDEX_PRODUCTS = 700
    const ZINDEX_BACKGROUND = 500
    const ZINDEX_OVERLAY = 1000
    const ZINDEX_SATELLITE = 200
  
    const eww = useRef(null)
   
    // const [aoi, setAoi] = useState({type: null, value: null})
    const [aoi, setAoi] = useState('')
    const [ewwstate, setEwwState] = useState({})
    const bg = useRef(1)
    const ov = useRef(0)
    const sat = useRef(false)
    const atm = useRef(false)
    const star = useRef(false)
    const na = useRef(false)
    const ge = useRef(false)
    const qu = useRef(false)
    const qw = useRef(false)
    const dem = useRef(false)
    const proj = useRef(0)
    // const filter = useRef([])
    // const [filter,setfilter] = useState(true)

    const s2lut = useRef([])

    const lastepoch = useRef(new Date())
    const lastmovetolat = useRef(0)
    const lastmovetolon = useRef(0)
    // Initialise mapsettings
    function initMap({ clon, clat, alt, atmosphere, starfield, satellites, background, names, dem, projection}) {
        toggleAtmosphere(atmosphere)
        toggleStarfield(starfield)
        toggleModel(satellites)
        toggleBg(background)
        toggleNames(names)
        toggleDem(dem)
        toggleProjection(projection)
        moveTo(clat, clon, alt)
    }

    // Turn the globe up north
    function northUp() {
        const wwd = eww.current
        let headingIncrement = wwd.navigator.heading / -20;
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

    //toggle atmosphere
    function toggleAtmosphere(bool) {
        console.log('toggleAtmosphere: '+bool)
        let la = getLayerByName('Atmosphere')
        atm.current = (bool!== null)?bool:!atm.current
        la.enabled = atm.current
        eww.current.redraw();
    }

    //toggle model
    function toggleModel(bool) {
        console.log('toggleModel: '+bool)
        sat.current = (bool!= null)?bool:!sat.current

        enableSatelliteLayers(lastepoch.current,sat.current)
        enableOrbitLayers(lastepoch.current,sat.current)

        eww.current.redraw();
    }

    //toggle starField
    function toggleStarfield(bool) {
        console.log('toggleStarfield: '+bool)
        let ls = getLayerByName('StarField')
        star.current = (bool!= null)?bool:!star.current
        ls.enabled = star.current
        eww.current.redraw();
    }

    //toggle name overlay
    function toggleNames(bool) {
        console.log('toggleNames: '+bool)
        let lo = getLayerByName('overlay_bright')
        na.current = (bool !== null)?bool:!na.current
        lo.enabled = na.current
        sortLayers()

        eww.current.redraw()
    }

    //toggle products and quicklooks layers
    function toggleGeojson(bool) {
        console.log('toggleGeojson: '+bool)
        let lp = getLayerByName('Products')
        ge.current = (bool !== null)?bool:!ge.current
        lp.enabled = ge.current
        eww.current.redraw()
    }

    function toggleQuicklooks(bool) {
        console.log('toggleQuicklooks: '+bool)
        let ql = getLayerByName('Quicklooks')
        qu.current = (bool !== null)?bool:!qu.current
        ql.enabled = qu.current
        eww.current.redraw()
    }


    function toggleBg(background) {
        let bgindex = -1
        background = (background === null)?  (bg.current + 1)%bgLayers.length : background % bgLayers.length
        bg.current = background
        for(let i=0 ; i<eww.current.layers.length ; i++) {
            if(eww.current.layers[i].type === 'background' && eww.current.layers[i].type) {
                bgindex += 1
                eww.current.layers[i].enabled = (bgindex === background) ? true : false
            }
        }
        eww.current.redraw();
    }

    function toggleOv(overlay) {
        let ovindex = -1
        overlay = (overlay === null)?  (ov.current + 1)%ovLayers.length : overlay % ovLayers.length
        ov.current = overlay
        for(let i=0 ; i<eww.current.layers.length ; i++) {
            if(eww.current.layers[i].type === 'overlay' && eww.current.layers[i].type) {
                ovindex += 1
                eww.current.layers[i].enabled = (ovindex === overlay) ? true : false
            }
        }
        eww.current.redraw();
    }
    
    //toggle DEM 
    function toggleDem(bool) {
        console.log('toogleDem: '+bool)
        dem.current = (bool !== null)?bool:!dem.current
        var elevationModel
        if(dem.current) {
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
    }

    function toggleProjection(projection) {

        let supportedProjections = [ "3D", "Equirectangular", "Mercator","North Polar","South Polar"]
        let nbproj = supportedProjections.length
        proj.current = (projection === null) ? (proj.current + 1)%nbproj : projection%nbproj

        switch (supportedProjections[proj.current]) {
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
        eww.current.redraw() 
    }

    const sortLayers = ()=>{
        eww.current.layers.sort((a, b) => {
            return a.zIndex - b.zIndex;
        })
    }
    
    const setFilter = (filter)=>{
        console.log(filter)
        // setfilter(filter)
        let layer = getLayerByName('Products')
        for (let j = 0; j < layer.renderables.length; j++) {
            layer.renderables[j].filtered = !filterRenderable(layer.renderables[j],filter)
        }
        enableRenderables(layer, lastepoch.current, TRAIL_PRODUCT)

        let tics = getTics(layer)

        layer = getLayerByName('Quicklooks')
        for (let j = 0; j < layer.renderables.length; j++) {
            layer.renderables[j].filtered = !filterRenderable(layer.renderables[j],filter)
        }
        enableRenderables(layer, lastepoch.current, TRAIL_PRODUCT)


        setEwwState((ewwstate) => { return {...ewwstate, tics: tics}})
        eww.current.redraw() 
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

        console.log('adding geo: ')

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
                configuration.attributes = new WorldWind.ShapeAttributes(null);
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
                configuration.highlightAttributes.outlineColor = new WorldWind.Color(1, 0, 1, 0.4);
                configuration.highlightAttributes.interiorColor = new WorldWind.Color(1, 0, 0, 0);
                // configuration.attributes.outlineWidth = 0.3;

                // configuration.attributes.applyLighting = true;
                // configuration.attributes.imageSource = properties.quicklookUrl

            }
    
            //console.log(configuration.attributes);
            return configuration;
        }

        function setProductTimeRange(productlayer) {
            for(let i=0; i<productlayer.renderables.length; i++) {
                let visibilityEnd = productlayer.renderables[i].userProperties.earthObservation.acquisitionInformation[0].acquisitionParameter.acquisitionStartTime
                let visibilityStart = new Date(visibilityEnd.getTime() - TRAIL_PRODUCT)
                productlayer.renderables[i].timeRange = [visibilityStart, visibilityEnd]
            }
        }
        
        function loadCompleteCallback() {
            // console.log(renderableLayer)
            setProductTimeRange(productlayer)
            let closestrenderable = enableRenderables(productlayer, epoch, TRAIL_PRODUCT)
            let tics = getTics(productlayer)
            // let newtics = []
            // newtics = state.geojson.features.map( (item) => {
            // return item.properties.earthObservation.acquisitionInformation[0].acquisitionParameter.acquisitionStartTime.getTime()
            sortLayers()
            setEwwState((ewwstate) => { return {...ewwstate, closestRenderable: closestrenderable, tics: tics}})


            eww.current.redraw();
        }
    
        let productlayer = getLayerByName('Products')
        // we use a custom version of GeoJson Parser which only creates TexturedSurfacePolygon renderables extending our custom SurfaceShape
        // !!! Only Polygon and multi-Polygon geometries are supported. Other types will cause the worldwind engine to crash in endless loops...
        let geoJson = new WorldWind.GeoJSONParser(url);
        geoJson.load(loadCompleteCallback, shapeConfigurationCallback, productlayer);
    }

    function removeGeojson() {

        getLayerByName('Products').removeAllRenderables()
        eww.current.redraw();
      }

    function addWMS() {
    }

    async function addQuicklookWMS(renderable) {
        // console.log(renderable)
        // console.log(renderable.computeSectors(eww.current.drawContext))
        // console.log(WorldWind.Sector.FULL_SPHERE)

        // for S2:  
        // https://view.onda-dias.eu/instance00/ows?&service=WMS&request=GetMap&layers=S2L1C_TRUE_COLOR&styles=&format=image/png&transparent=true&version=1.1.1&width=1500&height=1000&srs=EPSG:4326&bbox=12.357903,41.800495,12.625694,41.984760

        // for S1:  
        // https://view.onda-dias.eu/instance00/ows?&service=WMS&request=GetMap&layers=S1B_IW_GRDH_1SDV_20190520T050758_20190520T050823_016323_01EB81_6EB6&styles=&format=image%2Fpng&transparent=true&version=1.1.1&width=256&height=256&srs=EPSG%3A3857&bbox=2035059.441064533,7044436.526761846,2191602.4749925737,7200979.560689885
        let layername = null
        if(renderable.userProperties.title.indexOf('MSIL1C') >= 0) layername = 'S2L1C_TRUE_COLOR'
        if(renderable.userProperties.title.indexOf('MSIL2A') >= 0) layername = 'S2L2A_TRUE_COLOR'
        if(renderable.userProperties.title.indexOf('GRD') >= 0) layername = 'S1_IW_GRDH_FullResolution'

        if (layername === null) return

        let wmsConfigQL = {
            service: "https://view.onda-dias.eu/instance00/ows",
            // layerNames: renderable.userProperties.title,
            layerNames: layername,
            // layerNames: 'S1_IW_GRDH_FullResolution',
            
            // title: renderable.userProperties.title,
            title: 'QuicklookWMS',
            numLevels: 19,
            format: "image/png",
            size: 256,
            sector: renderable.sector,
            // sector: renderable.sector,
            // sector: WorldWind.Sector.FULL_SPHERE,
            levelZeroDelta: new WorldWind.Location(90, 90)
        }

        // eww.current.removeLayer(getLayerByName('quicklookWMS') )
        removeQuicklookWMS()
        let qllayer =  new WorldWind.WmsLayer(wmsConfigQL, renderable.timeRange[1].toJSON())
        let timerange = []
        timerange[1] = renderable.timeRange[1]
        timerange[0] = new Date(timerange[1].getTime() - TRAIL_QUICKLOOKWMS)
        qllayer.timeRange = timerange
        qllayer.zIndex = ZINDEX_QUICKLOOKWMS 
        qllayer.maxActiveAltitude = 3000000
        eww.current.addLayer(qllayer)
        sortLayers()
        eww.current.redraw()
        console.log(eww.current.layers)
    }

    function removeQuicklookWMS() {
        eww.current.removeLayer(getLayerByName('QuicklookWMS'))
        eww.current.redraw()
    }


    function toggleQuicklookWMS(bool) {
        console.log('QuicklookWMS: '+bool)
        let ql = getLayerByName('QuicklookWMS')
        if (!ql) return
        qw.current = (bool !== null)?bool:!qw.current
        ql.enabled = qw.current
        eww.current.redraw()
    }


    function getLayerByName(name) {
        for (let i = 0; i < eww.current.layers.length; i++) {
            // console.log('display name: '+eww.current.layers[i].displayName)
            if (eww.current.layers[i].displayName === name) return eww.current.layers[i]
        }
        return null
    }

    function getIndexOfRenderable(renderable,layer) {
        for (let j = 0; j < layer.renderables.length; j++) {
            if (layer.renderables[j].userProperties.title === renderable.userProperties.title) return j
        }
        return null
    }

    function enableSatelliteLayers(epoch,bool) {
        for(let l=0 ; l<satelliteLayers.length ; l++) {
            if(satelliteLayers[l].timeRange[0].getTime() > epoch || satelliteLayers[l].timeRange[1].getTime() < epoch) {
                satelliteLayers[l].enabled = false
                // console.log('satstart: '+satelliteLayers[l].timeRange[0]+'  /  '+(new Date(epoch)))
            } else {
                satelliteLayers[l].setTime(new Date(epoch))
                satelliteLayers[l].enabled = (bool === null)?sat.current:bool
            }
        }
    }

    function enableOrbitLayers(epoch,bool) {
        for(let l=0 ; l<orbitLayers.length ; l++) {
            if(orbitLayers[l].timeRange[0].getTime() > epoch || orbitLayers[l].timeRange[1].getTime() < epoch) {
                orbitLayers[l].enabled = false
                // console.log('satstart: '+satelliteLayers[l].timeRange[0]+'  /  '+(new Date(epoch)))
            } else {
                orbitLayers[l].setTime(new Date(epoch))
                orbitLayers[l].enabled = (bool === null)?sat.current:bool
            }
        }
    }

    function enableLayer(layer, epoch, trailduration) {
        return
        if(layer === null) return
        if(epoch !== 0) {
            let visibilityend = layer.timeRange[1].getTime()
            layer.enabled = (epoch-trailduration < visibilityend && visibilityend <= epoch) ? true : false   
        } else {
            layer.enabled = false
        }         
    }

    function getTics(layer) {
        let newtics = []
        for(let i = 0 ; i < layer.renderables.length ; i++) {
            if(!layer.renderables[i].filtered || layer.renderables[i].filtered !== true ) {
                newtics.push(layer.renderables[i].userProperties.earthObservation.acquisitionInformation[0].acquisitionParameter.acquisitionStartTime.getTime())
            }
        }
        console.log(newtics)
        return newtics
    }

    function filterRenderable(renderable,filter) {
        // let newtics = []
        // if(!state.geojson) return
        // newtics = state.geojson.features.map( (item) => {
        //     return item.properties.earthObservation.acquisitionInformation[0].acquisitionParameter.acquisitionStartTime.getTime()
        // })
        let test = true
        if(!renderable.userProperties) return true
        // console.log(renderable)
        for(let i = 0; i < filter.length; i++) {

            if(filter[i].attribute === 'relativePassNumber' ) {
                test *= renderable.userProperties.earthObservation.acquisitionInformation[0].acquisitionParameter.relativePassNumber === filter[i].value
            }
        }
        // console.log(test)
        return test
    }

    function enableRenderables(layer, time, trailduration) {
        if(layer.renderables.length === 0) {
            return null
        }
        let closestrenderableindex = -1
        let oldestrenderableindex = -1
        let youngestrenderableindex = -1
        let youngestrenderableepoch= 0
        let oldestrenderableepoch = (new Date(2100,0)).getTime()
        let closestrenderableepoch = 0
        for (let j = 0; j < layer.renderables.length; j++) {
            let renderable = layer.renderables[j]
            if (time !== 0) {

                let visibilityend = renderable.timeRange[1].getTime()
                let filtered = layer.renderables[j].filtered?layer.renderables[j].filtered:false

                // find closest
                if( visibilityend > closestrenderableepoch && visibilityend <= time && !filtered) {
                    closestrenderableindex = j
                    closestrenderableepoch = visibilityend
                } 
                if( visibilityend <= oldestrenderableepoch && !filtered) {
                    oldestrenderableindex = j
                    oldestrenderableepoch = visibilityend
                }

                if( visibilityend >= youngestrenderableepoch && !filtered) {
                    youngestrenderableindex = j
                    youngestrenderableepoch = visibilityend
                }


                renderable.enabled = (time-trailduration < visibilityend && visibilityend <= time) ? !filtered : false   
            } else {
                renderable.enabled = false
            }         
        }
        // make the closest one always visible 
        if(closestrenderableindex !== -1) {
            layer.renderables[closestrenderableindex].enabled = true
        } else {
            closestrenderableindex = oldestrenderableindex
        }
        // make the youngest one visible if closest not found
        // if(time <= oldestrenderableepoch && closestrenderableindex === -1) {
        //     layer.renderables[oldestrenderableindex].enabled = true
        //     closestrenderableindex = oldestrenderableindex
        // } 
        return (layer.renderables[closestrenderableindex])
    }




    const controller = useRef(null)

    const flipImage = (srcBase64, callback) => {
        const img = new Image();
    
        // https://stackoverflow.com/questions/20600800/js-client-side-exif-orientation-rotate-and-mirror-jpeg-images
        // https://stackoverflow.com/questions/7584794/accessing-jpeg-exif-rotation-data-in-javascript-on-the-client-side/32490603#32490603
        const srcOrientation = 4;
        img.onload = function() {
            var width = img.width,
                height = img.height,
                canvas = document.createElement('canvas'),
                ctx = canvas.getContext("2d");
        
            // set proper canvas dimensions before transform & export
            if (4 < srcOrientation && srcOrientation < 9) {
              canvas.width = height;
              canvas.height = width;
            } else {
              canvas.width = width;
              canvas.height = height;
            }
            // transform context before drawing image
            switch (srcOrientation) {
              case 2: ctx.transform(-1, 0, 0, 1, width, 0); break;
              case 3: ctx.transform(-1, 0, 0, -1, width, height); break;
              case 4: ctx.transform(1, 0, 0, -1, 0, height); break;
            //   case 4: ctx.scale(1,-1); break;
              case 5: ctx.transform(0, 1, 1, 0, 0, 0); break;
              case 6: ctx.transform(0, 1, -1, 0, height, 0); break;
              case 7: ctx.transform(0, -1, -1, 0, height, width); break;
              case 8: ctx.transform(0, -1, 1, 0, 0, width); break;
              default: break;
            }
        
            // draw image
            ctx.drawImage(img, 0, 0);
        
            // export base64
            callback(canvas.toDataURL());

          };
    
          img.src = srcBase64;
        //   return(img)
          
    }


    const getS2LUT = async (url) => {
        try {
            
            let response = await fetch (url, {cache: "force-cache"})
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            let text = await response.text()

            let templut= text.split('\n')
            let lut = []
            let extract = []
            for( let i= 0; i< templut.length; i++) {
                extract = templut[i].split(':')
                lut[i] = {tile:extract[0], footprint: extract[1]}

            }
            // console.log(s2lut)
            s2lut.current = lut
        }
        catch (err) {
            console.log('error getting LUT')
        }
    }

    const getPolygonbyS2tile = (tile) => {
        let i= 0
        while(s2lut.current[i].tile !== tile) {
            i++
        }
        let coordstring = s2lut.current[i].footprint.slice(15,s2lut.current[i].footprint.length-3)
        let coordlist = coordstring.split(',')
        let boundaries = []
        for(let j = 0; j < coordlist.length; j++) {
            let coord = coordlist[j].split(' ')
            let lat = coord[1]
            let lon = coord[0]
            boundaries.push({latitude: lat, longitude: lon})
        }
        let multiboundaries = []
        multiboundaries[0] = boundaries
        return multiboundaries
    }

    const createQL = async (url, footprint, timerange, attributes, userProperties, quicklookLayer) => {

        async function createImage(url) {
            return new Promise((resolve, reject) => {
                flipImage(url, (base64src) => {
                    const imageOfQuickLook = new Image();
                    imageOfQuickLook.addEventListener('load', () => {
                        resolve(imageOfQuickLook);
                    }, false);
                    imageOfQuickLook.src = base64src;
                });
            });
        }
    


        controller.current = new AbortController()

        // if quicklook is already there, do nothing
        for(let i = 0; i < quicklookLayer.renderables.length; i++) {
            if(quicklookLayer.renderables[i].displayName === timerange[1].toUTCString()) return
        }

        try {
            
            let response = await fetch (url, {mode: 'cors', credentials: 'include', signal: controller.current.signal, cache: "force-cache"})
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            let blob = await response.blob()
            let objectURL = URL.createObjectURL(blob)
            let image = await createImage(objectURL)
            
            let quicklook =  new TexturedSurfacePolygon(footprint,attributes)
            // quicklook.maxImageWidth = 64
            // quicklook.maxImageHeight = 64
            quicklook.maximumNumEdgeIntervals = 2;
            quicklook.polarThrottle = 1;
            quicklook.timeRange = timerange
            quicklook.displayName = timerange[1].toUTCString()
            quicklook.zIndex = ZINDEX_QUICKLOOKS
            quicklook.userProperties = userProperties
            
            quicklook.image = image

            // setEwwState((ewwstate) => { return {...ewwstate, image: image}})
            quicklookLayer.addRenderable(quicklook)
            URL.revokeObjectURL(objectURL)
            sortLayers()
            // console.log(eww.current.layers)

            eww.current.redraw()
            
        } catch(err) {
            console.log("Error contacting server...")
            console.log(err)
        }
    }

    const addQuicklook = async (renderable) => {
        if(renderable) {
            // add1Quicklook(renderable)
            let prodlayer = getLayerByName('Products')
            let idx = getIndexOfRenderable(renderable,prodlayer)
            // console.log(idx)
            let j = 0
            for(let i = idx ; idx < prodlayer.renderables.length && j < 10 ; idx++) {
                if(!prodlayer.renderables[idx].filtered || prodlayer.renderables[idx].filtered !== true ) {
                    add1Quicklook(prodlayer.renderables[idx])
                    j+=1
                }
            }
        }
    }

    const add1Quicklook = async (renderable) => {
        if(renderable) {

            let url = renderable.userProperties.quicklookUrl
            if (url == null) {
                console.log("no QL")
                return
            }
            console.log(renderable)
            let footprint 
            // console.log(renderable.boundaries[0])
            if(renderable.userProperties.earthObservation.productInformation.tile) {
                footprint = getPolygonbyS2tile(renderable.userProperties.earthObservation.productInformation.tile)
            } else {
                footprint = renderable.boundaries[0]
            }
            
            let highestlat = 0
            for(let i = 0 ; i < footprint.length ; i++) {
                if(Math.abs(footprint[i].latitude) > highestlat) highestlat = footprint[i].latitude
            }
            // try to filter the quicklook that crashes the shape
            if(highestlat > 84) {
                console.log('I refuse')
                console.log(renderable.boundaries[0])
                return
            }

            let timerange =[]
            timerange[1] = renderable.timeRange[1]
            timerange[0] = new Date(timerange[1].getTime() - TRAIL_QUICKLOOK)
            let attributes = renderable.attributes
            let userProperties = renderable.userProperties
            let quicklookLayer = getLayerByName('Quicklooks')

            createQL(url, footprint, timerange, attributes, userProperties, quicklookLayer)
            decacheQuicklooks()
        }
    }

    function decacheQuicklooks() {
        // getLayerByName('Quicklooks').removeAllRenderables()
        let qlarray = getLayerByName('Quicklooks').renderables
        while (qlarray.length > 50) {
            qlarray.shift()
        }

        eww.current.redraw()
    }

    function removeQuicklooks() {
        getLayerByName('Quicklooks').removeAllRenderables()
        eww.current.redraw()
    }

    async function setTime(epoch) {
        epoch = (epoch)?epoch:lastepoch.current
        // console.log(epoch)

        if(star.current) {
            getLayerByName('StarField').time = new Date(epoch)
        }
        if(atm.current) {
            getLayerByName('Atmosphere').time = new Date(epoch)
        }
        if(qu.current) {
            enableRenderables(getLayerByName('Quicklooks'), epoch, TRAIL_QUICKLOOK)
        }

        let closestrenderable = null
        closestrenderable = enableRenderables(getLayerByName('Products'), epoch, TRAIL_PRODUCT)
        
        if(qw.current) {
            enableLayer(getLayerByName('QuicklookWMS'), epoch, TRAIL_QUICKLOOKWMS)
        }

        if(sat.current) {
            enableSatelliteLayers(epoch,null)
            enableOrbitLayers(epoch,null)
        }

        eww.current.redraw();
        lastepoch.current = epoch
        setEwwState((ewwstate) => { return {...ewwstate, closestRenderable: closestrenderable}})
    }

    async function moveTo(lat, lon, alt) {
        // setTimeout(() => {
            // console.log('move to: '+lat)
            if(lat === ewwstate.latitude && lon === ewwstate.longitude) {
                console.log('already moved there...')
                return
            }
            eww.current.goToAnimator.travelTime = 1300;
            try { // check if lat/lon is same as last time.
                eww.current.goTo(new WorldWind.Position(lat, lon));
            } catch(e) {console.log(e)}
            lastmovetolat.current = lat
            lastmovetolon.current = lon
            eww.current.navigator.range = alt;
            eww.current.navigator.camera.applyLimits()
            eww.current.redraw();
            // }, 1000)
        }


    function getRenderables(x,y) {
        let pickList = eww.current.pick(eww.current.canvasCoordinates(x, y))
        let pickedItems = []
        for (let i = 0; i < pickList.objects.length; i++) {
            if (pickList.objects[i].userObject instanceof TexturedSurfacePolygon && pickList.objects[i].parentLayer.displayName==='Products') {
                pickedItems.push(pickList.objects[i].userObject) 
            }
        }
        return pickedItems
    }

    // callback from eww   
    const setGlobeStates = (wwd ,stage) => {

        if (stage === WorldWind.AFTER_REDRAW) {

            let lo = eww.current.navigator.lookAtLocation.longitude
            let la = eww.current.navigator.lookAtLocation.latitude
            let al = eww.current.navigator.range
            let vp = (al < 2000000?getViewPolygon():'')
            let vpp = 'POINT('+lo.toFixed(4)+' '+la.toFixed(4)+')' 
            setEwwState((ewwstate) => { return {...ewwstate, longitude:lo, latitude: la, altitude: al, viewpolygon: vp, viewpoint:vpp}}) 
        }

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
    }

    const handleDoubleClick2  = (recognizer) => {
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


        eww.current = new WorldWindow(id);

        

        // eww.current.worldWindowController = null;
        eww.current.redrawCallbacks().push(setGlobeStates)

        // better do it after the layers are altered manually
        // eww.current.redrawCallbacks().push( (wwd, stage) => {
        //     console.log(stage)
        //     if (stage === WorldWind.BEFORE_REDRAW) {
        //         wwd.layers.sort(function (a, b) {
        //             return a.zIndex - b.zIndex;
        //         });
        //     }
        // })
        
        WorldWind.configuration.baseUrl = window.location.href

        let starFieldLayer = new StarFieldLayer();

        let atmosphereLayer = new WorldWind.AtmosphereLayer('images/BlackMarble_2016_01deg.jpg');
        // let atmosphereLayer = new WorldWind.AtmosphereLayer('images/BlackMarble_2016_3km.jpg');
        //atmosphereLayer.minActiveAltitude = 5000000

        let quicklookLayer = new WorldWind.RenderableLayer('Quicklooks')
        quicklookLayer.pickEnabled = false

        let productLayer =  new WorldWind.RenderableLayer('Products')

    
        let layers = [
            // { layer: new WorldWind.WmsLayer(wmsConfigBg_s2, ""), enabled: true },
            // { layer: new WorldWind.WmsLayer(wmsConfigBg_terrain, ""), enabled: false },
            // { layer: new WorldWind.WmsLayer(wmsConfigNames, ""), enabled: names },
            { layer: starFieldLayer, enabled: false, zIndex: ZINDEX_STARFIELD },
            { layer: atmosphereLayer, enabled: false, zIndex: ZINDEX_ATMOSPHERE },
            { layer: productLayer, enabled: true, zIndex: ZINDEX_PRODUCTS },
            { layer: quicklookLayer, enabled: true, zIndex: ZINDEX_QUICKLOOKS },
        ];
    
        for (let l = 0; l < bgLayers.length; l++) {
            let layer = new WorldWind.WmsLayer(bgLayers[l], "")
            layer.enabled = false
            layer.zIndex= ZINDEX_BACKGROUND+l
            layer.type='background'
            eww.current.addLayer(layer, "")
        }
        for (let l = 0; l < ovLayers.length; l++) {
            let layer = new WorldWind.WmsLayer(ovLayers[l], "")
            layer.enabled = false
            layer.type='overlay'
            layer.zIndex= ZINDEX_OVERLAY+l
            eww.current.addLayer(layer, "")
        }

        for (let l = 0; l < layers.length; l++) {
            layers[l].layer.enabled = layers[l].enabled;
            layers[l].layer.zIndex = layers[l].zIndex;
            eww.current.addLayer(layers[l].layer);
        }
        for (let l = 0; l < satelliteLayers.length; l++) {
            satelliteLayers[l].enabled = sat.current
            satelliteLayers[l].zIndex= ZINDEX_SATELLITE+l
            eww.current.addLayer(satelliteLayers[l]);
        }

        for (let l = 0; l < orbitLayers.length; l++) {
            orbitLayers[l].enabled = sat.current
            // orbitLayers[l].zIndex= ZINDEX_SATELLITE+l
            eww.current.addLayer(orbitLayers[l]);
        }


        sortLayers()
        console.log(eww.current.layers)
    
        eww.current.redraw();
        getS2LUT('./data/s2lut.txt')
        // eww.current.deepPicking = true;
        // eww.current.orderedRenderingFilters.push(declutterByTime)
    }, []); // effect runs only once
        
  return { 
      eww, 
      ewwstate, 
      initMap, 
      moveTo, 
      removeGeojson, 
      addGeojson,
      toggleGeojson,
      getRenderables, 
      addQuicklookWMS, 
      removeQuicklookWMS,
      toggleQuicklookWMS,
      removeQuicklooks, 
      addQuicklook, 
      toggleQuicklooks,
      toggleStarfield, 
      toggleAtmosphere, 
      setTime, 
      setFilter,
      toggleProjection, 
      toggleNames, 
      toggleModel, 
      toggleBg, 
      toggleOv, 
      toggleDem, 
      northUp 
    }
}
