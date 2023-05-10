import {collections} from "./collections.js"
import JSONCrush from "jsoncrush"





  let init_date = new Date()
  export const defaultstate = {
    active: false,
    searching: false,
    // dataset: 'S1A_IW_RAW__0SDV',
    dataset: 'S1A',
    altitude: '5000000',
    appColor: '#d1498f',
    position: {
        clon:'0.5',
        clat:'45' 
    },
    viewDate: init_date.getTime(),
    goToDate: init_date.getTime(),
    goToPos: {
      lat: 0,
      lon: 0
    },
    zoomScale: 6461494,
    searchDate: null,
    credentials: {user:'', pass:''},
    resetStartDateTrigger: null,
    pointSearchMaxAltitude: 3000000,
    selectedProduct: null,
    searchPoint: 'POINT(40 0)',
    searchMode: 'global',
    browseMode: 'global',
    geojson: null,
    filter: [],
    closestItem: null,
    tics: [],
    addQuicklookWMSTrigger: null,
    moveToClosestItemTrigger: null,
    resultDesc: {
        firstItemDate: null,
        lastItemDate: null,
        totalResults: 0,
        totalLoaded: 0
    },
    animated: false,
    cycle: 1000*60*60*24*12,
    clearResultsTrigger: null,
    mapSettings: {
        atmosphere: false,
        starfield: false,
        names: false,
        background: 0,
        overlay:1,
        dem: false,
        satellites: false,
        satelliteList: ['s1a'],
        datasetSatelliteList: ['s1a'],
        constellation: false,
        quicklooks: true,
        projection: 0
    },
    collections: collections,
    leftHanded: false
  }

  export const getsavedstate = (state) => {
    return {
      dataset: state.dataset,
      cycle: state.cycle,
      altitude: state.altitude,
      appColor: state.appColor,
      position: state.position,
      zoomScale: state.zoomScale,
      animated: state.animated,
      mapSettings: state.mapSettings,
      viewDate: state.viewDate,
      searchDate: state.searchDate,
      goToDate: state.goToDate,
      credentials: state.credentials,
      leftHanded: state.leftHanded

    }

  }
  export const getsharedstate = (state) => {
    return {
      dataset: state.dataset,
      cycle: state.cycle,
      altitude: state.altitude,
      appColor: state.appColor,
      position: state.position,
      animated: state.animated,
      zoomScale: state.zoomScale,
      mapSettings: state.mapSettings,
      viewDate: state.viewDate,
      searchDate: state.searchDate,
      goToDate: state.goToDate,
      // leftHanded: state.leftHanded
    }

  }

  export const initstate = (state) => {

    try {
      let eoi_state = JSON.parse(window.localStorage.getItem("eoi_state"))


      let paramindex = window.location.href.indexOf('?s=') 
      let urlparam = window.location.href.substring(paramindex+3)
      // window.location.href = window.location.href.split('?')[0]
      window.history.replaceState(null, document.title, window.location.href.split('?')[0])

      let param = {}
      if(paramindex >= 0) {
      
        param = JSON.parse(JSONCrush.uncrush(decodeURIComponent(urlparam)))
        console.log(param)
  

    }

    let initmapsettings = {...defaultstate.mapSettings,...eoi_state.mapSettings,...param.mapSettings}

    let initstate = {...defaultstate,...eoi_state,...param,mapSettings: initmapsettings}
    console.log(initstate)

    return(initstate)
  
  }       catch {
    return(defaultstate)
  }

  }
