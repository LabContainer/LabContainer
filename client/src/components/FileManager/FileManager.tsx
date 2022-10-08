import React from "react";
// import { FileManager } from "@syncfusion/ej2-react-filemanager";
import { FileManager, FileNavigator } from "@opuscapita/react-filemanager";
import connectorNodeV1 from "@opuscapita/react-filemanager-connector-node-v1";
import CircularIndeterminate from "../common/CircularInderminate";

function FileManagerFront({ server }: { server: string }) {
  //   React.useEffect(() => {
  //     let feObj: FileManager = new FileManager();
  //     feObj.appendTo("#file");
  //   }, []);
  //   return <div id="file"></div>;
  // const apiOptions = {
  //   ...connectorNodeV1.apiOptions,
  //   // apiRoot: `${server}/filemanager`, // Or you local Server Node V1 installation.
  //   apiRoot: `${server}/filemanager`, // Or you local Server Node V1 installation.
  // };
  const apiOptions = React.useMemo(
    () => ({
      ...connectorNodeV1.apiOptions,
      // apiRoot: `${server}/filemanager`, // Or you local Server Node V1 installation.
      apiRoot: `${server}/filemanager`, // Or you local Server Node V1 installation
    }),
    [server]
  );
  console.log(server);
  console.log(apiOptions);
  if (server.includes("undefined") || !server.includes("http")) {
    return (
      <div>
        <CircularIndeterminate />
        Waiting for file server
      </div>
    );
  }
  return (
    // <div style={{ height: "480px" }}>
    //   <FileManager>
    //     <FileNavigator
    //       id="filemanager-1"
    //       api={connectorNodeV1.api}
    //       apiOptions={apiOptions}
    //       capabilities={connectorNodeV1.capabilities}
    //       listViewLayout={connectorNodeV1.listViewLayout}
    //       viewLayoutOptions={connectorNodeV1.viewLayoutOptions}
    //     />
    //   </FileManager>
    // </div>
    // <div>
    // {/*NODE_JS_EXAMPLE*/}

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
          onResourceItemDoubleClick={(event: any, number: any, rowData: any) =>
            console.log("onResourceItemDoubleClick", event, number, rowData)
          }
          onResourceItemRightClick={(event: any, number: any, rowData: any) =>
            console.log("onResourceItemRightClick", event, number, rowData)
          }
        />
      </FileManager>
    </div>
    // {/* </div> */}
  );
}

export default FileManagerFront;
