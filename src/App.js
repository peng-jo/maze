import "./style/style.scss";
import Maze from "./components/maze";
import React, { useState, useEffect } from "react";

const App = () => {
  const [rowCol, setRowCol] = useState({
    col: 0,
    row: 0,
  });
  const [maze, setMaze] = useState([]);
  const [coordinate, setCoordinate] = useState({ x: 0, y: 0 });
  const onChange = (e) => {
    const { value, name } = e.target;
    if (value > 100) {
      console.log("너무큼");
      return;
    }
    setRowCol({
      ...rowCol,
      [name]: value < 1 ? 1 : Number(value),
    });
  };
  const onKeyDown = (e) => {
    const MAX_X = rowCol.col;
    const MAX_Y = rowCol.row;
    const x = coordinate.x;
    const y = coordinate.y;
    switch (e.code) {
      case "ArrowDown":
        if (y + 1 < MAX_Y && y + 1 >= 0 && maze[coordinate.y + 1][x].item) {
          setCoordinate({ x: x, y: y + 1 });
        }
        break;
      case "ArrowUp":
        if (y - 1 < MAX_Y && y - 1 >= 0 && maze[y - 1][x].item) {
          setCoordinate({ x: x, y: y - 1 });
        }
        break;
      case "ArrowLeft":
        if (x - 1 < MAX_X && x - 1 >= 0 && maze[y][x - 1].item) {
          setCoordinate({ x: x - 1, y: y });
        }
        break;
      case "ArrowRight":
        if (x + 1 < MAX_X && x + 1 >= 0 && maze[y][x + 1].item) {
          setCoordinate({ x: x + 1, y: y });
        }
        break;
      default:
    }
  };

  useEffect(() => {
    let bricksIndex = -1;
    setMaze(
      [...new Array(rowCol.col)].map(() => {
        return [...new Array(rowCol.row)].map(() => {
          bricksIndex++;
          return {
            index: bricksIndex,
            item: true,
          };
        });
      })
    );
    // document.querySelectorAll(".maze td > div").forEach((div) => {
    //   const px = (window.innerHeight - 200) / rowCol.row + "px";
    //   div.style.width = px;
    //   div.style.height = px;
    // });
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
      <p className="info">👉 99칸 이하로 입력 가능합니다</p>
      <Maze
        coordinate={coordinate}
        setCoordinate={setCoordinate}
        maze={maze}
        setMaze={setMaze}
        rowCol={rowCol}
      />
    </div>
  );
};

export default App;
