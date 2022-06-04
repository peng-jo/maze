import React, { useEffect, useRef } from "react";
import VisualizeMaze from "./VisualizeMaze";

const Maze = (props) => {
  const interval = useRef(null);
  const onStart = () => {
    const dfs = (x, y) => {
      const MAX_X = props.maze.mazeMap[0].length;
      const MAX_Y = props.maze.mazeMap.length;
      const points = [];
      const queue = [];
      let flag = true;
      const visited = new Array(MAX_Y)
        .fill(null)
        .map((v) => new Array(MAX_X).fill(null));
      queue.push({ x: x, y: y });
      visited[0][0] = true;
      const check = (x, y, dx, dy) => {
        const rx = x + dx;
        const rx2 = x + dx * 2;
        const ry = y + dy;
        const ry2 = y + dy * 2;
        if (
          rx2 < MAX_X &&
          ry2 < MAX_Y &&
          rx2 >= 0 &&
          ry2 >= 0 &&
          !visited[ry][rx] &&
          !visited[ry2][rx2]
        ) {
          return {
            result: [
              { x: rx, y: ry },
              { x: rx2, y: ry2 },
            ],
            r: true,
          };
        } else {
          return { x: x, y: y, r: false };
        }
      };

      while (flag) {
        const length = queue.length;
        if (length < 1) {
          return false;
        }
        for (let k = 0; k < length; k++) {
          const shifted = queue.shift();
          const list = [
            [0, 1],
            [1, 0],
            [-1, 0],
            [0, -1],
          ]
            .sort(() => Math.random() - 0.5)
            .map((v) => {
              return check(shifted.x, shifted.y, v[0], v[1]);
            })
            .filter((v) => v.r);
          const random = Math.floor(Math.random() * list.length);
          if (list.length < 1) break;
          for (let i = 0; i < random + 1; i++) {
            const result = list[i].result;
            for (let j = 0; j < result.length; j++) {
              if (result[j].x + 1 === MAX_X && result[j].y + 1 === MAX_Y) {
                flag = false;
              }
              //길 갯수 최대5개
              if (j === 1 && Math.floor(Math.random() * 5)) {
                queue.push({ x: result[j].x, y: result[j].y });
              }
              visited[result[j].y][result[j].x] = true;
              if (Math.floor(Math.random() * 20) < 1) {
                if (result[j].x !== MAX_X - 1 && result[j].y !== MAX_Y - 1) {
                  points.push({ x: result[j].x, y: result[j].y });
                }
              }
            }
          }
        }
      }
      props.setMaze({
        ...props.maze,
        started: true,
        coordinate: { x: 0, y: 0 },
        end: { x: MAX_X - 1, y: MAX_Y - 1 },
        points: points,
        mazeMap: props.maze.mazeMap.map((arr, y) => {
          return arr.map((el, x) => {
            return {
              ...el,
              item: visited[y][x],
            };
          });
        }),
      });
      //#start
      console.log(visited, props.maze);
      return true;
    };
    const result = dfs(0, 0);
    if (!result) {
      onStart();
    } else {
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

    if (pointsIndex !== -1) {
      const copyPoints = JSON.parse(JSON.stringify(props.maze.points));
      copyPoints.splice(pointsIndex, 1);
      props.setMaze((prev) => {
        return { ...prev, points: copyPoints, point: prev.point + 5 };
      });
    }
  }, [props]);

  useEffect(() => {
    const { maze, rowCol, setMaze } = props;
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
              <VisualizeMaze maze={props.maze} />
            </tbody>
          </table>
        </React.Fragment>
      )}
    </div>
  );
};

export default Maze;
