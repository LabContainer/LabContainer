import React from 'react';
import './App.css';

import Editor from './editor/editor';
import Term from './terminal/terminal';
import NavBar from './navbar/navbar';

function App() {
  return (
    <div className="App">
      <NavBar />
      <div className='flexbox-container'>
        <Editor></Editor>
        <Term></Term>
      </div>
    </div>
  );
}

export default App;
