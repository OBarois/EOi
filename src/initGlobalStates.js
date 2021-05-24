import { setGlobal } from 'reactn';


export  function initGlobalStates() {
    console.log("init global: "+(new Date()))

    // Set current time as global state
    // setGlobal({appdate: ((new Date()).getTime())})
    // setGlobal({searchepoch: ((new Date()).getTime())})
    // setGlobal({mission: 'S1'})
    // setGlobal({searching: false})
    // setGlobal({apppolygon: ''})
    // setGlobal({replace: true})
    // setGlobal({startend: {start:0, end:0}})
    // setGlobal({setApppickeditems: []})


    setGlobal({
        mission: 'S1',
        altitude: '5000000',
        appColor: '#cc44cf',
        position: {
            clon:'0.5',
            clat:'45' 
        },
        viewDate: new Date(),
        goToDate: new Date(),
        searchDate: new Date(),
        pointSearchMaxAltitude: 3000000,
        selectedProduct: [],
        searchPoint: 'POINT(40 40)',
        geojson: null,
        closestItem: null,
        resultDesc: {
            firstItemDate: null,
            lastItemDate: null,
            totalResults: 0,
            totalLoaded: 0
        },
        animated: false,
        clearGeojsonTrigger: null,
        mapSettings: {
            atmosphere: false,
            starfield: false,
            names: false,
            background: 1,
            overlay:2,
            dem: false,
            satellites: true,
            quicklooks: true
        }
    })
    
}