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
        appColor: '#e0963a',
        position: {
            clon:'0.5',
            clat:'45' 
        },
        viewDate: new Date(),
        goToDate: new Date(),
        searchDate: new Date(),
        resetStartDateTrigger: null,
        pointSearchMaxAltitude: 3000000,
        selectedProduct: null,
        searchPoint: 'POINT(40 0)',
        geojson: null,
        closestItem: null,
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
            atmosphere: true,
            starfield: true,
            names: false,
            background: 0,
            overlay:1,
            dem: false,
            satellites: true,
            quicklooks: true,
            projection: 0
        }
    })
    
}