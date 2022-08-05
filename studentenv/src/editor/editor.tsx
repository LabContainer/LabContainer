import React from "react";
import AceEditor from 'react-ace'

import 'ace-builds/src-noconflict/mode-python'
import 'ace-builds/src-noconflict/theme-github'
import 'ace-builds/src-noconflict/ext-language_tools'

function onChange(newVal : string){
    console.log("change", newVal)
}

function Editor() {
    return <>
        <AceEditor
            mode="python"
            theme="github"
            onChange={onChange}
            name="UNIQUE_ID_OF_DIV"
            editorProps={{ $blockScrolling: true }}
          />
    </>
}

export default Editor