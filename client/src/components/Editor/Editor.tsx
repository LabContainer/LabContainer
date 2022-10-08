import React from "react";
import AceEditor from "react-ace";
import ScrollTabs from "../ScrollTabs/ScrollTabs";

import * as ace from "ace-builds/src-noconflict/ace";
import "ace-builds/src-noconflict/mode-python";
import "ace-builds/src-noconflict/mode-javascript";
import "ace-builds/src-noconflict/theme-solarized_light";
import "ace-builds/src-noconflict/ext-language_tools";
import "ace-builds/src-noconflict/snippets/python";
import "ace-builds/webpack-resolver";
import "ace-builds/src-noconflict/ext-beautify";
import "./Editor.css";
import { Box, Button, Stack } from "@mui/material";
import "./Editor.css";
import ReactAce from "react-ace/lib/ace";
import AddIcon from "@mui/icons-material/Add";
import { Ace } from "ace-builds";
import FormDialogCreateFile from "../FormDialogCreateFile/FormDialogCreateFile";

interface IProps {
  team: string;
  user: string;
}

interface IState {
  fileList: {
    tab: string;
    id: number;
    session: Ace.EditSession | undefined;
    mode: string;
  }[];
  chosenFile: number;
  fileDialogOpen: boolean;
  editorDestroyed: boolean;
}
class Editor extends React.Component<IProps, IState> {
  ref;

  constructor(props: any) {
    super(props);
    this.ref = React.createRef<ReactAce>();
    this.state = {
      fileList: [],
      // TODO: To set initial file, could be loaded from props for lab session
      // [{
      //   tab: "file 1",
      //   session: this.ref.current?.editor.getSession(),
      //   id: 1,
      //   mode: "python"
      // }]
      chosenFile: 0,
      fileDialogOpen: false,
      editorDestroyed: false,
    };
    this.addFile = this.addFile.bind(this);
    this.setChosenFile = this.setChosenFile.bind(this);
    this.closeAddFileDialog = this.closeAddFileDialog.bind(this);
  }
  componentDidMount(): void {
    this.setState((state) => {
      const newState = { ...state };
      // newState.fileList[0].session = this.ref.current?.editor.getSession();
      this.ref.current?.editor.destroy();
      newState.editorDestroyed = true;
      return newState;
    });
  }
  componentDidUpdate(
    prevProps: Readonly<{}>,
    prevState: Readonly<{}>,
    snapshot?: any
  ): void {
    // Editor to load chosen file
    const new_session = this.state.fileList[this.state.chosenFile]?.session;
    if (new_session) {
      this.ref.current?.editor.setSession(new_session);
      return;
    }
    const file = this.state.fileList[this.state.chosenFile];
    // If invalid file do nothing
    if (!file) return;
    console.log(`Creating Session. File ${file.tab} Mode: ${file.mode}`);
    if (this.ref.current && this.state.editorDestroyed) {
      this.ref.current.editor = ace.edit("aceeditor");
      this.ref.current.editor.setOptions({
        enableBasicAutocompletion: true,
        enableLiveAutocompletion: true,
        enableSnippets: true,
        showLineNumbers: true,
        tabSize: 2,
        useSoftTabs: true,
      });
      this.setState({ editorDestroyed: false });
    }

    const session: Ace.EditSession = ace.createEditSession(
      `File ${file.tab}`,
      file.mode
    );
    const updatedFileList = this.state.fileList.map((file, index) => {
      if (index !== this.state.chosenFile) return file;
      file.session = session;
      return file;
    });
    this.setState({
      fileList: updatedFileList,
    });
    this.ref.current?.editor.setSession(session);
    session.setValue("");
    session.setMode(`ace/mode/${file.mode}`);
    session.setTabSize(2);
    session.setUseSoftTabs(true);
    // Set file list
    console.log("switched to session, react state updated");
  }
  closeAddFileDialog(
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ): void {
    console.log("Closing");
    console.log(event.currentTarget.value);
    this.setState({ fileDialogOpen: false });
  }
  addFile(event: React.FormEvent<HTMLFormElement>): void {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const filename = data.get("filename") as string;
    const lang = data.get("langSelect") as string;
    const newFileList = this.state.fileList.concat({
      tab: filename,
      session: undefined,
      id: (this.state.fileList.slice(-1)[0]?.id || 0) + 1,
      mode: lang,
    });
    this.setState({ fileList: newFileList });
  }
  setChosenFile(chosen: number) {
    this.setState({ chosenFile: chosen });
  }
  render() {
    return (
      <Stack flex={1} direction="column">
        <Stack direction={"row"}>
          <ScrollTabs
            tabList={this.state.fileList}
            setChosen={this.setChosenFile}
          />
          <Box
            sx={{
              backgroundColor: "#f1f1f1",
              display: "flex",
              width: "fit-content",
              flexDirection: "row",
            }}
          >
            <FormDialogCreateFile
              open={this.state.fileDialogOpen}
              handleClose={this.closeAddFileDialog}
              handleSubmit={this.addFile}
              languages={[
                {
                  lang: "python",
                  key: 1,
                },
                {
                  lang: "javascript",
                  key: 2,
                },
              ]}
            />
            <Button
              variant="contained"
              color="primary"
              size="small"
              sx={{
                margin: "8px",
              }}
              onClick={() => {
                this.setState({ fileDialogOpen: true });
              }}
            >
              <AddIcon></AddIcon>
            </Button>
            <Button
              variant="contained"
              component="label"
              size="small"
              sx={{
                margin: "8px",
              }}
            >
              Upload
              <input hidden accept="image/*" multiple type="file" />
            </Button>
          </Box>
        </Stack>
        <Box flex={1}>
          <AceEditor
            className="editor"
            style={{
              width: "100%",
              height: "100%",
            }}
            theme="github"
            name="aceeditor"
            ref={this.ref}
            onLoad={(editorInstance) => {
              editorInstance.resize();
              editorInstance.container.style.resize = "both";
              // mouseup = css resize end
              document.addEventListener("mouseup", (e) => {
                editorInstance.resize();
              });
            }}
            showPrintMargin={true}
            showGutter={true}
            highlightActiveLine={true}
            setOptions={{
              enableBasicAutocompletion: true,
              enableLiveAutocompletion: true,
              enableSnippets: true,
              showLineNumbers: true,
              tabSize: 2,
            }}
          />
        </Box>
      </Stack>
    );
  }
}

export default Editor;
