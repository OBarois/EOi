import React, {useState, useRef, useEffect} from "react";
import {useSpring, animated} from 'react-spring'
import { useDrag } from 'react-use-gesture'
import "./LogPanel.css"



// import MissionSelector from "./missionselector";





function LogPanel({items}) {

    const debug = useRef()
    const [debugtext,setdebugtext] = useState([])

    const [{ x, y }, api] = useSpring(() => ({ x: 0, y: 0 }))
    const bind2 = useDrag(({ offset: [x, y] }) => api.start({ x, y }))


    const logdebug = (items) => {
        let dd = []
        debug.current = {...debug.current,...items}
        // debugtext.current = []
        for (let [key, value] of Object.entries(debug.current)) {
            // console.log(`${key}: ${value}`);
            dd.push([key,value])
          }
          setdebugtext( dd.map( (item) => <div key={item[0]}>{item[0]}: {item[1]}</div> ))
    }   
    
    useEffect(() => {
        logdebug(items)
        console.log(items)
    },[items])



    return   (

        <animated.div {...bind2()} style={{ x, y }}  className='Debug'>
        {debugtext}
    </animated.div>


    )
    
}

export default LogPanel
