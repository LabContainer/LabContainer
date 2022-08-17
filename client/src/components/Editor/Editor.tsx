import React from "react";
import AceEditor from 'react-ace'

import 'ace-builds/src-noconflict/mode-python'
import 'ace-builds/src-noconflict/theme-solarized_light'
import 'ace-builds/src-noconflict/ext-language_tools'
import 'ace-builds/src-noconflict/snippets/python'
import './Editor.css'
import { Box } from "@mui/material";
import './Editor.css'
import ReactAce from "react-ace/lib/ace";

function onChange(newVal : string){
    console.log("change", newVal)
}


class Editor extends React.Component {
  ref;

  constructor(props : any) {
    super(props);
    this.ref = React.createRef<ReactAce>()
    this.ref.current?.editor.getSession()
  }
  render() {
    return <Box flex={1}>
        <AceEditor
          className="editor"
          width="100%"
          placeholder="Placeholder Text"
          mode="python"
          theme="github"
          name="aceeditor"
          ref={this.ref}
          onLoad={editorInstance => {
            editorInstance.resize()
            editorInstance.container.style.resize = "both";
            // mouseup = css resize end
            document.addEventListener("mouseup", e => {
              editorInstance.resize()
            });
          }}
          onChange={onChange}
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
        />
    </Box>
  }
}

export default Editor