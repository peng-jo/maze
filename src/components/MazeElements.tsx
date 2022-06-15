import React from "react";
import { mazeProps } from "../@types/maze";

interface MazeElementsProps extends mazeProps {
  navigate: (num: number) => void;
};
  
export const MazeElements = (
  props: MazeElementsProps
) => {
  const returnElements = (): JSX.Element => {
    let index = 0;
    const visualSize = 7;
    const element = [];
    const MAX_X = props.maze.mazeMap.length;
    const MAX_Y = props.maze.mazeMap[0]?.length;
    const diff = (visualSize - (visualSize % 2)) / 2;
    let x = props.maze.coordinate.x;
    let y = props.maze.coordinate.y;
    let start_x = 0;
    let start_y = 0;

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
                    onClick={() => props.navigate(bricks.index)}
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
    return <React.Fragment>{element}</React.Fragment>;
  };
  return returnElements();
};