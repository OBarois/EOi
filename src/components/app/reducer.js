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

          case "north_up":
            console.log('North Up!')
          return {
            ...state,
            mapSettings: {...state.mapSettings, northup: state.northup+1}
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
            // console.log(action.value[0])
            // console.log(action.value[1])
            // console.log(action.value[2])
            // console.log(action.value[3])
            console.log(action.value[4])
            return {
            ...state,
            dataset: action.value[0],
            cycle: action.value[2],
            freetext: action.value[3],
            searchWindow: action.value[4],
            mapSettings: {...state.mapSettings, satelliteList: action.value[1], datasetSatelliteList: action.value[1]}
          }

          case "set_dem":
            return {
              ...state,
              mapSettings: {...state.mapSettings, dem: action.value}
            }
      
  
          case "set_constellation":
            console.log('set constellation!')
          return {
            ...state,
            mapSettings: {...state.mapSettings, satelliteList: action.value[1]?action.value[0]:state.mapSettings.datasetSatelliteList, constellation: action.value[1], satellites: action.value[1]?true:state.mapSettings.satellites}
          }
    
          case "toggle_satellites":
            console.log('toggle_satellites!: '+action.value)

          return {
            ...state,
            // mapSettings: {...state.mapSettings, satellites: !state.mapSettings.satellites}
            mapSettings: {...state.mapSettings, satellites: (action.value != null)?action.value:!state.mapSettings.satellites, constellation: action.value?state.mapSettings.constellation:false},

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

          case "freetextsearch":
            return {
              ...state,
              freetext: action.value,
              searchtrigger: Math.random(),
            }
    
    
          case "onResultPage":
            // console.log('onResultPage')
            // console.log(action.value)
          return {
            ...state,
            resultDesc: action.value.resultdesc,
            geojson: action.value.results
            // resultDesc: {...state.resultDesc, totalLoaded: action.value.totalLoaded, totalResults: action.value.totalResults}
          }

          case "clearResult":
            console.log('clear result')
            return {
              ...state,
              // tics: [],
              clearResultsTrigger: Math.random(),
              // geojson: null,
              resultDesc: {totalResults:0, totalLoaded:0 },
              closestItem: null,
              filter: [],
              browseMode: state.searchMode,
              searchWinStart: null,
              searching: false
              // resultDesc: {...state.resultDesc, totalLoaded: action.value.totalLoaded, totalResults: action.value.totalResults}
            }
  
            
          case "onSearchStart":
            console.log('onSearchStart')
            // // console.log(action.value)
            // // let julianstart = Math.floor(state.searchDate/state.searchWindow) * state.searchWindow
            // // let startdate = julianstart
            // // let enddate = julianstart + state.searchWindow - 1000

            // let day = 1000 * 60 * 60 * 24
            // // let startdate = Math.floor((state.searchDate - (state.searchWindow/2))/day) * day
            // // let enddate = Math.floor((state.searchDate + (state.searchWindow/2))/day) * day

            // let searchWinDay = Math.floor(state.searchWindow / day) * day    
            // let startdate = Math.floor(state.searchDate/searchWinDay) * searchWinDay
            // let enddate = startdate + searchWinDay
    
    
            // let startdate = Math.floor(state.searchDate/state.searchWindow) * state.searchWindow
            // let enddate = Math.floor((state.searchDate + (state.searchWindow/2))/day) * day


          return {
            ...state,
            // tics: [],
            // geojson: null,
            clearResultsTrigger: Math.random(),
            resultDesc: {totalResults:0, totalLoaded:0 },
            closestItem: null,
            filter: [],
            browseMode: state.searchMode,
            searching: true,
            // searchWinStart: startdate,
            // searchWinEnd: enddate,
            // resultDesc: {...state.resultDesc, totalLoaded: action.value.totalLoaded, totalResults: action.value.totalResults}
          }
    
          case "onSearchComplete":
            // console.log('onSearchComplete')
            // console.log(action.value)
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
      
          case  "set_searchWindow":
            // console.log('set_searchWindow: ')
            // console.log(action.value)
            // let julianstart2 = Math.floor(state.searchDate/action.value) * action.value
            // let startdate2 = julianstart2
            // let enddate2 = julianstart2 + action.value - 1000


            return {
              ...state,
              searchWindow: action.value.win,
              searchWinStart: action.value.wins,
              searchWinEnd: action.value.wine,
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
            return {
              ...state,
              tics: action.value,
            }
              
          // case "set_step":
          //   console.log('set_step: '+action.value)
          //   if(action.value === 'cycle') {
          //     return {
          //       ...state,
          //       // cycle: 1000*60*60*24*12,
          //     } 
          //   } else return state
                
        
          case "set_filter":
            console.log('toggle_filter')
            console.log(state.filter)
            
            if(state.closestItem === null) return state
            let newfilter = []
            if(state.filter.length === 0 || !state.filter) {
              if(state.dataset.indexOf('S1') >=0 ) {
                newfilter = [{
                  attribute: 'relativePassNumber',
                  value: state.closestItem.closest.userProperties.earthObservation.acquisitionInformation[0].acquisitionParameter.relativePassNumber
                }]
              }
              if(state.dataset.indexOf('S2') >=0 ) {
                newfilter = [{
                  attribute: 'relativePassNumber',
                  value: state.closestItem.closest.userProperties.earthObservation.acquisitionInformation[0].acquisitionParameter.relativePassNumber
                },
                {
                  attribute: 'cloudCoverPercentage',
                  value: 20
                }
              ]
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
              // if(state.closestItem == null || state.closestItem.closest._sector == null) return state
              if(state.closestItem == null) return state
              // console.log(state)
  
              return {
                ...state,
                goToDate: state.closestItem.closest.timeRange[0].getTime(),
                // moveToClosestItemTrigger: Math.random(),
                goToPos: {
                  lat: state.closestItem.closest._sector == null?0:state.closestItem.closest._sector.centroidLatitude(),
                  lon: state.closestItem.closest._sector == null?0:state.closestItem.closest._sector.centroidLongitude(),
                alt: state.altitude,
                }
              }
              
              case "gotonextitem":
                // console.log('gotoclosestitem')
                // if(state.closestItem == null || state.closestItem.next._sector == null) return state
                if(state.closestItem == null ) return state
                // console.log(state)
    
                if(state.closestItem.next.sector != null) {
                  return {
                    ...state,
                    goToDate: state.closestItem.next.timeRange[0].getTime(),
                    // moveToClosestItemTrigger: Math.random(),
                    goToPos: {
                      // lat: state.closestItem.previous.sector == null?0:state.closestItem.previous.sector.centroidLatitude(),
                      // lon: state.closestItem.previous.sector == null?0:state.closestItem.previous.sector.centroidLongitude(),
                      lat: state.closestItem.next.sector.centroidLatitude(),
                      lon: state.closestItem.next.sector.centroidLongitude(),
                        alt: state.altitude,
                    }
                  }

                } else {
                  return {
                    ...state,
                    goToDate: state.closestItem.next.timeRange[0].getTime()
                  }
                }

                case "gotopreviousitem":
                  // console.log('gotoclosestitem')
                  // if(state.closestItem == null || state.closestItem.previous._sector == null) return state
                  if(state.closestItem == null) return state

                  if(state.closestItem.previous.sector != null) {
                    return {
                      ...state,
                      goToDate: state.closestItem.previous.timeRange[0].getTime(),
                      // moveToClosestItemTrigger: Math.random(),
                      goToPos: {
                        // lat: state.closestItem.previous.sector == null?0:state.closestItem.previous.sector.centroidLatitude(),
                        // lon: state.closestItem.previous.sector == null?0:state.closestItem.previous.sector.centroidLongitude(),
                        lat: state.closestItem.previous.sector.centroidLatitude(),
                        lon: state.closestItem.previous.sector.centroidLongitude(),
                          alt: state.altitude,
                      }
                    }
  
                  } else {
                    return {
                      ...state,
                      goToDate: state.closestItem.previous.timeRange[0].getTime()
                    }
                  }
                  
                    
                
          // case "set_goToDate":
          //   console.log('set_goToDate')
          //   // console.log(action.value)
          //   if(action.value === null) return state
          //   return {
          //     ...state,
          //     goToDate: action.value.getTime(),
          //     // moveToClosestItemTrigger: Math.random()
          //   }
        
          case "set_searchDate":
            console.log('set_searchDate')

            let day = 1000 * 60 * 60 * 24
            let searchWinDay = Math.floor(state.searchWindow / day) * day
            let startdate = Math.floor(action.value.getTime()/searchWinDay) * searchWinDay
            let enddate = startdate + searchWinDay

            return {
              ...state,
              searchDate: action.value.getTime(),
              searchWinStart: startdate,
              searchWinEnd: enddate,
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
    
    
          case "set_searchPoint": {
            // console.log('set_searchPoint')
            return {
              ...state,
              searchPoint: action.value
            }
          }

          case "set_zoomscale": {
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

          case "set_token": {
            console.log('set token: ')
            console.log(action.value)
            return {
              ...state,
              token: action.value
            }
          }
          case "set_credentials": {
            console.log(action.value)
            let newcreds = state.credentials
            let i
            let found = false
            for ( i=0; i< state.credentials.length;i++) {
              if(state.credentials[i].key && state.credentials[i].key == action.value.key) {
                newcreds[i] = action.value
                found = true
              } 
            }
            if(!found) newcreds.push(action.value)

            
      
            return {
              ...state,
              credentials: newcreds
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
    dataset: 'SciHub/S1',
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
    credentials: {key:'',user:'', pass:''},
    // resetStartDateTrigger: null,
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
    searchWindow: 1000 * 60 * 60 * 24,
    mapSettings: {
        atmosphere: false,
        starfield: false,
        names: false,
        background: 0,
        overlay:1,
        dem: false,
        satellites: false,
        quicklooks: true,
        projection: 0,
        northup: 0
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
      searchMode: state.searchMode,
      goToDate: state.goToDate,
      credentials: state.credentials,
      leftHanded: state.leftHanded,
      searchPoint: state.searchPoint,
      searchWinStart: state.searchWinStart,
      searchWinEnd: state.searchWinEnd,
    }

  }
  