import React, { useState, useEffect } from "react";
import Maze from "./Maze";
import { MazeGameType } from "../@types/mazeGame";

const MazeGame = ():JSX.Element => {
  const [rowCol] = useState({
    col: 29,
    row: 29,
  });
  const [maze, setMaze] = useState<MazeGameType>({
    score: 0,
    time: rowCol.col * 3,
    started: false,
    point: 0,
    points: [],
    mazeMap: [],
    recent: [],
    end: { x: 0, y: 0 },
    start: { x: 0, y: 0 },
    coordinate: { x: 0, y: 0 },
  });

  const move = (direction :string): void => {
    const MAX_X = rowCol.col;
    const MAX_Y = rowCol.row;
    const x = maze.coordinate.x;
    const y = maze.coordinate.y;
    const recent = [...maze.recent]
      .filter((recent) => recent.x !== x || recent.y !== y)
      .concat({ x, y })
      .slice(-13);
    switch (direction) {
      case "DOWN":
        if (
          y + 1 < MAX_Y &&
          y + 1 >= 0 &&
          maze.mazeMap[maze.coordinate.y + 1][x].item
        ) {
          setMaze((prevState) => {
            return {
              ...prevState,
              coordinate: { x: x, y: y + 1 },
              recent,
            };
          });
        }
        break;
      case "UP":
        if (y - 1 < MAX_Y && y - 1 >= 0 && maze.mazeMap[y - 1][x].item) {
          setMaze((prevState) => {
            return {
              ...prevState,
              coordinate: { x: x, y: y - 1 },
              recent,
            };
          });
        }
        break;
      case "LEFT":
        if (x - 1 < MAX_X && x - 1 >= 0 && maze.mazeMap[y][x - 1].item) {
          setMaze((prevState) => {
            return {
              ...prevState,
              coordinate: { x: x - 1, y: y },
              recent,
            };
          });
        }
        break;
      case "RIGHT":
        if (x + 1 < MAX_X && x + 1 >= 0 && maze.mazeMap[y][x + 1].item) {
          setMaze((prevState) => {
            return {
              ...prevState,
              coordinate: { x: x + 1, y: y },
              recent,
            };
          });
        }
        break;
      default:
    }
  };
  const onKeyDown = (e: React.KeyboardEvent) => {
    if (!maze.started) {
      return;
    }

    switch (e.code) {
      case "ArrowDown":
        move("DOWN");
        break;
      case "ArrowUp":
        move("UP");
        break;
      case "ArrowLeft":
        move("LEFT");
        break;
      case "ArrowRight":
        move("RIGHT");
        break;
      default:
    }
  };

  useEffect(() => {
    if (rowCol.col % 2 === 0 || rowCol.row % 2 === 0) {
      return;
    }
    setMaze((prev) => {
      let bricksIndex = -1;
      return {
        ...prev,
        mazeMap: [...new Array(rowCol.col)].map(() => {
          return [...new Array(rowCol.row)].map(() => {
            bricksIndex++;
            return {
              index: bricksIndex,
              item: true,
            };
          });
        }),
      };
    });
  }, [rowCol]);
    return (
      <div className="target" onKeyDown={onKeyDown} tabIndex={0}>
        <p className="info mg">최종 : {maze.score} 점</p>
        <div>
          세로
          <input
            className="col input"
            name="col"
            value={rowCol.col}
            readOnly={true}
          />
          <span className="mr">칸</span>
          가로
          <input
            className="row input"
            name="row"
            value={rowCol.row}
            readOnly={true}
          />
          <span className="mr">칸</span>
        </div>
        <Maze maze={maze} setMaze={setMaze} rowCol={rowCol} move={move} />
      </div>
    );
}

export default MazeGame;