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
        onDragStart: ()=>setMask(true),
        onDrag: ({ down, delta, vxvy, movement }) => {
            // if(vxvy[1]>1 ) {
            //     openPanel()
            //     // set.start({
            //     //     mr: -300,
            //     //     immediate: false,
            //     //     onRest: ()=>{setTimeout(()=>setOpen( true),2000)} 
            //     // })
                
            // } else {
                set.start({
                    mr: down?-movement[1]:(movement[1]>100)?-300:open?-300:0,
                    immediate: false,
                    onChange: ()=>{ 
                        setOpen( (mr.get() === 0)?true:false)
                    },
                    onRest: ()=> {
                        if(!down) {
                            setOpen( (mr.get() === 0)?true:false)
                        }
                    }
                })
            // }
        },
        onDragEnd: () => {
            setTimeout( ()=>setMask(false), 600)
        },
    },
    {
        // domTarget: panelcontrol,
        drag: {useTouch: true},
        pinch: {useTouch: true},
    })


    return   (

        <animated.div  style={{ bottom: mr, left:0 }} className='ControlPanel'>
            <div ref={panelcontrol} {...bind()} className='PanelControl shadow' >
                {/* <img id='logo'className='Logo' src='./images/EOi_logo.png' alt='' onClick={()=>!open?set({mr:-300}):set({mr:0})} /> */}
                {/* <div className='PanelControl' alt='' onClick={()=>!open?set({mr:-300}):set({mr:0})}></div> */}
                <Icon icon={baselinePalette} width='100%'/>
            </div>
            <div className='ControlPanelMask' style={{display: !mask?'none':'block'}}/>
            <div className='ControlPanelBlend'>
                {props.children}
                </div>
        
        </animated.div>


    )
    
}

export default ControlPanel
