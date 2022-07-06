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
            console.log('togglename!')
          return {
            ...state,
            mapSettings: {...state.mapSettings, starfield: !state.mapSettings.starfield}
          }
    
          case "toggle_atmosphere":
            console.log('togglename!')
          return {
            ...state,
            mapSettings: {...state.mapSettings, atmosphere: !state.mapSettings.atmosphere}
          }

    
          case "toggle_background":
            console.log('togglename!')
          return {
            ...state,
            mapSettings: {...state.mapSettings, background: state.mapSettings.background + 1}
          }
    
    
          case "toggle_overlay":
            console.log('toggleoverlay!')
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
    

          case "set_mission":
            console.log('set mission!')
          return {
            ...state,
            mission: action.value
          }
        
          case "set_dem":
          return {
            ...state,
            mapSettings: {...state.mapSettings, dem: action.value}
          }
    
    
          case "toggle_satellites":
          return {
            ...state,
            mapSettings: {...state.mapSettings, satellites: !state.mapSettings.satellites}
          }
    
    
          case "toggle_quicklooks":
          return {
            ...state,
            mapSettings: {...state.mapSettings, quicklooks: !state.mapSettings.quicklooks}
          }
    
          


          case "altitude_changed":
            // console.log('set altitude!')
          return {
            ...state,
            altitude: action.value,
            productOn: action.value > 3000000?true:state.productOn,
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
    
          case "onSearchComplete":
            console.log('onSearchComplete')
            console.log(action.value)
            if(state.altitude > state.pointSearchMaxAltitude) {
              return {
                ...state,
                resultDesc: action.value,
                goToDate: !state.animated ? action.value.firstResultDate.getTime() :  action.value.lastResultDate.getTime()
                // resultDesc: {...state.resultDesc, totalLoaded: action.value.totalLoaded, totalResults: action.value.totalResults}
              }
            } else {
              return {
                ...state,
                resultDesc: action.value,
                goToDate: !state.animated ? state.goToDate :  action.value.lastResultDate.getTime()
                // resultDesc: {...state.resultDesc, totalLoaded: action.value.totalLoaded, totalResults: action.value.totalResults}
              }

            }
      // if(altitude > pointSearchMaxAltitude) {
      //   setgoToDate(!animated?searchDesc.firstResultDate:searchDesc.lastResultDate)
      // } else {
      //   if(animated) setgoToDate(searchDesc.lastResultDate)
      // }
      // setresultDesc(()=>{return {...resultDesc, ...searchDesc}})

      

          case "set_selectedProduct":
            console.log('set_selectedProduct:')
            // console.log(action.value)
            if(action.value === state.selectedProduct && state.selectedProduct !== null) {
              return {
                ...state,
                selectedProduct: action.value,
                goToDate: action.value?action.value.timeRange[1].getTime():null,
                productOn: false,
                addQuicklookWMSTrigger: Math.random()
              }
            } else {
              return {
                ...state,
                selectedProduct: action.value,
                goToDate: action.value?action.value.timeRange[1].getTime():null,
              }
            }
          

            case "set_closestitem":
              console.log('set_closestitem')
              console.log(action.value)
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
                console.log(state.filter.length)
                console.log(state.mission)
              let newfilter 
              if(state.filter.length === 0) {
                if(state.mission.indexOf('S1') <0 ) {
                  console.log("filter S1")
                  newfilter = [{
                    attribute: 'relativePassNumber',
                    value: state.closestItem.userProperties.earthObservation.acquisitionInformation[0].acquisitionParameter.relativePassNumber
                  }]
                }
                if(state.mission.indexOf('S2') <0 ) {
                  newfilter = [{
                    attribute: 'relativePassNumber',
                    value: state.closestItem.userProperties.earthObservation.acquisitionInformation[0].acquisitionParameter.relativePassNumber
                  }]
                }
              } else {
                newfilter = []
              }
              return {
                ...state,
                filter: newfilter,
              }
              break
          case "gotoclosestitem":
            // console.log('gotoclosestitem')
            if(state.closestItem === null || state.closestItem._sector === null) return state
            console.log(state)
          return {
            ...state,
            goToDate: state.closestItem.timeRange[1].getTime(),
            // moveToClosestItemTrigger: Math.random(),
            goToPos: {
              lat: state.closestItem._sector.minLatitude,
              lon: state.closestItem._sector.minLongitude
            }
          }
    
          case "set_goToDate":
            console.log('set_goToDate')
            console.log(action.value)
            if(action.value === null) return state
          return {
            ...state,
            goToDate: action.value.getTime(),
            moveToClosestItemTrigger: Math.random()
          }
        
          case "set_searchDate":
            console.log('set_searchDate')
            console.log(action.value)
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


          case "onDateChanged": {
            // console.log('onDateChanged')
            // console.log(action.value.getTime())
            return {
              ...state,
              viewDate: action.value.getTime(),
              productOn: true,
              goToDate: null
            }
          }
    
          case "clear_results":
            console.log('clear_results')
          return {
            ...state,
            // moveToClosestItemTrigger: Math.random(),
            closestItem: null,
            goToDate: null,
            tics: [],
            filter: [],
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
    
          case "set_credentials": {
            return {
              ...state,
              credentials: action.value
            }
          }

          case "reset_credentials": {
            return {
              ...state,
              credentials: ''
            }
          }

        default:
        return state
    }
  }
  let init_date = new Date()
  export const initialState = {
    active: false,
    // mission: 'S1A_IW_RAW__0SDV',
    mission: 'S1A',
    altitude: '5000000',
    appColor: '#bbcc9a',
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
    searchDate: init_date.getTime(),
    resetStartDateTrigger: null,
    pointSearchMaxAltitude: 3000000,
    selectedProduct: null,
    searchPoint: 'POINT(40 0)',
    searchMode: 'global',
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
  }
  