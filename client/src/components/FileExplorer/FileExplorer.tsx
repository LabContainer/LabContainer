import React from "react";
import { FileManager, FileNavigator } from "@opuscapita/react-filemanager";
import connectorNodeV1 from "@opuscapita/react-filemanager-connector-node-v1";
import CircularIndeterminate from "../common/CircularInderminate";

import "./FileExplorer.css";

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
  return (
    <div className="file-explorer-container">
      <FileManager>
        <FileNavigator
          api={connectorNodeV1.api}
          apiOptions={apiOptions}
          capabilities={(apiOptions: any, actions: any) => [
            ...connectorNodeV1.capabilities(apiOptions, actions),
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
  );
}

export default FileExplorer;
