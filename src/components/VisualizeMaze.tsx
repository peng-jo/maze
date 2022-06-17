import React from "react";
import { MazeElements } from "./MazeElements";
import { mazeProps } from "../@types/mazeProps";


const VisualizeMaze = (props: mazeProps): JSX.Element => {
  const navigate = (num: number) => {
    const { x, y } = props.maze.coordinate;
    const colSize = props.maze.mazeMap[0].length;
    const coor = y * colSize + x;
    const result = (num - coor) / colSize;
    if (result < 0) {
      if (Math.abs(result % 1) === 0) {
        props.move("UP");
      } else {
        props.move("LEFT");
      }
    } else if (result > 0) {
      if (Math.abs(result % 1) === 0) {
        props.move("DOWN");
      } else {
        props.move("RIGHT");
      }
    }
  };
  return <MazeElements navigate={navigate} {...props} />;
};

export default React.memo(
  VisualizeMaze,
  (prevProps, nextProps) => {
    return prevProps.maze.coordinate === nextProps.maze.coordinate;
  }
);
