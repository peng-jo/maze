import { useRef, useState, useEffect } from "react";

const Maze = (props) => {
  const [status, setStatus] = useState(false);

  const successIndex = useRef(0);
  const IntervalRef = useRef(null);
  const onStart = () => {
    props.setCoordinate({ x: 0, y: 0 });
    const dfs = (x, y) => {
      const MAX_X = props.maze[0].length;
      const MAX_Y = props.maze.length;
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

      let test = 0;
      while (flag) {
        test++;
        if (test > 100000000) {
          console.log("over 1000");
          flag = false;
        }
        const length = queue.length;
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

              if (j === 1 && Math.floor(Math.random() * 10)) {
                queue.push({ x: result[j].x, y: result[j].y });
              }
              visited[result[j].y][result[j].x] = true;
            }
          }
        }
      }
      props.setMaze(
        props.maze.map((arr, y) => {
          return arr.map((el, x) => {
            return {
              ...el,
              item: visited[y][x],
            };
          });
        })
      );
      console.log(visited, props.maze);
    };
    dfs(0, 0);
  };

  const autoMove = () => {
    setStatus(!status);
    if (!status) {
      document.querySelector(".maze").classList.add("cursor");
    } else {
      document.querySelector(".maze").classList.remove("cursor");
    }
  };

  const onClick = (e) => {
    const MAX_X = props.maze[0].length;
    const MAX_Y = props.maze.length;
    const num = Number(
      e.target.parentElement.dataset.num ||
        e.target.parentElement.parentElement.dataset.num
    );
    if (status) {
      const dfs = (x, y, targetX, targetY) => {
        if (!props.maze[targetY][targetX]) {
          console.log("벽");
          return;
        }
        const queue = [];
        const route = [];
        const success = [];
        let phase = 0;
        let flag = true;

        const visited = props.maze.map((row) => row.map((v) => !v.item));
        queue.push({ x: x, y: y });
        visited[y][x] = true;
        const check = (x, y) => {
          if (x >= 0 && y >= 0 && MAX_X > x && MAX_Y > y && !visited[y][x]) {
            return { x: x, y: y, r: true };
          } else {
            return { r: false };
          }
        };
        let test = 0;
        while (flag) {
          test++;
          if (test > 100 && queue.length < 1) {
            console.log("test over 100");
            flag = false;
          }
          const length = queue.length;
          for (let k = 0; k < length; k++) {
            const shifted = queue.shift();
            const list = [
              [0, 1],
              [1, 0],
              [0, -1],
              [-1, 0],
            ];
            const result = list
              .map((v) => check(shifted.x + v[0], shifted.y + v[1]))
              .filter((v) => v.r);
            if (result.length < 1) {
              continue;
            }
            for (let j = 0; j < result.length; j++) {
              if (result[j].x === targetX && result[j].y === targetY) {
                flag = false;
              }
              // console.log(phase, { x: result[j].x, y: result[j].y });
              !route[phase]
                ? (route[phase] = [{ x: result[j].x, y: result[j].y }])
                : route[phase].push({ x: result[j].x, y: result[j].y });
              queue.push({ x: result[j].x, y: result[j].y });
              visited[result[j].y][result[j].x] = true;
            }
          }
          phase++;
        }
        console.log(route);
        let target = { x: 0, y: 0 };
        route.reverse().forEach((route, index) => {
          if (index === 0) {
            target = route[0];
          } else {
            const result = route.filter(
              (v) => Math.abs(target.x - v.x) + Math.abs(target.y - v.y) === 1
            );
            Object.assign(target, result[0]);
            success.unshift(result[0]);
          }
        });

        console.log(success);
        return success;
      };

      const success = dfs(
        parseInt(props.coordinate.x),
        parseInt(props.coordinate.y),
        num % props.rowCol.col,
        Math.floor(num / props.rowCol.col)
      );

      IntervalRef.current = setInterval(() => {
        if (successIndex.current >= success.length - 1) {
          console.log(
            success[successIndex.current]?.x,
            success[successIndex.current]?.y
          );
          successIndex.current = 0;
          clearInterval(IntervalRef.current);
          return;
        }
        const x = success[successIndex.current]?.x;
        const y = success[successIndex.current]?.y;
        props.setCoordinate({ x: x, y: y });
        successIndex.current += 1;
      }, 100);
    } else {
      console.log(num);
      props.setMaze(
        props.maze.map((arr) => {
          return arr.map((el) => {
            if (el.index === num) {
              return {
                ...el,
                item: !el.item,
              };
            } else {
              return { ...el };
            }
          });
        })
      );
    }
  };

  return (
    <div>
      <input type="button" onClick={onStart} value={"start"} />
      <input type="button" onClick={autoMove} value={"autoMove"} />
      <p className="info">auto Move Select Mode {status ? "ON" : "OFF"}</p>
      <table className="maze">
        <thead></thead>
        <tbody>
          <tr>
            <td>
              <div className="bricks"></div>
            </td>
            {props.maze[0]?.map((row, index) => (
              <td key={"wall " + index}>
                <div className="bricks"></div>
              </td>
            ))}
            <td>
              <div className="bricks"></div>
            </td>
          </tr>
          {props.maze?.map((row, y) => (
            <tr key={"tr " + y}>
              <td>
                <div className="bricks"></div>
              </td>
              {row.map((bricks, x) => (
                <td key={"td " + x} data-num={bricks.index} onClick={onClick}>
                  {bricks.item ? (
                    <div>
                      {props.coordinate.x === x && props.coordinate.y === y ? (
                        <div className="now"></div>
                      ) : (
                        <div></div>
                      )}
                    </div>
                  ) : (
                    <div className="bricks"></div>
                  )}
                </td>
              ))}
              <td>
                <div className="bricks"></div>
              </td>
            </tr>
          ))}
          <tr>
            <td>
              <div className="bricks"></div>
            </td>
            {props.maze[0]?.map((row, index) => (
              <td key={"wall " + index}>
                <div className="bricks"></div>
              </td>
            ))}
            <td>
              <div className="bricks"></div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default Maze;
