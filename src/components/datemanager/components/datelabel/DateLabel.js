import React from 'react';
import dateFormat from "dateformat"
import './DateLabelCard.css';

function DateLabel({date, highlight, animated,searching}) {

    return (
        <div className='LabelContainer' >
            <span className={highlight ==='year'?'Highlighted':'NotHighlighted'}>{date.getUTCFullYear()}</span>-
            <span className={highlight ==='month'?'Highlighted':'NotHighlighted'}>{dateFormat(date,'UTC:mmm').toUpperCase()}</span>-
            <span className={highlight ==='day'?'Highlighted':'NotHighlighted'}>{dateFormat(date,'UTC:dd')}</span>
            <span>&nbsp;&nbsp;&nbsp;</span> 
            <span className={highlight ==='hour'?'Highlighted':'NotHighlighted'}>{dateFormat(date,'UTC:HH')}</span>:
            <span className={highlight ==='minute'?'Highlighted':'NotHighlighted'}>{dateFormat(date,'UTC:MM')}</span>:
            <span className={highlight ==='second'?'Highlighted':'NotHighlighted'}>{dateFormat(date,'UTC:ss')}</span>  
            <span>&nbsp;&nbsp;</span> 
        </div>
    )
}
export default DateLabel
