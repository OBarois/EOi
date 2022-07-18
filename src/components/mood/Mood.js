import React  from 'react';
import {AppContext} from '../app/context'

import './Mood.css' 
import { useEffect, useState } from 'react';

function Mood() {

    // const [altitude, ] = useGlobal('altitude')
    const [ state,  ] = React.useContext(AppContext)


    const [mood, setmood] =  useState('🙂')
    const [defmood, setdefmood] =  useState('🙂')


    useEffect(() => {
        setdefmood(state.animated?'🥵':'🙂')
        setmood(state.animated?'🥵':'🙂')
    }, [state.animated]);

    useEffect(() => {
        console.log('searching...')
        console.log('searching: '+state.searching)
        setmood(state.searching?'🧐':defmood)
    }, [state.searching]);


    return (
        <div className='Mood'>
            <div className='offset'>{mood}</div>
        </div>
     )
}

export default Mood;
