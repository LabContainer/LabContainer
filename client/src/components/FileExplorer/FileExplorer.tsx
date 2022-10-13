import React from "react";
import { FileManager, FileNavigator } from "@opuscapita/react-filemanager";
import connectorNodeV1 from "@opuscapita/react-filemanager-connector-node-v1";
import CircularIndeterminate from "../common/CircularInderminate";

interface IFileExplorerProps {
  server: string;
  addToDoubleQuickQueue: (s: { name: string; id: string }) => void;
}

function FileExplorer({ server, addToDoubleQuickQueue }: IFileExplorerProps) {
  const apiOptions = React.useMemo(
    () => ({
      ...connectorNodeV1.apiOptions,
      apiRoot: `${server}/filemanager`,
    }),
    [server]
  );
  // Bug : Filemanager only works if loaded for first time with correct server.
  // Rendering false ui unless server is ready
  // TODO : Need a proper test / Solution to render filemanager skeleton UI properly
  if (server.includes("undefined") || !server.includes("http")) {
    return (
      <div>
        <CircularIndeterminate />
        Waiting for file server
      </div>
    );
  }
  return (
    <div
      style={{
        // height: "70vh",
        // height: "100%",
        flexGrow: 1,
        //   minWidth: "320px",
        // maxWidth: "300px",
        flex: "1",
        //   marginBottom: "15px",
      }}
    >
      <FileManager>
        <FileNavigator
          api={connectorNodeV1.api}
          apiOptions={apiOptions}
          capabilities={(apiOptions: any, actions: any) => [
            ...connectorNodeV1.capabilities(apiOptions, actions),
            {
              id: "custom-button",
              icon: {
                svg: '<svg viewBox="0 0 120 120" version="1.1"><circle cx="60" cy="60" r="50"></circle></svg>',
              },
              label: "Custom Button",
              shouldBeAvailable: () => true,
              availableInContexts: ["toolbar"],
              handler: () => alert("Custom button click"),
            },
          ]}
          //   initialResourceId={_scope.state.nodeInitId}
          listViewLayout={connectorNodeV1.listViewLayout}
          viewLayoutOptions={connectorNodeV1.viewLayoutOptions}
          onResourceChange={(resource: any) =>
            console.log("onResourceChange", resource)
          }
          onResourceChildrenChange={(resourceChildren: any) =>
            console.log("onResourceChildrenChange", resourceChildren)
          }
          onResourceLocationChange={(resourceLocation: any) =>
            console.log("onResourceLocationChange", resourceLocation)
          }
          onSelectionChange={(selection: any) =>
            console.log("onSelectionChange", selection)
          }
          onResourceItemClick={(event: any, number: any, rowData: any) =>
            console.log("onResourceItemClick", event, number, rowData)
          }
          onResourceItemDoubleClick={(info: any) => {
            // console.log("onResourceItemDoubleClick", event, number, rowData);
            // open file
            const { rowData } = info;
            const { ancestors, name, type, size, id } = rowData;
            if (type !== "file") return;

            const path: string = ancestors
              .map((obj: any) => obj.name)
              .join("/");
            const file = (path + "/" + name) as string;
            console.log("File: ", file);
            if (size < 100000) {
              // less than 100KB (or close)
              // tell environment to download file then load it in editor
              addToDoubleQuickQueue({ name: file, id });
            }
          }}
          onResourceItemRightClick={(event: any, number: any, rowData: any) =>
            console.log("onResourceItemRightClick", event, number, rowData)
          }
        />
      </FileManager>
    </div>
    // {/* </div> */}
  );
}

export default FileExplorer;
