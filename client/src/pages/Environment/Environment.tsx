import React from "react";
import CircularIndeterminate from "../../components/common/CircularInderminate";

import "./Environment.css";
import "../../components/Editor/Editor.css";

import Editor from "../../components/Editor/Editor";
import { useParams } from "react-router-dom";
import FileExplorer from "../../components/FileExplorer/FileExplorer";
import Term from "../../components/Terminal/Terminal";
import useAPI from "../../api";
import { Lab, LabCreate, Milestone, MilestoneCreate } from "../../clients/AnalyticsClient";
import { CancelablePromise } from "../../clients/AuthClient";
import LabInfo from "./LabInfo";
import ProgressTrack from "./ProgressTrack";
import Feedback from "../../components/Feedback/Feedback";
import Panel from "./Panel";
import { errorMessage, MessageContainer, successMessage } from "../../components/App/message";

// server status enum
enum ServerStatus {
  Available,
  Unavailable,
}

// const sleep = (ms:  number) => new Promise( resolve => setTimeout(resolve, ms))
export default function Environment() {
  const { user, team } = useParams();
  const [server, setServer] = React.useState("");
  const [loadFile, setLoadFile] = React.useState({
    name: "",
    id: "",
  });
  const { EnvironmentApi, TeamsApi, LabsApi, MilestonesApi } = useAPI();
  const [serverStatus, setServerStatus] = React.useState(
    ServerStatus.Unavailable
  );
  const [childKey, setChildKey] = React.useState(1);
  //Fetch Server
  React.useEffect(() => {
    if (!team || !user) return;
    const envPromise = EnvironmentApi.environmentGetEnvironment(team, user);

    envPromise.then((env) => {
      // console.log("Received Environment from analytics service: ", env);
      setServer(env.url);
    });

    return () => {
      envPromise.cancel();
    };
  }, [setServer, team, user]);
  React.useEffect(() => {
    if (serverStatus === ServerStatus.Available) {
      setChildKey((prev: number) => prev + 1);
    }
  }, [serverStatus]);
  React.useEffect(() => {
    // abort signal
    const controller = new AbortController();
    const timer = setInterval(() => {
      if (server) {
        // fetch /health endpoint
        fetch(server + "/health", {
          method: "GET",
          signal: controller.signal,
        }).then((r) => {
          if (r.status === 200) {
            setServerStatus(ServerStatus.Available);
          } else {
            setServerStatus(ServerStatus.Unavailable);
          }
        });
      }
    }, 4000);

    return () => {
      // cleanup
      clearTimeout(timer);
      controller.abort();
    };
  }, [server]);

  // Report user presence to backend
  React.useEffect(() => {
    if (!team || !user) return;
    const reportingTimer = setInterval(() => {
      const presencePromise = EnvironmentApi.environmentReportActiveEnvironment(
        team,
        user
      );
      presencePromise.then((r) => {
        // console.log("Reported presence to analytics service: ", r);
      });
    }, 60000);
    return () => {
      clearInterval(reportingTimer);
    };
  }, [team, user]);

  // fetch Lab, Milestone information
  const [lab, setLab] = React.useState<Lab>();
  const [milestones, setMilestones] = React.useState<Milestone[]>([]);
  const [currentMilestone, setCurrentMilestone] = React.useState<Milestone>();
  React.useEffect(() => {
    if (!team || !user) return;
    const teamsPromise = TeamsApi.teamsGetTeam(team);
    let labPromise : CancelablePromise<LabCreate>;
    let milestonePromise : CancelablePromise<Milestone[]>;
    teamsPromise.then((t) => {
      //@ts-ignore
      labPromise = LabsApi.labsGetLab(t.lab_id)
      return labPromise.then((l) => {
        setLab({ ...l, ...{ id: t.lab_id } });
        //@ts-ignore
        milestonePromise = MilestonesApi.milestonesGetMilestones(t.lab_id)
        milestonePromise.then(m => {
          setMilestones(m);
          if(t.current_milestone)
            setCurrentMilestone(m.find(m => m.milestone_id === t.current_milestone))

        });
      });
    });
    return () => {
      teamsPromise.cancel();
      if(labPromise && !labPromise.isCancelled) 
        labPromise.cancel();
      if(milestonePromise && !milestonePromise.isCancelled)
        milestonePromise.cancel();
    };
  }, [team, user]);

  // States for resizing
  const [leftPaneWidth, setLeftPaneWidth] = React.useState(300);
  const [rightPaneWidth, setRightPaneWidth] = React.useState(300);
  const [editorHeight, setEditorHeight] = React.useState(300);
  const [labSectionHeight, setLabSectionHeight] = React.useState(300);
  const [progressTrackHeight, setProgressTrackHeight] = React.useState(300);
  const editorMinHeight = 45;
  const editorMaxHeight = 700;
  const filemanagerMinWidth = 270;
  const filemanagerMaxWidth = 800;
  const rightPaneMinWidth = 40;
  const rightPaneMaxWidth = 500;

  const labMinHeight = 100;
  const labMaxHeight = 700;
  const progressTrackMinHeight = 100;
  const progressTrackMaxHeight = 700;

  const leftPanelRef = React.useRef<HTMLDivElement | null>(null);
  const rightPanelRef = React.useRef<HTMLDivElement | null>(null);
  const editorRef = React.useRef<HTMLDivElement | null>(null);
  const labRef = React.useRef<HTMLDivElement | null>(null);
  const progressTrackRef = React.useRef<HTMLDivElement | null>(null);
  const [isResizingLeftPanel, setIsResizingLeftPanel] = React.useState(false);
  const [isResizingRightPanel, setIsResizingRightPanel] = React.useState(false);
  const [isResizingEditor, setIsResizingEditor] = React.useState(false);
  const [isResizingLabSection, setIsResizingLabSection] = React.useState(false);
  const [isResizingProgressTracking, setIsResizingProgressTracking] =
    React.useState(false);

  const startResizingLeftPanel = React.useCallback((mouseDownEvent) => {
    setIsResizingLeftPanel(true);
  }, []);
  const startResizingRightPanel = React.useCallback((mouseDownEvent) => {
    setIsResizingRightPanel(true);
  }, []);
  const startResizingEditor = React.useCallback((mouseDownEvent) => {
    setIsResizingEditor(true);
  }, []);
  const startResizingLabSection = React.useCallback((mouseDownEvent) => {
    setIsResizingLabSection(true);
  }, []);
  const startResizingProgressTracking = React.useCallback((mouseDownEvent) => {
    setIsResizingProgressTracking(true);
  }, []);

  const stopResizing = React.useCallback(() => {
    setIsResizingLeftPanel(false);
    setIsResizingRightPanel(false);
    setIsResizingEditor(false);
    setIsResizingLabSection(false);
    setIsResizingProgressTracking(false);
  }, []);

  const resize = React.useCallback(
    (mouseMoveEvent) => {
      const val =
        mouseMoveEvent.clientX -
        (leftPanelRef.current?.getBoundingClientRect().left || 0);
      if (isResizingLeftPanel) {
        if (val > filemanagerMinWidth && val < filemanagerMaxWidth)
          setLeftPaneWidth(val);
      }
      if (isResizingRightPanel) {
        const val =
          (rightPanelRef.current?.getBoundingClientRect().right || 0) -
          mouseMoveEvent.clientX;
        if (val > rightPaneMinWidth && val < rightPaneMaxWidth)
          setRightPaneWidth(val);
      }
      if (isResizingEditor) {
        const val =
          mouseMoveEvent.clientY -
          (editorRef.current?.getBoundingClientRect().top || 0);
        if (val > editorMinHeight && val < editorMaxHeight)
          setEditorHeight(val);
      }
      if (isResizingLabSection) {
        const val =
          mouseMoveEvent.clientY -
          (labRef.current?.getBoundingClientRect().top || 0);
        if (val > labMinHeight && val < labMaxHeight) setLabSectionHeight(val);
      }
      if (isResizingProgressTracking) {
        const val =
          mouseMoveEvent.clientY -
          (progressTrackRef.current?.getBoundingClientRect().top || 0);
        if (val > progressTrackMinHeight && val < progressTrackMaxHeight)
          setProgressTrackHeight(val);
      }
    },
    [
      isResizingLeftPanel,
      isResizingRightPanel,
      isResizingEditor,
      isResizingLabSection,
      isResizingProgressTracking,
    ]
  );

  React.useEffect(() => {
    window.addEventListener("mousemove", resize);
    window.addEventListener("mouseup", stopResizing);
    return () => {
      window.removeEventListener("mousemove", resize);
      window.removeEventListener("mouseup", stopResizing);
    };
  }, [resize, stopResizing]);
  // false ui if invalid team or user
  if (!team || !user) {
    return (
      <div
        style={{
          position: "relative",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
        }}
      >
        <h1>Invalid Team or User</h1>
      </div>
    );
  }
  return (
    <div
      className="environment-container"
      style={{
        height: "100%",
      }}
    >
      <MessageContainer/>
      <div className="flexbox-container">
        <div
          ref={leftPanelRef}
          className="sidebar"
          style={{
            width: leftPaneWidth,
            minWidth: filemanagerMinWidth + "px",
          }}
        >
          <FileExplorer
            server={server}
            addToDoubleQuickQueue={setLoadFile}
            key={childKey}
          />
        </div>
        <div
          className="x-resizer end"
          onMouseDown={startResizingLeftPanel}
        ></div>
      </div>
      <div
        className="central-container"
        style={{
          left: leftPaneWidth,
          // width: `calc(100% - ${leftPaneWidth + rightPaneWidth + 20}px)`,
          width: '76.5%',
        }}
      >
        <div
          ref={editorRef}
          className="editor-resizer"
          style={{
            height: editorHeight,
            width: "100%",
            display: "flex",
          }}
        >
          {serverStatus === ServerStatus.Unavailable ? (
            <div className="editor-container">
              {/* center div */}
              <div
                style={{
                  position: "relative",
                  top: "50%",
                  // left: "50%",
                  textAlign: "center",
                }}
              >
                <h2>Loading Environment, please wait...</h2>
                <div
                  style={{
                    position: "relative",
                    left: "50%",
                  }}
                >
                  <CircularIndeterminate />
                </div>
              </div>
            </div>
          ) : (
            <Editor
              team={team}
              user={user}
              loadFile={loadFile}
              server={server}
            ></Editor>
          )}
        </div>
        <div className="y-resizer end" onMouseDown={startResizingEditor}></div>
        <div
          className="terminal-resizer"
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            backgroundColor: "#151942",
            height: `calc(100% - ${editorHeight + 8}px)`,
            width: "100%",
            minHeight: "100px",
          }}
        >
          <Term 
            team={team}
            user={user} 
            server={server} 
            test={currentMilestone?.milestone_id || ""} 
            onTestFail={ (m_id) => {
              errorMessage("Test Failed Please try again");
            }} 
            onTestPass={
              (m_id) => {
                successMessage("Test Passed");
                TeamsApi.teamsNextMilestone(team).then((current_milestone) => {
                    if(current_milestone.response){
                      MilestonesApi.milestonesGetMilestone(current_milestone.response).then((res) => {
                        setCurrentMilestone(res);
                      });
                    }
                }).catch((err) => {
                  // if 404 then no more milestones
                  if(err.status === 404){
                    successMessage("Congratulations you have completed all milestones");
                  }
                  else console.log(err);
                });
              }
            }
          />
        </div>
      </div>
      <div
        className="flexbox-container"
        style={{
          position: "absolute",
          right: 0,
          top: 0,

        }}
      >
        <Panel 
          lab={lab}
          labSectionHeight={labSectionHeight} 
          labMinHeight={labMinHeight} 
          milestones={milestones} 
          currentMilestone={currentMilestone}
          progressTrackHeight={progressTrackHeight}
          progressTrackMinHeight={progressTrackMinHeight}
          team={team}
          user={user}
        />
        {/* <div
          className="x-resizer begin"
          onMouseDown={startResizingRightPanel}
        ></div>
        <div
          ref={rightPanelRef}
          className="sidebar"
          style={{
            width: rightPaneWidth,
            minWidth: rightPaneMinWidth + "px",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <div
            ref={labRef}
            style={{
              height: labSectionHeight,
              minHeight: labMinHeight + "px",
              backgroundColor: "white",
              overflowX: "hidden",
              overflowY: "auto",
            }}
          >
            {lab ? ( <LabInfo lab={lab}/>) : null}
          </div>
          <div
            className="y-resizer begin"
            onMouseDown={startResizingLabSection}
          />
          <div
            ref={progressTrackRef}
            style={{
              height: progressTrackHeight,
              minHeight: progressTrackMinHeight + "px",
              backgroundColor: "white",
              width: "100%",
            }}
          >
            <ProgressTrack milestones={milestones} current={currentMilestone} />
          </div>
          <div
            className="y-resizer begin"
            onMouseDown={startResizingProgressTracking}
          />
          <div
            style={{
              backgroundColor: "white",
              width: "100%",
              // height: `100% - ${progressTrackHeight}px - ${labSectionHeight}px`,
              bottom: 0,
              flexGrow: 1
            }}
          >
            <Feedback
              team={team}
              username={user}
            />

          </div>
        </div> */}
      </div>
    </div>
  );
}
