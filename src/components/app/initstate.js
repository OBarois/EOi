import {collections} from "./collections.js"
import JSONCrush from "jsoncrush"





  let init_date = new Date()
  export const defaultstate = {
    active: false,
    searching: false,
    // mission: 'S1A_IW_RAW__0SDV',
    mission: 'S1A',
    altitude: '5000000',
    appColor: '#b575c5',
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
    clearResultsTrigger: null,
    mapSettings: {
        atmosphere: false,
        starfield: false,
        names: false,
        background: 0,
        overlay:1,
        dem: false,
        satellites: false,
        quicklooks: true,
        projection: 0
    },
    collections: collections,
    leftHanded: false
  }

  export const getsavedstate = (state) => {
    return {
      mission: state.mission,
      altitude: state.altitude,
      appColor: state.appColor,
      position: state.position,
      animated: state.animated,
      mapSettings: state.mapSettings,
      viewDate: state.viewDate,
      searchDate: state.searchDate,
      goToDate: state.goToDate,
      credentials: state.credentials,
      leftHanded: state.leftHanded

    }

  }

  export const initstate = (state) => {
    let eoi_state = JSON.parse(window.localStorage.getItem("eoi_state"))


    let paramindex = window.location.href.indexOf('?s=') 
    console.log(paramindex)

    let param = {}
    if(paramindex >= 0) {
      param = JSON.parse(JSONCrush.uncrush(decodeURIComponent(window.location.href.substring(paramindex+3))))
      console.log(param)

    }
    console.log(defaultstate)

    return({...defaultstate,...eoi_state,...param})
  
  }

