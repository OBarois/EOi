import React from 'react';
import dateFormat from "dateformat"
import './DateLabelCard.css';

function DateLabel({date, highlight, handleLabelClick}) {

    return (
        <div className='LabelContainer' >
            <span className={highlight ==='year'?'Highlighted':'NotHighlighted'} onClick={()=>handleLabelClick('year')}>{date.getUTCFullYear()}</span>-
            <span className={highlight ==='month'?'Highlighted':'NotHighlighted'} onClick={()=>handleLabelClick('month')}>{dateFormat(date,'UTC:mmm').toUpperCase()}</span>-
            <span className={highlight ==='day'?'Highlighted':'NotHighlighted'} onClick={()=>handleLabelClick('day')}>{dateFormat(date,'UTC:dd')}</span>
            <span>&nbsp;&nbsp;&nbsp;</span> 
            <span className={highlight ==='hour'?'Highlighted':'NotHighlighted'} onClick={()=>handleLabelClick('hour')}>{dateFormat(date,'UTC:HH')}</span>:
            <span className={highlight ==='minute'?'Highlighted':'NotHighlighted'} onClick={()=>handleLabelClick('minute')}>{dateFormat(date,'UTC:MM')}</span>:
            <span className={highlight ==='second'?'Highlighted':'NotHighlighted'} onClick={()=>handleLabelClick('second')}>{dateFormat(date,'UTC:ss')}</span>  
            <span>&nbsp;&nbsp;</span> 
        </div>
    )
}
export default DateLabel
