import React from 'react';
import './App.css';

import Editor from './editor/editor';
import Term from './terminal/terminal';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Lab Capture</h1>
        <Editor></Editor>
        <Term></Term>
      </header>
    </div>
  );
}

export default App;
