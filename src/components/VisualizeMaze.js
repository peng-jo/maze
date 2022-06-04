import React from "react";
const VisualizeMaze = (props) => {
  let index = 0;
  const elements = () => {
    const visualSize = 5;
    const element = [];
    let x = props.maze.coordinate.x;
    let y = props.maze.coordinate.y;
    let start_x = 0;
    let start_y = 0;
    const MAX_X = props.maze.mazeMap.length;
    const MAX_Y = props.maze.mazeMap[0]?.length;
    if (x - 2 < 0) {
      start_x = 0;
    } else if (x + 2 >= MAX_X) {
      start_x = MAX_X - visualSize;
    } else {
      start_x = x - 2;
    }
    if (y - 2 < 0) {
      start_y = 0;
    } else if (y + 2 >= MAX_Y) {
      start_y = MAX_Y - visualSize;
    } else {
      start_y = y - 2;
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
            <td rowSpan={visualSize}>
              <div className="wall col"></div>
            </td>
          )}
          {[...new Array(visualSize)].map((el, col) => {
            const bricks = props.maze.mazeMap[row][col + start_x];
            return (
              <td key={"td " + bricks.index} data-num={bricks.index}>
                {bricks.item ? (
                  <div
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
            <td rowSpan={visualSize}>
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
