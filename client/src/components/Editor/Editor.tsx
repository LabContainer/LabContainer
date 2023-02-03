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
import { Box, Button, Container, Stack } from "@mui/material";
import "./Editor.css";
import ReactAce from "react-ace/lib/ace";
import AddIcon from "@mui/icons-material/Add";
import { Ace } from "ace-builds";
import FormDialogCreateFile from "../FormDialogCreateFile/FormDialogCreateFile";
import CircularIndeterminate from "../common/CircularInderminate";
import { Buffer } from "buffer";
import path from "path-browserify";
import { errorMessage, MessageContainer, successMessage } from "../App/message";
import axios from "axios";

interface IEditorProps {
  team: string;
  user: string;
  loadFile: {
    name: string;
    id: string;
  };
  server: string;
}

interface downloadMap {
  [name: string]: string;
}

interface IFile {
  tab: string;
  id: number;
  session: Ace.EditSession | undefined;
  mode: string;
}
interface IEditorState {
  fileList: IFile[];
  chosenFile: number;
  fileDialogOpen: boolean;
  editorDestroyed: boolean;
  downloading: boolean;
  downloads: downloadMap;
  downloadStarted: boolean;
  // cache for dir children ids
  dirChildren: { [id: string]: string[] };
}
class Editor extends React.Component<IEditorProps, IEditorState> {
  ref;
  static supportedLanguages = [
    {
      lang: "python",
      key: 1,
      ext: "py",
    },
    {
      lang: "javascript",
      key: 2,
      ext: "js",
    },
  ];

