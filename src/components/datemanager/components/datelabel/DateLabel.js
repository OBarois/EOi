import React from 'react';
import dateFormat from "dateformat"
import './DateLabelCard.css';

function DateLabel({date, highlight, animated}) {

    return (
        <div className='LabelContainer' >
            <span className={highlight ==='year'?'Highlighted':''}>{date.getUTCFullYear()}</span>-
            <span className={highlight ==='month'?'Highlighted':''}>{dateFormat(date,'UTC:mmm').toUpperCase()}</span>-
            <span className={highlight ==='day'?'Highlighted':''}>{dateFormat(date,'UTC:dd')}</span><span>&nbsp;{animated?'🥵':'🙂'}&nbsp;</span>
            <span className={highlight ==='hour'?'Highlighted':''}>{dateFormat(date,'UTC:HH')}</span>:
            <span className={highlight ==='minute'?'Highlighted':''}>{dateFormat(date,'UTC:MM')}</span>:
            <span className={highlight ==='second'?'Highlighted':''}>{dateFormat(date,'UTC:ss')}</span>  
        </div>
    )
}
export default DateLabel
