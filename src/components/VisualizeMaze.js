import React from "react";
const VisualizeMaze = (props) => {
  let index = 0;
  const navigate = (num) => {
    const { x, y } = props.maze.coordinate;
    const colSize = props.maze.mazeMap[0].length;
    const coor = y * colSize + x;
    const result = (num - coor) / colSize;
    console.log(result);
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
  const elements = () => {
    const visualSize = 7;
    const element = [];
    let x = props.maze.coordinate.x;
    let y = props.maze.coordinate.y;
    let start_x = 0;
    let start_y = 0;
    const MAX_X = props.maze.mazeMap.length;
    const MAX_Y = props.maze.mazeMap[0]?.length;
    const diff = (visualSize - (visualSize % 2)) / 2;
    if (x - diff < 0) {
      start_x = 0;
    } else if (x + diff >= MAX_X) {
      start_x = MAX_X - visualSize;
    } else {
      start_x = x - diff;
    }
    if (y - diff < 0) {
      start_y = 0;
    } else if (y + diff >= MAX_Y) {
      start_y = MAX_Y - visualSize;
    } else {
      start_y = y - diff;
    }

    if (MAX_X < 3 || MAX_Y < 3) {
      return;
    }
    const wall = () => {
      index++;
      element.push(
        <tr key={"tr" + index}>
          <td colSpan={visualSize + 2} key={"td" + index}>
            <div className="wall row"></div>
          </td>
        </tr>
      );
    };
    wall();

    for (let row = start_y, index = 0; row < start_y + visualSize; row++) {
      index++;
      element.push(
        <tr key={"tr" + row + index}>
          {index === 1 && (
            <td rowSpan={visualSize} style={{ backgroundColor: "#c9c9c9" }}>
              <div className="wall col"></div>
            </td>
          )}
          {[...new Array(visualSize)].map((el, col) => {
            const bricks = props.maze.mazeMap[row][col + start_x];
            return (
              <td key={"td " + bricks.index} data-num={bricks.index}>
                {bricks.item ? (
                  <div
                    onClick={() => navigate(bricks.index)}
                    className={
                      props.maze.recent.findIndex(
                        (v) => v.x === col + start_x && v.y === row
                      ) !== -1
                        ? "big line"
                        : "big"
                    }
                  >
                    {x === col + start_x && y === row ? (
                      <div className="now big"></div>
                    ) : (
                      props.maze.points.findIndex(
                        (v) => v.x === col + start_x && v.y === row
                      ) !== -1 && (
                        <i className="fa-solid fa-heart points big"></i>
                      )
                    )}
                    {props.maze.end.x === col + start_x &&
                      props.maze.end.y === row && (
                        <i className="fa-solid fa-person-running points big"></i>
                      )}
                  </div>
                ) : (
                  <div className="bricks big"></div>
                )}
              </td>
            );
          })}
          {index === 1 && (
            <td rowSpan={visualSize} style={{ backgroundColor: "#c9c9c9" }}>
              <div className="wall col"></div>
            </td>
          )}
        </tr>
      );
    }
    wall();
    return element;
  };

  return elements();
};

export default React.memo(VisualizeMaze, (prevProps, nextProps) => {
  return prevProps.maze.coordinate === nextProps.maze.coordinate;
});