  constructor(props: any) {
    super(props);
    this.ref = React.createRef<ReactAce>();
    this.state = {
      fileList: [],
      chosenFile: -1,
      fileDialogOpen: false,
      editorDestroyed: false,
      downloading: false,
      downloads: {},
      downloadStarted: false,
      dirChildren: {},
    };
    this.addFile = this.addFile.bind(this);
    this.setChosenFile = this.setChosenFile.bind(this);
    this.closeAddFileDialog = this.closeAddFileDialog.bind(this);
    this.saveFile = this.saveFile.bind(this);
    this.findDirId = this.findDirId.bind(this);
    this.getDirChildren = this.getDirChildren.bind(this);
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
  // Update State on props update
  // Load Downloaded file
  static getDerivedStateFromProps(props: IEditorProps, state: IEditorState) {
    // check loadfile
    if (!(props.loadFile.name in state.downloads)) {
      if (props.loadFile.name !== "") {
        if (!state.downloading) {
          return { downloading: true };
        }
      } // else this.setState({ downloading: false });
      // loadfile changed
    }
    return null;
  }

  componentDidUpdate(
    prevProps: Readonly<IEditorProps>,
    prevState: Readonly<IEditorState>,
    snapshot?: any
  ): void {
    /**
     * Check if new loadFile given to editor component and start download if not started already
     * Sets downloading state to false on completion
     */
    if (this.state.downloading && !this.state.downloadStarted) {
      this.setState({ downloadStarted: true });
      Editor.downloadFile(
        this.props.server,
        this.props.loadFile.name,
        this.props.loadFile.id
      ).then((text) => {
        if (text === null) {
          // download failed
          this.setState({ downloading: false, downloadStarted: false });
          return null;
        }
        // download succeded
        const fileExt = this.props.loadFile.name.split(".").slice(-1)[0];
        const language = Editor.supportedLanguages.filter(
          (sl) => sl.ext === fileExt
        );
        let mode = "";
        if (language.length === 0) {
          errorMessage("Language not supported! Ext: " + fileExt);
        } else {
          mode = language[0].lang;
        }
        let downloads = this.state.downloads;
        downloads[this.props.loadFile.name] = text;
        this.setState({ downloads });
        this.addToFileList(this.props.loadFile.name, mode);
        this.setState({ downloading: false, downloadStarted: false });
      });
    }
    // Change Editor Context if another file chosen
    if (this.state.chosenFile !== prevState.chosenFile) {
      // File session did not exist, new session needed
      const file = this.state.fileList[this.state.chosenFile];
      // If invalid file do nothing
      if (!file) return;
      let new_session = this.state.fileList[this.state.chosenFile].session;

      if (this.ref.current && this.state.editorDestroyed) {
        // Editor was destoryed create new editor
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
      if (new_session) {
        this.ref.current?.editor.setSession(new_session);
        return;
      } else {
        console.log(`Creating Session. File ${file.tab} Mode: ${file.mode}`);
        file.session = this.createNewSession(file);
        this.ref.current?.editor.setSession(file.session);
      }
    }
  }
  /**
   * Create new Ace Editor Session for the selected file
   */
  createNewSession(file: IFile) {
    // Creating new session
    const fileContents = this.state.downloads[file.tab] || "";
    const session: Ace.EditSession = ace.createEditSession(
      fileContents,
      file.mode
    );
    // check if file was new or was downloaded
    session.setValue(fileContents);
    session.setMode(`ace/mode/${file.mode}`);
    session.setTabSize(2);
    session.setUseSoftTabs(true);
    return session;
  }
  /**
   * Closes add file dialog
   */
  closeAddFileDialog(
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ): void {
    this.setState({ fileDialogOpen: false });
  }
  /**
   * Opens a file dialog to add a new file
   */
  addFile(event: React.FormEvent<HTMLFormElement>): void {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const filename = data.get("filename") as string;
    const lang = data.get("langSelect") as string;
    this.addToFileList(filename, lang);
  }
  /**
   * Updates Editor fileList to have a new file. Filelist update causes render of file tabs
   * @param filename
   * @param lang
   * @param session
   */
  addToFileList(
    filename: string,
    lang: string,
    session: Ace.EditSession | undefined = undefined
  ) {
    const newFileList = this.state.fileList.concat({
      tab: filename,
      session,
      id: (this.state.fileList.slice(-1)[0]?.id || 0) + 1,
      mode: lang,
    });
    this.setState({ fileList: newFileList });
    if (newFileList.length === 1) {
      this.setState({ chosenFile: 0 });
    }
  }
  setChosenFile(chosen: number) {
    this.setState({ chosenFile: chosen });
  }
  /**
   * Downloads a file into the editor state
   * @param server
   * @param filename
   * @param id
   */
  static async downloadFile(server: string, file: string, id: string) {
    console.log("Downloading file", file);

    // Write the following code using Axios
    // return fetch(`${server}/filemanager/download?items=${id}`, {
    //   method: "GET",
    // }).then((resp) => {
    //   if (resp.ok) {
    //     return resp.text().then((text) => Buffer.from(text, "utf8").toString());
    //   }
    //   return null;
    // });

    const response = await axios.get(`${server}/filemanager/download?items=${id}`, {
      responseType: 'arraybuffer'
    });
    if (response.status === 200) {
      return Buffer.from(response.data, 'binary').toString();
    }
    return null;

  }
  /**
   * Recursive function to return the filemanager resource id of a directory
   * @param dir
   * @returns
   */
  async findDirId(dir: string) {
    // Initial ID
    let id = "";
    // Write the following code using Axios
    // const respoonse = await fetch(
    //   `${this.props.server}/filemanager/files/${id}`,
    //   {
    //     method: "GET",
    //   }
    // );
    // if (!respoonse.ok) {
    //   console.log("Failed to get directory: " + id);
    //   return null;
    // }
    // const root = await respoonse.json();

    const response = await axios.get(`${this.props.server}/filemanager/files/${id}`);
    if (response.status !== 200) {
      console.log("Failed to get directory: " + id);
      return null;
    }
    const root = response.data;

    if (root.type !== "dir") {
      // Need to search for dir
      return null;
    }
    id = root.id;
    // return root id
    if (dir === "/") return id;
    // recursive function
    const getId = async (
      server: string,
      id: string,
      directory: string
    ): Promise<string | null> => {
      const children = await this.getDirChildren(id);
      if (children === null) return null;
      for (const item of children.items) {
        if (item.type === "dir") {
          if (directory.startsWith("/" + item.name)) {
            if (directory !== "/" + item.name) {
              directory = directory.slice(item.name.length + 1);
              return getId(server, item.id, directory);
            } else return item.id;
          }
        }
      }
      return null;
    };
    return getId(this.props.server, id, dir);
  }

  async getDirChildren(id: string) {
    // Write the following code using Axios
    // const response_children = await fetch(
    //   `${this.props.server}/filemanager/files/${id}/children`,
    //   {
    //     method: "GET",
    //   }
    // );
    // if (!response_children.ok) {
    //   console.log("Failed to get directory children: " + id);
    //   return null;
    // }
    // return response_children.json();

    // cache resposne in editor state
    
    // cache hit
    // if (this.state.dirChildren[id]) {
    //   return this.state.dirChildren[id];
    // }
    const response_children = await axios.get(`${this.props.server}/filemanager/files/${id}/children`);
    if (response_children.status !== 200) {
      console.log("Failed to get directory children: " + id);
      return null;
    }
    // // save to cache
    // this.setState({
    //   dirChildren: {
    //     ...this.state.dirChildren,
    //     [id]: response_children.data
    //   }
    // });
    return response_children.data;
  }
  /**
   * Create New file on server
   */
  async createFile(filename: string, text: string, parent: string) {
    const data = new FormData();

    data.append("type", "file");
    data.append("parentId", parent);
    data.append(
      "files",
      new Blob([text], {
        type: `application/${
          filename.split(".").slice(1).slice(-1)[0] || "octet-stream"
        }`,
      }),
      filename
    );
    // Write the following code using Axios
    // return fetch(`${this.props.server}/filemanager/files`, {
    //   method: "POST",
    //   body: data,
    // }).then((resp) => {
    //   if (resp.ok) {
    //     successMessage("File saved");
    //   }
    // }).catch((err) => {
    //   errorMessage("Failed to save file");
    // });

    return axios.post(`${this.props.server}/filemanager/files`, data)
      .then((resp) => {
        if (resp.status === 200) {
          successMessage("File saved");
        }
      }).catch((err) => {
        errorMessage("Failed to save file");
      });
  }

  /**
   * Delete file on server
   * @param id
   */
  async deleteFile(id: string) {
    // Write the following code using Axios
    // const response = await fetch(
    //   `${this.props.server}/filemanager/files/${id}`,
    //   {
    //     method: "DELETE",
    //   }
    // );
    // if (response.ok) {
    //   console.log("File deleted");
    // }

    const response = await axios.delete(`${this.props.server}/filemanager/files/${id}`);
    if (response.status === 200) {
      console.log("File deleted");
    }
  }

  async saveFile() {
    const file = this.state.fileList[this.state.chosenFile];
    if (!file) return;
    const dir = path.dirname(file.tab);
    const filename = path.basename(file.tab);
    // Get Parent Directory
    const parent = await this.findDirId(dir);
    if (!parent) {
      console.log("Failed to find parent directory");
      return;
    }
    const session = this.ref.current?.editor.getSession();
    if (!session) return;
    const text = session.getValue();
    const children = await this.getDirChildren(parent);

    if (children === null) return;
    for (const child of children.items) {
      if (child.name === filename) {
        // File already exists
        // TODO : safe save - delete after creation of temp file
        await this.deleteFile(child.id);
        await this.createFile(filename, text, parent);
        return;
      }
    }
    
    // File does not exist
    await this.createFile(filename, text, parent);
  }
  render() {
    return (
      <Stack flex={1} direction="column" style={{ width: "100%" }}>
        <MessageContainer/>
        <Stack direction={"row"} style={{ width: "100%" }}>
          <ScrollTabs
            tabList={this.state.fileList}
            setChosen={this.setChosenFile}
          />
          <Box className="editor-toolbar">
            <FormDialogCreateFile
              open={this.state.fileDialogOpen}
              handleClose={this.closeAddFileDialog}
              handleSubmit={this.addFile}
              languages={Editor.supportedLanguages}
            />
            <Button
              variant="contained"
              color="primary"
              size="small"
              className="editor-toolbar-button"
              onClick={() => {
                this.setState({ fileDialogOpen: true });
              }}
            >
              <AddIcon />
            </Button>
            <Button
              variant="contained"
              component="label"
              size="small"
              className="editor-toolbar-button"
              onClick={this.saveFile}
            >
              Save
            </Button>
          </Box>
        </Stack>

        <Box flex={1} className="editor-container">
          {this.state.downloading ? (
            <Container>
              Loading File {this.props.loadFile.name} <CircularIndeterminate />
            </Container>
          ) : null}
          <AceEditor
            className="editor"
            style={{
              width: "100%",
              height: "100%",
              display: this.state.downloading ? "none" : "block",
            }}
            theme="github"
            name="aceeditor"
            ref={this.ref}
            onLoad={(editorInstance) => {
              // TODO: This was put here ti fix a bug, but currently not required. dont remove comment
              // editorInstance.resize();
              // editorInstance.container.style.resize = "both";
              // mouseup = css resize end
              document.addEventListener("mouseup", (e) => {
                // editorInstance.resize();
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
