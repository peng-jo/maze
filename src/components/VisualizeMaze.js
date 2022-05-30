import React from "react";

export const VisualizeMaze = (props) => {
  const elements = () => {
    const visualSize = 5;
    const element = [];
    let x = props.maze.coordinate.x;
    let y = props.maze.coordinate.y;
    const MAX_X = props.maze.mazeMap.length;
    const MAX_Y = props.maze.mazeMap[0]?.length;
    if (x + visualSize > MAX_X) {
      x = MAX_X - (x + visualSize);
    }
    if (y + visualSize > MAX_Y) {
      y = MAX_Y - (y + visualSize);
    }
    if (MAX_X < 3 || MAX_Y < 3) {
      return;
    }
    const wall = () => {
      const random = Math.floor(Math.random() * 100000);
      element.push(
        <tr key={"tr wall " + random}>
          {new Array(visualSize + 2).fill(
            <td>
              <div className="bricks"></div>
            </td>
          )}
        </tr>
      );
    };
    wall();
    for (let row = 0; row < visualSize; row++) {
      element.push(
        <tr key={"tr" + row}>
          <td>
            <div className="bricks"></div>
          </td>
          {[...new Array(visualSize)].map((el, col) => {
            const bricks = props.maze.mazeMap[row][col];
            return (
              <td
                key={"td " + bricks.index}
                data-num={bricks.index}
                onClick={props.onClick}
              >
                {bricks.item ? (
                  <div>
                    {props.maze.coordinate.x === x &&
                    props.maze.coordinate.y === y ? (
                      <div className="now"></div>
                    ) : (
                      <div
                        data-num={bricks.index}
                        className={
                          bricks.line && props.moving.current ? "line" : ""
                        }
                      >
                        {props.maze.points.findIndex(
                          (v) => v.x === x && v.y === y
                        ) !== -1 && (
                          <i className="fa-solid fa-heart points"></i>
                        )}
                        {props.maze.end.x === x && props.maze.end.y === y ? (
                          <i className="fa-solid fa-person-running points"></i>
                        ) : (
                          ""
                        )}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="bricks"></div>
                )}
              </td>
            );
          })}
          <td>
            <div className="bricks"></div>
          </td>
        </tr>
      );
    }
    wall();
    return element;
  };

  return elements();
};
