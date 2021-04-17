import React, {useState, useEffect,useLayoutEffect, useRef} from 'react';
import {useSpring, animated} from 'react-spring'
import './DateSelector.css';

function DateSelectorScale({date, zoomfactor,  step}) {

    const scale = useRef()
    const [opacity, setOpacity] = useState(1)    
    const [active, setActive] = useState(false)    
    const [timescale, setTimescale] = useState('')    
    // const [zoom, setZoom] = useState(zoomfactor)    


    useEffect(() => {  
        return () => {}          
    })
        
    const scaleText = (_start, _zoom) => {
        // console.log('_start: '+_start.toJSON()+'  zoom: '+_zoom)
        if(!scale.current) return
            
        const monthcode = ['JAN','FEB','MAR','APR','MAY','JUN','JUL','AUG','SEP','OCT','NOV','DEC']
        const YEAR_LEVEL = 1000*60*60*24*30*10
        const MONTH_LEVEL = 1000*60*60*24*3
        const DAY5_LEVEL = 1000*60*60*8
        const DAY_LEVEL = 1000*60*70
        const HOUR3_LEVEL = 1000*60*7
        const HOUR_LEVEL = 1000*60*3
        const MIN10_LEVEL = 1000*40
        const MIN_LEVEL = 1000*2

        function pad(number, length) {  
            var str = '' + number;
            while (str.length < length) {
                str = '0' + str;
            }           
            return str;        
        }


        let day, month, hour, year, minute = 0
        let lastday =0
        let lastmonth = 0
        let lastyear = 0
        let lasthour = 0
        let lastminute = 0
        let tics = []    

        for ( let i=0 ; i < scale.current.offsetHeight ; i+=1 ) {
            let refdate = new Date( (i- scale.current.offsetHeight/2) * _zoom + _start.getTime()  )
            day = refdate.getUTCDate()
            month = refdate.getUTCMonth()
            hour = refdate.getUTCHours()
            year = refdate.getUTCFullYear()
            minute = refdate.getUTCMinutes()

            switch (true) {
                case _zoom < MIN_LEVEL:
                    if(minute !== lastminute) {
                        if (minute !== 0 || hour !== 0) {
                            tics.push({class:'HourTic', pos: i, label: pad(hour,2)+':'+pad(minute,2)})
                        } else {
                            if (minute === 0 && hour === 0) {
                                tics.push({class:'DayTic_h', pos: i, label: day})
                                tics.push({class:'MonthTic_h2', pos: i, label: monthcode[month]})
                                //tics.push({class:'YearTic_h', pos: i, label: year})
                            }     
                        }
                    }
                break

                case _zoom < MIN10_LEVEL:
                    if(minute !== lastminute) {
                        if( (minute !== 0 || hour !=0) && minute % 10 === 0) {
                            tics.push({class:'HourTic', pos: i, label: pad(hour,2)+':'+pad(minute,2)})
                        } else {
                            if (minute === 0 && hour === 0) {
                                tics.push({class:'DayTic_h', pos: i, label: day})
                                tics.push({class:'MonthTic_h2', pos: i, label: monthcode[month]})
                                //tics.push({class:'YearTic_h', pos: i, label: year})
                            }     
                        }
                    }
                break

                case _zoom < HOUR_LEVEL:
                    if(hour !== lasthour) {
                        if (hour !== 0) {
                            tics.push({class:'HourTic', pos: i, label: pad(hour,2)+':00'})
                        
                        } else  {
                            tics.push({class:'DayTic_h', pos: i, label: day})
                            tics.push({class:'MonthTic_h2', pos: i, label: monthcode[month]})
                            // tics.push({class:'YearTic_h', pos: i, label: year})            
                        }
                    }
                break

                case _zoom < HOUR3_LEVEL:
                    if(hour !== lasthour) {
                        if (hour !== 0 &&  (hour % 3 === 0 )) {
                            tics.push({class:'HourTic', pos: i, label: pad(hour,2)+':00'})
                        } else  {
                            if (hour === 0) {
                                tics.push({class:'DayTic_h', pos: i, label: day})
                                tics.push({class:'MonthTic_h2', pos: i, label: monthcode[month]})
                                // tics.push({class:'YearTic_h', pos: i, label: year})            
                            }
                        }
                    }    
                break

                case _zoom < DAY_LEVEL:
                    if(day !== lastday) {
                        if ( day !== 1 ) {
                            tics.push({class:'DayTic', pos: i, label: day})
                        } else {
                            tics.push({class:'MonthTic_h', pos: i, label: monthcode[month]})
                            if (month === 0) tics.push({class:'YearTic_h2', pos: i, label: year})
                            // tics.push({class:'YearTic_h2', pos: i, label: year})
                         }
                        
                    }    
                break

                case _zoom < DAY5_LEVEL:
                    if(day !== lastday) {
                        if ( day !== 1 && day !== 30 && day % 5 === 0 ) {
                            tics.push({class:'DayTic', pos: i, label: day})
                        } else {
                            if (day == 1) {
                                // tics.push({class:'DayTic', pos: i, label: day})
                                tics.push({class:'MonthTic_h', pos: i, label: monthcode[month]})
                                if (month === 0) tics.push({class:'YearTic_h2', pos: i, label: year})
                                // tics.push({class:'YearTic_h2', pos: i, label: year})
                            }
                         }
                        
                    }    

                break

                case _zoom < MONTH_LEVEL:
                    if( month !== lastmonth ) {
                        if (month !== 0) {
                            tics.push({class:'MonthTic', pos: i, label: monthcode[month]})
                        } else {
                            tics.push({class:'MonthTic_h', pos: i, label: monthcode[month]})
                            tics.push({class:'YearTic_h2', pos: i, label: year})
                        }
                    }
    
                break

                case _zoom < YEAR_LEVEL:
                    if(year !== lastyear ) {
                        if (month !== 0) {
                            tics.push({class:'MonthTic', pos: i, label: monthcode[month]})
                        } else {
                            // tics.push({class:'MonthTic', pos: i, label: month})
                            tics.push({class:'YearTic', pos: i, label: year})
                        }
                    }
    
                break

                default:
                break
            }
            lastday = day
            lastyear = year
            lastmonth = month
            lasthour = hour
            lastminute = minute
        }
      
        return tics.map(item => ( <animated.div className={item.class} key={item.class+item.pos} style={{top:item.pos,opacity:opacity}}>{item.label}</animated.div>))
    }


    // useLayoutEffect(() => {
    //     setTimescale(scaleText(date,zoomfactor))
    // },[date,zoomfactor])


    useLayoutEffect(() => {
        // console.log('zoomfactor / date: '+zoomfactor + '/ ' + date)
        setTimescale(scaleText(date,zoomfactor))
    },[ zoomfactor,date])

    // const [{ opaciter }, setOpaciter] = useSpring( () => ({ opaciter: 0}) )
    useEffect(() => {

        console.log('step changed to: '+step)
        // //if (Math.abs(zoomfactor-1000*60*60*24)< 1000*60*60*24) zoom = 1000*60*60*24
        // setOpaciter({ 
        //     to: {
        //         opaciter: 1
        //     },
        //     config: {  duration: 1000, resolution: 0.01,decay: true},
        //     immediate: false,
        //     onFrame: ()=>{
        //         console.log('opacity:'+opaciter.value)
        //         // setTimescale(scaleText(new Date(dater.value),zoomer.value))
        //         setOpacity(opaciter.value)
        //     }
        // })

    },[step])



    return (
        <animated.div ref={scale} className='DateSelectorScale' >
            {timescale}
        </animated.div>
    )
}
export default DateSelectorScale
