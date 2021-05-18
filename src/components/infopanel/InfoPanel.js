import React, {useState, useRef, useEffect} from "react";
import {useSpring, animated} from 'react-spring'
import { useDrag } from 'react-use-gesture'
import "./InfoPanel.css"



// import MissionSelector from "./missionselector";





function InfoPanel(props) {

    const [{ x, y }, api] = useSpring(() => ({ x: 0, y: 0 }))
    const bind2 = useDrag(({ offset: [x, y] }) => api.start({ x, y }))


    return   (

        <animated.div {...bind2()} style={{ x, y }}  className='Infopanel'>
        {props.children}
    </animated.div>


    )
    
}

export default InfoPanel
