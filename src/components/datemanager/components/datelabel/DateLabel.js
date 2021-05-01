import React from 'react';
import dateFormat from "dateformat"
import './DateLabelCard.css';

function DateLabel({date, highlight, animated}) {

    return (
        <div className='LabelContainer' >
            <hi className={highlight ==='year'?'Highlighted':''}>{date.getUTCFullYear()}</hi>-
            <hi className={highlight ==='month'?'Highlighted':''}>{dateFormat(date,'UTC:mmm').toUpperCase()}</hi>-
            <hi className={highlight ==='day'?'Highlighted':''}>{dateFormat(date,'UTC:dd')}</hi>&nbsp;/&nbsp;
            <hi className={highlight ==='hour'?'Highlighted':''}>{dateFormat(date,'UTC:HH')}</hi>:
            <hi className={highlight ==='minute'?'Highlighted':''}>{dateFormat(date,'UTC:MM')}</hi>:
            <hi className={highlight ==='second'?'Highlighted':''}>{dateFormat(date,'UTC:ss')}</hi>  
        </div>
    )
}
export default DateLabel
