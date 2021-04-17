import React from 'react';
import dateFormat from "dateformat"
import './DateLabelCard.css';

function DateLabel({date, highlight, animated}) {


    return (
        <div className='LabelContainer' >
            <div className='Date'>
                <div className={highlight!=='day' || highlight==='none'?'DayLabel':'DayLabel Highlighted'}  key='day'  >{dateFormat(date,'UTC:dd')}</div>
                <div className='YearMonth'>
                    <div className={highlight!=='month' || highlight==='none'?'MonthLabel ':'MonthLabel  Highlighted'}  key='month' >{dateFormat(date,'UTC:mmm').toUpperCase()}</div>
                    <div className={highlight!=='year' || highlight==='none'?'YearLabel ':'YearLabel Highlighted'}  key='year' >{date.getUTCFullYear()}</div>
                </div>
            </div>
            <div className={animated?'Line  Line-active':'Line'} key='line' ></div>
            <div className='TimeLabel'>
                <div className={highlight!=='hour' || highlight==='none'?'HourLabel ':'HourLabel Highlighted'} key='hour' >{dateFormat(date,'UTC:HH')} </div>
                <div className='hourseparator'>:</div>
                <div className='minseparator'>:</div>
                <div className={highlight!=='minute' || highlight==='none'?'MinuteLabel ':'MinuteLabel Highlighted'} key='minute' >{dateFormat(date,'UTC:MM')}</div>
                <div className={highlight!=='second' || highlight==='none'?'SecondLabel ':'SecondLabel Highlighted'} key='second' >{dateFormat(date,'UTC:ss')}</div>
            </div>
        </div>
    )
}
export default DateLabel
