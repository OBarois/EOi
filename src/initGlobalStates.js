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
        satellites: true,
        appColor: '#ebd1d1',
        position: {
            clon:'0.5',
            clat:'45' 
        },
        viewDate: new Date(),
        searchDate: new Date(),
        mapSettings: {
            atmosphere: false,
            starfield: true,
            names: false,
            background: 1,
            overlay:2,
            dem: true
        }
    })
    
}