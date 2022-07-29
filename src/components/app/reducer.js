import {collections} from "./collections.js"

export const reducer = (state, action) => {
    switch (action.type) {
      case "toggle_names":
          console.log('togglename!')
        return {
          ...state,
          mapSettings: {...state.mapSettings, names: !state.mapSettings.names}
        }
  
        case "toggle_starfield":
            console.log('toggle starfield!')
          return {
            ...state,
            mapSettings: {...state.mapSettings, starfield: !state.mapSettings.starfield}
          }
    
          case "toggle_atmosphere":
            console.log('toggle atmosphere!')
          return {
            ...state,
            mapSettings: {...state.mapSettings, atmosphere: !state.mapSettings.atmosphere}
          }

    
          case "toggle_background":
            console.log('toggle background !')
          return {
            ...state,
            mapSettings: {...state.mapSettings, background: state.mapSettings.background + 1}
          }
    
    
          case "toggle_overlay":
            console.log('toggle overlay!')
          return {
            ...state,
            mapSettings: {...state.mapSettings, overlay: state.mapSettings.overlay + 1}
          }
    
    
          case "toggle_projection":
            console.log('toggleprojection!')
          return {
            ...state,
            mapSettings: {...state.mapSettings, projection: state.mapSettings.projection + 1}
          }
    

          case "set_dataset":
            console.log('set dataset!')
            console.log(action.value[1])
          return {
            ...state,
            dataset: action.value[0],
            mapSettings: {...state.mapSettings, satelliteList: action.value[1], datasetSatelliteList: action.value[1]}
          }

          case "set_constellation":
            console.log('set constellation!')
          return {
            ...state,
            mapSettings: {...state.mapSettings, satelliteList: action.value[1]?action.value[0]:state.mapSettings.datasetSatelliteList, constellation: action.value[1]}
          }
          case "set_dem":
          return {
            ...state,
            mapSettings: {...state.mapSettings, dem: action.value}
          }
    
    
          case "toggle_satellites":
            console.log('toggle_satellites!: '+action.value)

          return {
            ...state,
            // mapSettings: {...state.mapSettings, satellites: !state.mapSettings.satellites}
            mapSettings: {...state.mapSettings, satellites: action.value},

          }
    
    
          case "toggle_quicklooks":
          return {
            ...state,
            mapSettings: {...state.mapSettings, quicklooks: !state.mapSettings.quicklooks}
          }
    
          


          case "set_altitude":
            // console.log('set altitude!: '+action.value)
          return {
            ...state,
            altitude: action.value,
            productOn: action.value > state.pointSearchMaxAltitude?true:state.productOn,
            searchMode: (action.value > state.pointSearchMaxAltitude)?'global':'point'
          }
    
    
          case "onResultPage":
            console.log('onResultPage')
            console.log(action.value)
          return {
            ...state,
            resultDesc: action.value.resultdesc,
            geojson: action.value.results
            // resultDesc: {...state.resultDesc, totalLoaded: action.value.totalLoaded, totalResults: action.value.totalResults}
          }
    
          case "onSearchStart":
            console.log('onSearchStart')
            console.log(action.value)
          return {
            ...state,
            tics: [],
            clearResultsTrigger: Math.random(),
            resultDesc: {totalResults:0, totalLoaded:0 },
            closestItem: null,
            filter: [],
            browseMode: state.searchMode,
            searching: true
            // resultDesc: {...state.resultDesc, totalLoaded: action.value.totalLoaded, totalResults: action.value.totalResults}
          }
    
          case "onSearchComplete":
            console.log('onSearchComplete')
            console.log(action.value)
            if(state.altitude > state.pointSearchMaxAltitude) {
              return {
                ...state,
                resultDesc: action.value,
                searching: false
                // goToDate: !state.animated ? action.value.firstResultDate.getTime() :  action.value.lastResultDate.getTime()
                // resultDesc: {...state.resultDesc, totalLoaded: action.value.totalLoaded, totalResults: action.value.totalResults}
              }
            } else {
              return {
                ...state,
                resultDesc: action.value,
                searching: false
                // goToDate: !state.animated ? state.goToDate :  action.value.lastResultDate.getTime()
                // resultDesc: {...state.resultDesc, totalLoaded: action.value.totalLoaded, totalResults: action.value.totalResults}
              }

            }
      

          case "set_selectedProduct":
            console.log('set_selectedProduct:')
            // console.log(action.value)
            if(state.selectedProduct != null && action.value === state.selectedProduct) {
              return {
                ...state,
                selectedProduct: action.value,
                goToDate: action.value?action.value.timeRange[0].getTime():null,
                productOn: false,
                addQuicklookWMSTrigger: Math.random()
              }
            } else {
              return {
                ...state,
                selectedProduct: action.value,
                goToDate: action.value?action.value.timeRange[0].getTime():null,
              }
            }
            

          case "set_closestitem":
            if(!action.value) return state
            return {
              ...state,
              closestItem: action.value,
            }
            


          case "set_tics":
            // console.log('set_tics')
            return {
              ...state,
              tics: action.value,
            }
            
  
          case "set_filter":
            console.log('toggle_filter')
            
            if(state.closestItem === null) return state
            let newfilter 
            if(state.filter.length === 0) {
              if(state.dataset.indexOf('S1') >=0 ) {
                newfilter = [{
                  attribute: 'relativePassNumber',
                  value: state.closestItem.userProperties.earthObservation.acquisitionInformation[0].acquisitionParameter.relativePassNumber
                }]
              }
              if(state.dataset.indexOf('S2') >=0 ) {
                newfilter = [{
                  attribute: 'relativePassNumber',
                  value: state.closestItem.userProperties.earthObservation.acquisitionInformation[0].acquisitionParameter.relativePassNumber
                }]
              }
            } else {
              console.log("no filter")

              newfilter = []
            }
            return {
              ...state,
              filter: newfilter,
            }
            

          case "gotoclosestitem":
            // console.log('gotoclosestitem')
            if(state.closestItem == null || state.closestItem._sector == null) return state
            console.log(state)

            return {
              ...state,
              goToDate: state.closestItem.timeRange[0].getTime(),
              // moveToClosestItemTrigger: Math.random(),
              goToPos: {
                lat: state.closestItem._sector.centroidLatitude(),
                lon: state.closestItem._sector.centroidLongitude(),
                alt: state.altitude,
              }
            }
            
    
          case "set_goToDate":
            console.log('set_goToDate')
            console.log(action.value)
            if(action.value === null) return state
            return {
              ...state,
              goToDate: action.value.getTime(),
              // moveToClosestItemTrigger: Math.random()
            }
        
          case "set_searchDate":
            // console.log('set_searchDate')
            // console.log(action.value)
            return {
              ...state,
              searchDate: action.value.getTime(),
              goToDate: action.value.getTime()
            }
    
          
          case "set_animated":
            console.log('set_animated')
            return {
              ...state,
              animated: action.value,
            }
    
          
          case "set_color":
            console.log('set_color: '+action.value)
            return {
              ...state,
              appColor: action.value,
            }


          case "set_viewDate": {
            // console.log('onDateChanged')
            // console.log(action.value.getTime())
            return {
              ...state,
              viewDate: action.value.getTime(),
              productOn: true
              // goToDate: null
            }
          }
    
          case "clear_results":
            console.log('clear_results')
            // return {
            //   ...state,
            //   // moveToClosestItemTrigger: Math.random(),
            //   closestItem: null,
            //   goToDate: null,
            //   tics: [],
            //   filter: [],
            //   resultDesc: {totalResults:0, totalLoaded:0 },
            //   selectedProduct: null,
            //   clearResultsTrigger: Math.random()
            // }
            return {
              ...state,
              tics: [],
              resultDesc: {totalResults:0, totalLoaded:0 },
              clearResultsTrigger: Math.random()
            }
    
          case "set_searchPoint": {
            // console.log('onDateChanged')
            return {
              ...state,
              searchPoint: action.value
            }
          }

          case "set_zoomscale": {
            // console.log('onDateChanged')
            return {
              ...state,
              zoomScale: action.value
            }
          }

          case "set_position": {
            return {
              ...state,
              position: {
                clon: action.value.lon,
                clat:action.value.lat
              },
            }
          }
    
          case "set_credentials": {
            // console.log(action.value)
            return {
              ...state,
              credentials: action.value
            }
          }

          case "reset_credentials": {
            console.log('reset credentials')
            return {
              ...state,
              credentials: {user:'', pass:''}
            }
          }

          case "toggle_lefthanded": {
            // console.log('toggle_lefthanded')
            return {
              ...state,
              leftHanded: !state.leftHanded
            }
          }

        default:
          return state
    }
  }


  let init_date = new Date()
  export const initialState = {
    active: false,
    searching: false,
    // dataset: 'S1A_IW_RAW__0SDV',
    dataset: 'S1A',
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
      dataset: state.dataset,
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
  