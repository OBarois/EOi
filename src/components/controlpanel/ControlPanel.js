import React, {useState} from "react";
import {useSpring, animated} from 'react-spring'
import { useGesture } from 'react-use-gesture'
import "./controlpanel.css"
// npm install --save-dev @iconify/react @iconify-icons/ic
import { Icon, InlineIcon } from '@iconify/react';
// import baselineExplore from '@iconify-icons/ic/baseline-explore';
import baselinePalette from '@iconify-icons/ic/baseline-palette';



// import MissionSelector from "./missionselector";





function ControlPanel(props) {

    const [open, setOpen] = useState(false)

    const [{ mr },set] = useSpring(() =>({ mr:  -300 }))
    const bind = useGesture( {
        onDrag: ({ down, delta, vxvy }) => {
            if(vxvy[0]>1 || (!down && delta[0] > 100)) {
                set({
                    mr: -300
                })
                setOpen( true)
            } else {
                set({
                    mr: down?-Math.max(delta[0],0):0
                })
                setOpen( false)
            }
        },
    })


    return   (

        <animated.div {...bind()} style={{ right: mr, top:0 }} className='ControlPanel'>
            <div className='PanelControl shadow' onClick={()=>!open?set({mr:-300}):set({mr:0})} >
                {/* <img id='logo'className='Logo' src='./images/EOi_logo.png' alt='' onClick={()=>!open?set({mr:-300}):set({mr:0})} /> */}
                {/* <div className='PanelControl' alt='' onClick={()=>!open?set({mr:-300}):set({mr:0})}></div> */}
                <Icon icon={baselinePalette} width='100%'/>
            </div>
            
            {props.children}
        
        </animated.div>


    )
    
}

export default ControlPanel
