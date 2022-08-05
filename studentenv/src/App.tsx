import React from 'react';
import logo from './logo.svg';
import './App.css';
import Editor from './editor/editor';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>
          Code Capture
        </h1>
        <Editor></Editor>
      </header>
    </div>
  );
}

export default App;
