import React from "react";

import "./ResizablePane.css";

function ResizablePane({
  childrenComponent,
  initialWidth = 268,
  initialHeight = 500,
  type = "horizontal",
  XfixedSide = "left",
  YfixedSide = "top",
  minX = 100,
  minY = 100,
}: {
  childrenComponent: React.ReactNode;
  initialWidth?: number | string;
  initialHeight?: number | string;
  type?: "horizontal" | "vertical" | "both";
  XfixedSide?: "left" | "right";
  YfixedSide?: "top" | "bottom";
  minX?: number;
  minY?: number;
}) {
  const sidebarRef = React.useRef<HTMLDivElement | null>(null);
  const [isResizingX, setIsResizingX] = React.useState(false);
  const [isResizingY, setIsResizingY] = React.useState(false);
  const [sidebarWidth, setSidebarWidth] = React.useState(initialWidth);
  const [sidebarHeight, setSidebarHeight] = React.useState(initialHeight);

  const startResizingX = React.useCallback((mouseDownEvent) => {
    setIsResizingX(true);
  }, []);
  const startResizingY = React.useCallback((mouseDownEvent) => {
    setIsResizingY(true);
  }, []);

  const stopResizing = React.useCallback(() => {
    setIsResizingX(false);
    setIsResizingY(false);
  }, []);

  const resize = React.useCallback(
    (mouseMoveEvent) => {
      if (isResizingX) {
        setSidebarWidth(
          Math.abs(
            mouseMoveEvent.clientX -
              (sidebarRef.current?.getBoundingClientRect()?.[XfixedSide] || 0)
          )
        );
      }
      if (isResizingY) {
        setSidebarHeight(
          mouseMoveEvent.clientY -
            (sidebarRef.current?.getBoundingClientRect()?.[YfixedSide] || 0)
        );
      }
    },
    [isResizingX, isResizingY, XfixedSide, YfixedSide]
  );

  React.useEffect(() => {
    window.addEventListener("mousemove", resize);
    window.addEventListener("mouseup", stopResizing);
    return () => {
      window.removeEventListener("mousemove", resize);
      window.removeEventListener("mouseup", stopResizing);
    };
  }, [resize, stopResizing]);

  return (
    <div
      ref={sidebarRef}
      className={
        "app-sidebar " +
        (type === "horizontal" ? "app-sidebar-row" : "app-sidebar-col")
      }
      style={{
        width: sidebarWidth,
        height: sidebarHeight,
        minWidth: minX,
        minHeight: minY,
      }}
      onMouseDown={(e) => e.preventDefault()}
    >
      {type === "horizontal" && XfixedSide === "right" ? (
        <div
          className={"app-sidebar-x-resizer begin"}
          onMouseDown={startResizingX}
        />
      ) : null}
      <div className="app-sidebar-content">{childrenComponent}</div>
      {/* <div className="app-sidebar-row"> */}
      {type === "horizontal" && XfixedSide === "left" ? (
        <div
          className={"app-sidebar-x-resizer end"}
          onMouseDown={startResizingX}
        />
      ) : null}
      {/* </div> */}
      {/* <div className="app-sidebar-col"> */}
      {type === "vertical" || type === "both" ? (
        <div
          className={
            "app-sidebar-y-resizer " + (YfixedSide === "top" ? "end" : "begin")
          }
          onMouseDown={startResizingY}
        />
      ) : null}
      {/* </div> */}
    </div>
  );
}

export default ResizablePane;
