import React, { useEffect, useRef } from "react";
import { mazeProps } from "../@types/maze";
import VisualizeMaze from "./VisualizeMaze";
import bfs from "./maker/bfs";

const Maze = (props: mazeProps) => {
  const MAX_X = props.maze.mazeMap[0]?.length;
  const MAX_Y = props.maze.mazeMap?.length;
  const interval = useRef<NodeJS.Timeout>();
  const onStart = () => {
    const result = bfs(0, 0, MAX_X, MAX_Y);
    if (!result.visited[MAX_Y - 1][MAX_X - 1]) {
      onStart();
    } else {
      props.setMaze({
        ...props.maze,
        started: true,
        coordinate: { x: 0, y: 0 },
        end: { x: MAX_X - 1, y: MAX_Y - 1 },
        points: result.points,
        mazeMap: props.maze.mazeMap.map((arr, y) => {
          return arr.map((el, x) => {
            return {
              ...el,
              item: result.visited[y][x],
            };
          });
        }),
      });

      interval.current = setInterval(() => {
        props.setMaze((prev) => {
          if (prev.time < 2) {
            clearInterval(interval.current);
          }
          return {
            ...prev,
            time: prev.time - 1,
          };
        });
      }, 1000);
    }
  };

  useEffect(() => {
    //도착 지점에 갔을때
    const pointsIndex = props.maze.points.findIndex(
      (v) => v.x === props.maze.coordinate.x && v.y === props.maze.coordinate.y
    );

    if (
      props.maze.coordinate.x === props.maze.end.x &&
      props.maze.coordinate.y === props.maze.end.y &&
      props.maze.started
    ) {
      props.setMaze((prev) => {
        clearInterval(interval.current);
        return {
          ...prev,
          recent: [],
          time: props.rowCol.col * 3,
          score: prev.score + props.maze.point,
          started: false,
        };
        //#end
      });
      return;
    }
    //포인트 얻었을때
    if (pointsIndex !== -1) {
      const copyPoints = JSON.parse(JSON.stringify(props.maze.points));
      copyPoints.splice(pointsIndex, 1);
      props.setMaze((prev) => {
        return {
          ...prev,
          points: copyPoints,
          point: prev.point + 1,
          time: prev.time + 3,
        };
      });
    } else if (pointsIndex !== -1) {
      //포인트를 전부 얻었을때
      props.setMaze((prev) => {
        clearInterval(interval.current);
        return {
          ...prev,
          recent: [],
          time: props.rowCol.col * 3,
          score: prev.score + props.maze.point * 5,
          started: false,
        };
        //#end
      });
    }
  }, [props]);

  useEffect(() => {
    const { maze, rowCol, setMaze } = props;
    //시간제한
    if (maze.time < 1) {
      let bricksIndex = 0;
      setMaze({
        ...maze,
        time: rowCol.col * 3,
        started: false,
        point: 0,
        points: [],
        recent: [],
        mazeMap: [...new Array(rowCol.col)].map(() => {
          return [...new Array(rowCol.row)].map(() => {
            bricksIndex++;
            return {
              index: bricksIndex,
              item: true,
            };
          });
        }),
        end: { x: rowCol.col, y: rowCol.row },
        start: { x: 0, y: 0 },
        coordinate: { x: 0, y: 0 },
      });
      //#end
      return;
    }
  }, [props]);

  return (
    <div className="maze-container">
      {!props.maze.started && (
        <input
          className="button"
          type="button"
          onClick={onStart}
          value="게임시작"
          disabled={
            !(
              props.rowCol.row >= 3 &&
              props.rowCol.col >= 3 &&
              props.rowCol.col % 2 === 1 &&
              props.rowCol.row % 2 === 1
            ) || props.maze.started
          }
        />
      )}
      {props.maze.started && (
        <React.Fragment>
          <p className="info">
            <i className="fa-solid fa-hourglass-end"></i>
            <span>{props.maze.time}</span>
            <i className="fa-solid fa-star"></i>
            <span>{props.maze.point}</span>
            <i className="fa-solid fa-heart"></i>
            <span>{props.maze.points.length}</span>
          </p>
          <table className="maze">
            <thead></thead>
            <tbody>
              <VisualizeMaze {...props} />
            </tbody>
          </table>
        </React.Fragment>
      )}
    </div>
  );
};

export default Maze;
