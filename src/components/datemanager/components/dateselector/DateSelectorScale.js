import React, {useState, useEffect,useLayoutEffect, useRef} from 'react';
import './DateSelector.css';

function DateSelectorScale({date, zoomfactor}) {

    const scale = useRef()
    const [timescale, setTimescale] = useState('')    
    // const [zoom, setZoom] = useState(zoomfactor)    


    useEffect(() => {  
        return () => {}          
    })
        
    const scaleText = (_start, _zoom) => {
        // console.log('_start: '+_start.toJSON()+'  zoom: '+_zoom)
        if(!scale.current) return
            
        const monthcode = ['JAN','FEB','MAR','APR','MAY','JUN','JUL','AUG','SEP','OCT','NOV','DEC']
        const YEAR_LEVEL = 1000*60*60*24*30*3
        const MONTH4_LEVEL = 1000*60*60*24*4
        const MONTH_LEVEL = 1000*60*60*24*2
        const DAY5_LEVEL = 1000*60*60*8
        const DAY_LEVEL = 1000*60*70
        const DAY_HOUR_LEVEL = 1000*60*30
        const HOUR6_LEVEL = 1000*60*20
        const HOUR3_LEVEL = 1000*60*7
        const HOUR_LEVEL = 1000*60*3
        const MIN20_LEVEL = 1000*60
        const MIN10_LEVEL = 1000*40
        const MIN2_LEVEL = 1000*4
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
                    if(minute !== lastminute && i!==0) {
                        if (minute !== 0 || hour !== 0) {
                            tics.push({class:'HourTic', pos: i, label: pad(hour,2)+':'+pad(minute,2)})
                        } else {
                            if (minute === 0 && hour === 0) {
                                tics.push({class:'DayTic_h', pos: i, label: pad(day,2)})
                                tics.push({class:'MonthTic_h2', pos: i, label: monthcode[month]})
                                //tics.push({class:'YearTic_h', pos: i, label: year})
                            }     
                        }
                    }
                break

                case _zoom < MIN2_LEVEL:
                    if(minute !== lastminute  && i!==0) {
                        if( (minute !== 0 || hour !==0) && minute % 2 === 0) {
                            tics.push({class:'HourTic', pos: i, label: pad(hour,2)+':'+pad(minute,2)})
                        } else {
                            if (minute === 0 && hour === 0) {
                                tics.push({class:'DayTic_h', pos: i, label: pad(day,2)})
                                tics.push({class:'MonthTic_h2', pos: i, label: monthcode[month]})
                                //tics.push({class:'YearTic_h', pos: i, label: year})
                            }     
                        }
                    }
                break


                case _zoom < MIN10_LEVEL:
                    if(minute !== lastminute  && i!==0) {
                        if( (minute !== 0 || hour !==0) && minute % 10 === 0) {
                            tics.push({class:'HourTic', pos: i, label: pad(hour,2)+':'+pad(minute,2)})
                        } else {
                            if (minute === 0 && hour === 0) {
                                tics.push({class:'DayTic_h', pos: i, label: pad(day,2)})
                                tics.push({class:'MonthTic_h2', pos: i, label: monthcode[month]})
                                //tics.push({class:'YearTic_h', pos: i, label: year})
                            }     
                        }
                    }
                break

                case _zoom < MIN20_LEVEL:
                    if(minute !== lastminute && i!==0) {
                        if( (minute !== 0 || hour !==0) && minute % 20 === 0) {
                            tics.push({class:'HourTic', pos: i, label: pad(hour,2)+':'+pad(minute,2)})
                        } else {
                            if (minute === 0 && hour === 0) {
                                tics.push({class:'DayTic_h', pos: i, label: pad(day,2)})
                                tics.push({class:'MonthTic_h2', pos: i, label: monthcode[month]})
                                //tics.push({class:'YearTic_h', pos: i, label: year})
                            }     
                        }
                    }
                break

                case _zoom < HOUR_LEVEL:
                    if(hour !== lasthour && i!==0) {
                        if (hour !== 0) {
                            tics.push({class:'HourTic', pos: i, label: pad(hour,2)+':00'})
                        
                        } else  {
                            tics.push({class:'DayTic_h', pos: i, label: pad(day,2)})
                            tics.push({class:'MonthTic_h2', pos: i, label: monthcode[month]})
                            // tics.push({class:'YearTic_h', pos: i, label: year})            
                        }
                    }
                break

                case _zoom < HOUR3_LEVEL:
                    if(hour !== lasthour && i!==0) {
                        if (hour !== 0 &&  (hour % 3 === 0 )) {
                            tics.push({class:'HourTic', pos: i, label: pad(hour,2)+':00'})
                        } else  {
                            if (hour === 0) {
                                tics.push({class:'DayTic_h', pos: i, label: pad(day,2)})
                                tics.push({class:'MonthTic_h2', pos: i, label: monthcode[month]})
                                // tics.push({class:'YearTic_h', pos: i, label: year})            
                            }
                        }
                    }    
                break

                case _zoom < HOUR6_LEVEL:
                    if(hour !== lasthour && i!==0) {
                        if (hour !== 0 &&  (hour % 6 === 0 )) {
                            tics.push({class:'HourTic', pos: i, label: pad(hour,2)+':00'})
                        } else  {
                            if (hour === 0) {
                                tics.push({class:'DayTic_h', pos: i, label: pad(day,2)})
                                tics.push({class:'MonthTic_h2', pos: i, label: monthcode[month]})
                                // tics.push({class:'YearTic_h', pos: i, label: year})            
                            }
                        }
                    }    
                break



                case _zoom < DAY_HOUR_LEVEL:
                    if(day !== lastday && i!==0) {
                        tics.push({class:'DayTic_h', pos: i, label: pad(day,2)})
                        tics.push({class:'MonthTic_h2', pos: i, label: monthcode[month]})

                    }    
                break


                case _zoom < DAY_LEVEL:
                    if(day !== lastday && i!==0) {
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
                    if(day !== lastday && i!==0) {
                        if ( day !== 1 && day !== 30 && day % 5 === 0 ) {
                            tics.push({class:'DayTic', pos: i, label: day})
                        } else {
                            if (day === 1) {
                                // tics.push({class:'DayTic', pos: i, label: day})
                                tics.push({class:'MonthTic_h', pos: i, label: monthcode[month]})
                                if (month === 0) tics.push({class:'YearTic_h2', pos: i, label: year})
                                // tics.push({class:'YearTic_h2', pos: i, label: year})
                            }
                         }
                        
                    }    

                break

                case _zoom < MONTH_LEVEL:
                    if( month !== lastmonth  && i!==0) {
                        if (month !== 0) {
                            tics.push({class:'MonthTic', pos: i, label: monthcode[month]})
                        } else {
                            tics.push({class:'MonthTic_h', pos: i, label: monthcode[month]})
                            tics.push({class:'YearTic_h2', pos: i, label: year})
                        }
                    }
    
                break

                case _zoom < MONTH4_LEVEL:
                    if( month !== lastmonth  && i!==0) {
                        if (month !== 0 && month !== 11 && (month) % 3 === 0 ) {
                            tics.push({class:'MonthTic', pos: i, label: monthcode[month]})
                        } else {
                            if (month === 0) {
                                tics.push({class:'MonthTic_h', pos: i, label: monthcode[month]})
                                tics.push({class:'YearTic_h2', pos: i, label: year})
                            }
                        }
                    }
    
                break

                case _zoom < YEAR_LEVEL:
                    if(year !== lastyear  && i!==0) {
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
      
        return tics.map(item => ( <div className={item.class} key={item.class+item.pos} style={{top:item.pos,opacity:1}}>{item.label}</div>))
    }


    // useLayoutEffect(() => {
    //     setTimescale(scaleText(date,zoomfactor))
    // },[date,zoomfactor])


    useLayoutEffect(() => {
        // console.log('zoomfactor / date: '+zoomfactor + '/ ' + date)
        setTimescale(scaleText(date,zoomfactor))
    },[ zoomfactor,date])


    return (
        <div ref={scale} className='DateSelectorScale' >
            {timescale}
        </div>
    )
}
export default DateSelectorScale
