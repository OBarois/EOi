import { setGlobal } from 'reactn';


export  function initGlobalStates() {
    console.log("init global: "+(new Date()).getTime())

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
        satellites: false,
        appColor: '#222222',
        position: {
            clon:'0.5',
            clat:'40' 
        },
        viewDate: new Date(),
        mapSettings: {
            atmosphere: true,
            starfield: true,
            names: false,
            background: 1,
            overlay:2,
            dem: true
        }
    })
    
}