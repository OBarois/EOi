import { useState, useRef } from "react";
import { useDrag } from 'react-use-gesture'
import {useSpring, config, animated} from 'react-spring'

export default function useLog() {
  const debugkeys = useRef()
  const dd = useRef([])
  const [{ x, y }, api] = useSpring(() => ({ x: 0, y: 0 }))
  const bind2 = useDrag(({ offset: [x, y] }) => api.start({ x, y }))
  // const loghtml =     (      <animated.div {...bind2()} style={{ x, y }}  className='Debug'>{debugtext}</animated.div>)
  

  const renderlog = () => {
    if(!debugkeys.current) return
    // dd.current = [{test:true}]
    let keys = []
    for (let [key, value] of Object.entries(debugkeys.current)) {
      // console.log(`${key}: ${value}`);
      keys.push([key,value])
    }

    let debugtext = keys.map( (item) => <div key={item[0]}>{item[0]}: {item[1]}</div> )


    return (
      <animated.div {...bind2()} style={{ x, y }}  className='Debug'>
        {debugtext}
      </animated.div>
      )
  }


  const setlog = (items) => {
    debugkeys.current = {...debugkeys.current,...items}
  }   
  
  return [setlog, renderlog];
}
