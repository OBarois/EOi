import React, {useState} from "react";
import {useSpring, animated} from 'react-spring'
import { useGesture } from 'react-use-gesture'
import "./controlpanel.css"
// npm install --save-dev @iconify/react @iconify-icons/ic
import { Icon } from '@iconify/react';
// import baselineExplore from '@iconify-icons/ic/baseline-explore';
import baselinePalette from '@iconify-icons/ic/baseline-palette';



// import MissionSelector from "./missionselector";





function ControlPanel(props) {

    const [open, setOpen] = useState(false)
    const [mask, setMask] = useState(false)
    const panelcontrol = React.useRef(null)

    const [{ mr },set] = useSpring(() =>({ mr:  -300 }))
    const bind = useGesture( {
        onDrag: ({ down, delta, vxvy, movement }) => {
            if(vxvy[1]>1 ) {
                set.start({
                    mr: -300,
                    immediate: false
                })
                setOpen( true)
            } else {
                set.start({
                    mr: down?-movement[1]:(movement[1]>50)?-300:0,
                    immediate: false
                })
                setOpen( false)
            }
        },
        onDragEnd: ({ down}) => {
            if(!down) setMask(false)

        }
    },
    {
        domTarget: panelcontrol
    })
    
    const handleclick = () =>{
        setMask(true)
        !open?set.start({mr:-300}):set.start({mr:0})
    } 

// {...bind()}
    return   (

        <animated.div  style={{ bottom: mr, left:0 }} className='ControlPanel'>
            <div ref={panelcontrol} className='PanelControl shadow' onClick={()=>!open?set.start({mr:-300}):set.start({mr:0})} >
                {/* <img id='logo'className='Logo' src='./images/EOi_logo.png' alt='' onClick={()=>!open?set({mr:-300}):set({mr:0})} /> */}
                {/* <div className='PanelControl' alt='' onClick={()=>!open?set({mr:-300}):set({mr:0})}></div> */}
                <Icon icon={baselinePalette} width='100%'/>
            </div>
            <div className='ControlPanelMask' style={{display: !mask?'none':'block'}}/>
            {props.children}
        
        </animated.div>


    )
    
}

export default ControlPanel
