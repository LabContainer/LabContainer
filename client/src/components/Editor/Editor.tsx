import React from "react";
import AceEditor from 'react-ace'

import 'ace-builds/src-noconflict/mode-python'
import 'ace-builds/src-noconflict/theme-solarized_light'
import 'ace-builds/src-noconflict/ext-language_tools'
import 'ace-builds/src-noconflict/snippets/python'
import './Editor.css'
import { Box } from "@mui/material";

function onChange(newVal : string){
    console.log("change", newVal)
}

function onLoad(test : any){
    console.log(test)
}


function Editor() {
    return <Box sx={{
    }} flex={1}>
        <AceEditor
          className="editor"
          placeholder="Placeholder Text"
          mode="python"
          theme="solarized_light"
          name="blah2"
          onLoad={onLoad}
          onChange={onChange}
          fontSize={20}
          showPrintMargin={true}
          showGutter={true}
          highlightActiveLine={true}
          value={``}
          setOptions={{
            enableBasicAutocompletion: true,
            enableLiveAutocompletion: true,
            enableSnippets: true,
            showLineNumbers: true,
            tabSize: 2,
          }}
          height="100%"
          width="100%"
        />
    </Box>
}

export default Editor