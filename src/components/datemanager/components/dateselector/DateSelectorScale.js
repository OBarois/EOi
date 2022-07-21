import React, {useState, useEffect, useRef} from 'react';
import './DateSelector.css';

function DateSelectorScale({date, zoomfactor, resulttics, lefthanded}) {

    const scale = useRef(0)
    const canvas = useRef(null)
    const [timescale, setTimescale] = useState('')   
    const leftHanded = useRef(lefthanded)   
    // const [resultepochs, ] = useState(resulttics)   
    
    // saves the current zoom and date to handle the widow resize
    const izoom = useRef(zoomfactor)    
    const idate = useRef(date)    
    const itics = useRef(resulttics)    


        
    const scaleText = (_start, _zoom, _resulttics) => {
        // console.log('_start: '+_start.toJSON()+'  zoom: '+_zoom)
        // if(!scale.current) return

        let ctx = canvas.current.getContext("2d");
        ctx.font = "14px Arial"
        ctx.shadowColor = "rgba(0,0,0,0.8"
        ctx.shadowOffsetX = 1
        ctx.shadowOffsetY = 1
        ctx.shadowBlur = 2
        ctx.fillStyle = "red";
        ctx.clearRect(0, 0, window.innerWidth, window.innerHeight)

            
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
        const MIN10_LEVEL = 1000*30
        const MIN2_LEVEL = 1000*5
        const MIN_LEVEL = 1000*3

        function pad(number, length) {  
            var str = '' + number;
            while (str.length < length) {
                str = '0' + str;
            }           
            return str;        
        }

        function lefthand(classname)  {
            return leftHanded.current?classname+'L':classname
        }

        let day, month, hour, year, minute = 0
        let lastday =0
        let lastmonth = 0
        let lastyear = 0
        let lasthour = 0
        let lastminute = 0
        let tics = []
        let lastticslength = 0   
        let labeloffset = 0

        // let skip = parseInt(scale.current.style.fontSize)
        // let iteration = 0
        for ( let i=0 ; i < scale.current.offsetHeight ; i+=1 ) {
            let refdate = new Date( (i- scale.current.offsetHeight/2) * _zoom + _start.getTime()  )
            day = refdate.getUTCDate()
            month = refdate.getUTCMonth()
            hour = refdate.getUTCHours()
            year = refdate.getUTCFullYear()
            minute = refdate.getUTCMinutes()
            

            switch (true) {
                case _zoom < MIN_LEVEL:
                    labeloffset = 60000
                    if(minute !== lastminute && i!==0) {
                        if (minute !== 0 || hour !== 0) {
                            tics.push({class:lefthand('HourTic'), pos: i, label: pad(hour,2)+':'+pad(minute,2)})
                            // ctx.fillText(pad(hour,2)+':'+pad(minute,2), 2, i);
                        } else {
                            if (minute === 0 && hour === 0) {
                                tics.push({class:lefthand('DayTic_h'), pos: i, label: pad(day,2)})
                                tics.push({class:lefthand('MonthTic_h2'), pos: i, label: monthcode[month]})
                                //tics.push({class:'YearTic_h', pos: i, label: year})

                            }     
                        }
                    }
                break

                case _zoom < MIN2_LEVEL:
                    labeloffset = 60000*2
                    if(minute !== lastminute  && i!==0) {
                        if( (minute !== 0 || hour !==0) && minute % 2 === 0) {
                            tics.push({class:lefthand('HourTic'), pos: i, label: pad(hour,2)+':'+pad(minute,2)})
                        } else {
                            if (minute === 0 && hour === 0) {
                                tics.push({class:lefthand('DayTic_h'), pos: i, label: pad(day,2)})
                                tics.push({class:lefthand('MonthTic_h2'), pos: i, label: monthcode[month]})
                                //tics.push({class:'YearTic_h', pos: i, label: year})
                            }     
                        }
                    }
                break


                case _zoom < MIN10_LEVEL:
                    labeloffset = 60000*10
                    if(minute !== lastminute  && i!==0) {
                        if( (minute !== 0 || hour !==0) && minute % 10 === 0) {
                            tics.push({class:lefthand('HourTic'), pos: i, label: pad(hour,2)+':'+pad(minute,2)})
                        } else {
                            if (minute === 0 && hour === 0) {
                                tics.push({class:lefthand('DayTic_h'), pos: i, label: pad(day,2)})
                                tics.push({class:'MonthTic_h2', pos: i, label: monthcode[month]})
                                //tics.push({class:'YearTic_h', pos: i, label: year})
                            }     
                        }
                    }
                break

                case _zoom < MIN20_LEVEL:
                    labeloffset = 60000*20
                    if(minute !== lastminute && i!==0) {
                        if( (minute !== 0 || hour !==0) && minute % 20 === 0) {
                            tics.push({class:lefthand('HourTic'), pos: i, label: pad(hour,2)+':'+pad(minute,2)})
                        } else {
                            if (minute === 0 && hour === 0) {
                                tics.push({class:lefthand('DayTic_h'), pos: i, label: pad(day,2)})
                                tics.push({class:lefthand('MonthTic_h2'), pos: i, label: monthcode[month]})
                                //tics.push({class:'YearTic_h', pos: i, label: year})
                            }     
                        }
                    }
                break

                case _zoom < HOUR_LEVEL:
                    labeloffset = 60000*60
                    if(hour !== lasthour && i!==0) {
                        if (hour !== 0) {
                            tics.push({class:lefthand('HourTic'), pos: i, label: pad(hour,2)+':00'})
                        
                        } else  {
                            tics.push({class:lefthand('DayTic_h'), pos: i, label: pad(day,2)})
                            tics.push({class:lefthand('MonthTic_h2'), pos: i, label: monthcode[month]})
                            // tics.push({class:'YearTic_h', pos: i, label: year})            
                        }
                    }
                break

                case _zoom < HOUR3_LEVEL:
                    labeloffset = 60000*60*3
                    if(hour !== lasthour && i!==0) {
                        if (hour !== 0 &&  (hour % 3 === 0 )) {
                            tics.push({class:lefthand('HourTic'), pos: i, label: pad(hour,2)+':00'})
                        } else  {
                            if (hour === 0) {
                                tics.push({class:lefthand('DayTic_h'), pos: i, label: pad(day,2)})
                                tics.push({class:lefthand('MonthTic_h2'), pos: i, label: monthcode[month]})
                                // tics.push({class:'YearTic_h', pos: i, label: year})            
                            }
                        }
                    }    
                break

                case _zoom < HOUR6_LEVEL:
                    labeloffset = 60000*60*6
                    if(hour !== lasthour && i!==0) {
                        if (hour !== 0 &&  (hour % 6 === 0 )) {
                            tics.push({class:lefthand('HourTic'), pos: i, label: pad(hour,2)+':00'})
                        } else  {
                            if (hour === 0) {
                                tics.push({class:lefthand('DayTic_h'), pos: i, label: pad(day,2)})
                                tics.push({class:lefthand('MonthTic_h2'), pos: i, label: monthcode[month]})
                                // tics.push({class:'YearTic_h', pos: i, label: year})            
                            }
                        }
                    }    
                break



                case _zoom < DAY_HOUR_LEVEL:
                    labeloffset = 60000*60*24
                    if(day !== lastday && i!==0) {
                        tics.push({class:lefthand('DayTic_h'), pos: i, label: pad(day,2)})
                        tics.push({class:lefthand('MonthTic_h2'), pos: i, label: monthcode[month]})

                    }    
                break


                case _zoom < DAY_LEVEL:
                    labeloffset = 60000*60*24
                    if(day !== lastday && i!==0) {
                        if ( day !== 1 ) {
                            tics.push({class:lefthand('DayTic'), pos: i, label: day})
                        } else {
                            tics.push({class:lefthand('MonthTic_h'), pos: i, label: monthcode[month]})
                            if (month === 0) tics.push({class:lefthand('YearTic_h2'), pos: i, label: year})
                            // tics.push({class:'YearTic_h2', pos: i, label: year})
                         }
                        
                    }    
                break

                case _zoom < DAY5_LEVEL:
                    labeloffset = 60000*60*24*5
                    if(day !== lastday && i!==0) {
                        if ( day !== 1 && day !== 30 && day % 5 === 0 ) {
                            tics.push({class:lefthand('DayTic'), pos: i, label: day})
                        } else {
                            if (day === 1) {
                                // tics.push({class:'DayTic', pos: i, label: day})
                                tics.push({class:lefthand('MonthTic_h'), pos: i, label: monthcode[month]})
                                if (month === 0) tics.push({class:lefthand('YearTic_h2'), pos: i, label: year})
                                // tics.push({class:'YearTic_h2', pos: i, label: year})
                            }
                         }
                        
                    }    

                break

                case _zoom < MONTH_LEVEL:
                    labeloffset = 60000*60*24*28
                    if( month !== lastmonth  && i!==0) {
                        if (month !== 0) {
                            tics.push({class:lefthand('MonthTic'), pos: i, label: monthcode[month]})
                        } else {
                            tics.push({class:lefthand('MonthTic_h'), pos: i, label: monthcode[month]})
                            tics.push({class:lefthand('YearTic_h2'), pos: i, label: year})
                        }
                    }
    
                break

                case _zoom < MONTH4_LEVEL:
                    labeloffset = 60000*60*24*28*3
                    if( month !== lastmonth  && i!==0) {
                        if (month !== 0 && month !== 11 && (month) % 3 === 0 ) {
                            tics.push({class:lefthand('MonthTic'), pos: i, label: monthcode[month]})
                        } else {
                            if (month === 0) {
                                tics.push({class:lefthand('MonthTic_h'), pos: i, label: monthcode[month]})
                                tics.push({class:lefthand('YearTic_h2'), pos: i, label: year})
                            }
                        }
                    }
    
                break

                case _zoom < YEAR_LEVEL:
                    labeloffset = 60000*60*24*30*12
                    if(year !== lastyear  && i!==0) {
                        if (month !== 0) {
                            tics.push({class:lefthand('MonthTic'), pos: i, label: monthcode[month]})
                        } else {
                            // tics.push({class:'MonthTic', pos: i, label: month})
                            tics.push({class:lefthand('YearTic'), pos: i, label: year})
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
            // optimisation to skip a fontsize number of pixels
            if (tics.length !== lastticslength) {
                // console.log('off: '+labeloffset/_zoom+'   labeloffset: '+labeloffset)
                i+=labeloffset/_zoom - 4
            }
            lastticslength = tics.length
            // iteration +=1
        }
        if(_resulttics) {
            _resulttics.sort((a,b)=>b-a)
            let lastticpos = -10
            for ( let i=_resulttics.length ; i >= 0  ; i-=1 ) {
            // for ( let i=0 ; i < _resulttics.length  ; i+=1 ) {
            
                let ticpos = (_resulttics[i] - _start.getTime() ) / _zoom + scale.current.offsetHeight/2
                if(ticpos > 0 && ticpos < scale.current.offsetHeight) {
                    // tics.push({class:'ResultTic', pos: ticpos, label: ''})
                    // ctx.shadowColor = null
                    // ctx.shadowOffsetX = null
                    // ctx.shadowOffsetY = null
                    // ctx.shadowBlur = null
                    ctx.font = "30px Arial"
                    if(ticpos - lastticpos > 3) {
                        lastticpos = ticpos
                        ctx.fillText('.', leftHanded.current?0:scale.current.offsetWidth -8, ticpos +5);
                    }
            
                    

                }
            }
        
        }

    //   console.log('iterations: '+iteration)
        return tics.map(item => ( <div className={item.class} key={item.class+item.pos} style={{top:item.pos,opacity:1}}>{item.label}</div>))
    }


    // useEffect(() => {
    //     console.log('zoomfactor / date: '+zoomfactor + '/ ' + date)
    //     console.log(resulttics)
    //     izoom.current = zoomfactor
    //     idate.current = date
    //     itics.current = resulttics
    //     setTimescale(scaleText(idate.current,izoom.current,itics.current))
    // },[ zoomfactor,date,resulttics])

    useEffect(() => {
        // console.log(zoomfactor)
        izoom.current = zoomfactor
        setTimescale(scaleText(idate.current,izoom.current,itics.current))
    },[zoomfactor])

    useEffect(() => {
        // console.log(date)
        idate.current = date
        setTimescale(scaleText(idate.current,izoom.current,itics.current))
    },[date])

    useEffect(() => {
        leftHanded.current = lefthanded
        setTimescale(scaleText(idate.current,izoom.current,itics.current))
    },[lefthanded])

    useEffect(() => {
        // console.log(resulttics)
        itics.current = resulttics
        setTimescale(scaleText(idate.current,izoom.current,itics.current))
    },[resulttics])

    useEffect(() => {
        const handleResize =  (e) => {
            e.preventDefault()
            e.stopPropagation()
            // console.log('resize')
            setTimescale(scaleText(idate.current,izoom.current,itics.current))
        }
        window.addEventListener('resize', handleResize)
        return ()=>{window.removeEventListener('resize', handleResize)}
    },[])


    return (
        <div>
            <canvas ref={canvas} className='DateSelectorCanvas' width='{window.innerWidth}' height={window.innerHeight}></canvas>
            <div ref={scale} className='DateSelectorScale' id='DateSelectorScale' style={{fontSize:'14px'} }>
                {timescale}
            </div>
        </div>
    )
}
export default DateSelectorScale
