import React  from 'react';
import {AppContext} from '../app/context'
import { useKey } from 'rooks'


import './Mood.css' 
import { useEffect, useState } from 'react';

function Mood() {

    // const [altitude, ] = useGlobal('altitude')
    const [ state, dispatch  ] = React.useContext(AppContext)


    const [mood, setmood] =  useState('🙂')
    const [defmood, setdefmood] =  useState('🙂')

    // useKey(['l'],()=>{
    //     dispatch({type:'toggle_lefthanded'})
    // })

    useKey(['l'],(e) => {console.log('l:  '+e.target.tagName);if(e.target.tagName === 'BODY') dispatch({type:'toggle_lefthanded'})})


    useEffect(() => {
        setdefmood(state.animated?'🥵':'🙂')
        setmood(state.animated?'🥵':'🙂')
    }, [state.animated]);

    useEffect(() => {
        // console.log('searching...')
        // console.log('searching: '+state.searching)
        setmood(state.searching?'🧐':defmood)
    }, [state.searching]);


    return (
        <div className='Mood'>
            <div className='offset'>{mood}</div>
        </div>
     )
}

export default Mood;
