
    import { useState, useRef } from "react"
    
    export default function useHandleDoubleTap(tapCallback,doubleTapCallback) {

        const [lastTap, setLasttap] = useState()
        const clicktimeout = useRef()
    
        const handleTap = (event) => {
            // console.log(event)
            event.stopPropagation()
            event.preventDefault()
            const now = Date.now();
            if (lastTap && (now - lastTap) < 300) {
                clearTimeout(clicktimeout.current)   
                doubleTapCallback();
            } else {
                setLasttap(now)    
                clicktimeout.current = setTimeout(() => {
                    tapCallback()
                }, 300);
            }

        }

        return {handleTap}


    }
    
