import React from "react";

import Editor from '../../components/Editor/Editor';
import Term from '../../components/Terminal/Terminal';

import './Environment.css'

export default function Environment(){
    return <>
        <div className='flexbox-container'>
            <Editor></Editor>
            <Term></Term>
        </div>
    </>
}