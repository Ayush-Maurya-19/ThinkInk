import React, { useEffect, useMemo, useState } from "react";
import { Stage, Layer, Star, Text, Line } from "react-konva";
import { useRef, useLayoutEffect } from "react";

const DrawingPage = () => {
  const containerRef = useRef(null);
  const isDrawing = React.useRef(false);
  const [currentColor, setCurrentColor] = useState("black");
  const [tool, setTool] = React.useState("pen");
  const [lines, setLines] = React.useState([]);

  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);
  const [penWidth, setPenWidth] = useState(4);

  useLayoutEffect(() => {
    setWidth(containerRef.current.offsetWidth);
    setHeight(containerRef.current.offsetHeight);
  }, []);

  const handleMouseDown = (e) => {
    isDrawing.current = true;
    const pos = e.target.getStage().getPointerPosition();
    setLines([...lines, { tool, points: [pos.x, pos.y] }]);
  };

  const handleMouseMove = (e) => {
    // no drawing - skipping
    if (!isDrawing.current) {
      return;
    }
    const stage = e.target.getStage();
    const point = stage.getPointerPosition();
    let lastLine = lines[lines.length - 1];
    // add point
    lastLine.points = lastLine.points.concat([point.x, point.y]);

    // replace last
    lines.splice(lines.length - 1, 1, lastLine);
    setLines(lines.concat());
  };

  const handleMouseUp = () => {
    isDrawing.current = false;
  };

  const changeWidth = (e) => {
    setPenWidth(e.target.value);
  };

  const undoDwawing = () => {
    lines.pop();
    setLines([...lines]);
  };

  const clearCanvas = () => {
    setLines([]);
  };

  return (
    <div className="container">
      <div className="text-center mt-4">
        <h5>Draw the _______ </h5>
      </div>

      <div className="col-span-6 mt-3">
        <div className="card shadow" ref={containerRef}>
          <Stage
            width={width}
            height={"400"}
            onMouseDown={handleMouseDown}
            onMousemove={handleMouseMove}
            onMouseup={handleMouseUp}
          >
            <Layer>
              {/* <Text text="Just start drawing" x={5} y={5} /> */}
              {lines.map((line, i) => (
                <Line
                  key={i}
                  points={line.points}
                  stroke={currentColor}
                  strokeWidth={penWidth}
                  tension={0.5}
                  lineCap="round"
                  lineJoin="round"
                  globalCompositeOperation={
                    line.tool === "eraser" ? "destination-out" : "source-over"
                  }
                />
              ))}
            </Layer>
          </Stage>
        </div>

        <div className="d-flex justify-content-start">
          <div className="mt-2 d-flex col-md-7 justify-content-around ">
            {/* undo button */}

            <button className="btn btn-primary" onClick={undoDwawing}>
              Undo
            </button>

            {/* clear button */}

            <button className="btn btn-danger" onClick={clearCanvas}>
              Clear
            </button>

            {/* color button */}

            {/* pen button */}
            <button
              className="btn btn-primary"
              onClick={(e) => {
                setTool("pen");
              }}
            >
              Pen
            </button>

            {/* eraser button */}

            <button
              className="btn btn-primary"
              onClick={(e) => {
                setTool("eraser");
              }}
            >
              Eraser
            </button>
          </div>

          <div>
            {/* change pen width */}
            <input
              className="mt-4"
              type="range"
              min="1"
              max="10"
              value={penWidth}
              onChange={changeWidth}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DrawingPage;
