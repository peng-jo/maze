import "./style/style.scss";
import Maze from "./components/maze";
import React, { useState, useEffect } from "react";

const App = () => {
  const [rowCol, setRowCol] = useState({
    col: 0,
    row: 0,
  });
  const [maze, setMaze] = useState({
    points: [],
    mazeMap: [],
    end: { x: 0, y: 0 },
    start: { x: 0, y: 0 },
    coordinate: { x: 0, y: 0 },
  });

  const onChange = (e) => {
    const { value, name } = e.target;
    if (!Number.isInteger(parseInt(value))) {
      setRowCol({
        ...rowCol,
        [name]: 0,
      });
      return;
    }
    if (value > 99) {
      console.log("너무큼");
      return;
    }
    setRowCol({
      ...rowCol,
      [name]: value < 1 ? 1 : parseInt(value),
    });
  };
  const onKeyDown = (e) => {
    const MAX_X = rowCol.col;
    const MAX_Y = rowCol.row;
    const x = maze.coordinate.x;
    const y = maze.coordinate.y;
    switch (e.code) {
      case "ArrowDown":
        if (
          y + 1 < MAX_Y &&
          y + 1 >= 0 &&
          maze.mazeMap[maze.coordinate.y + 1][x].item
        ) {
          setMaze({
            ...maze,
            coordinate: { x: x, y: y + 1 },
          });
        }
        break;
      case "ArrowUp":
        if (y - 1 < MAX_Y && y - 1 >= 0 && maze.mazeMap[y - 1][x].item) {
          setMaze({
            ...maze,
            coordinate: { x: x, y: y - 1 },
          });
        }
        break;
      case "ArrowLeft":
        if (x - 1 < MAX_X && x - 1 >= 0 && maze.mazeMap[y][x - 1].item) {
          setMaze({
            ...maze,
            coordinate: { x: x - 1, y: y },
          });
        }
        break;
      case "ArrowRight":
        if (x + 1 < MAX_X && x + 1 >= 0 && maze.mazeMap[y][x + 1].item) {
          setMaze({
            ...maze,
            coordinate: { x: x + 1, y: y },
          });
        }
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
    <div className="App" onKeyDown={onKeyDown} tabIndex="0">
      <p className="header">미로 게임</p>
      세로
      <input
        className="col input"
        name="col"
        onChange={onChange}
        value={rowCol.col}
      />
      <span className="mr">칸</span>
      가로
      <input
        className="row input"
        name="row"
        onChange={onChange}
        value={rowCol.row}
      />
      <span className="mr">칸</span>
      <p className="info alert">
        {(rowCol.col % 2 === 0 || rowCol.row % 2 === 0) &&
          "가로 혹은 세로값이 짝수입니다"}
      </p>
      <p className="info">
        {rowCol.row < 3 && rowCol.col < 3 ? (
          <span>
            👉 <b>가로세로 3칸 이상 홀수</b> 로 입력해주세요
          </span>
        ) : (
          <React.Fragment>
            <span>
              👉 <b>가로세로 3칸 이상 홀수</b> 로 입력해주세요
            </span>
            <br />
            <span>
              👉 <b>99칸 이하로</b> 입력 가능합니다
            </span>
          </React.Fragment>
        )}
      </p>
      <Maze maze={maze} setMaze={setMaze} rowCol={rowCol} />
    </div>
  );
};

export default App;
