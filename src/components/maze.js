import { useRef, useState } from "react";

const Maze = (props) => {
  const [status, setStatus] = useState(false);
  const moving = useRef(false);
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
    if (moving.current) {
      console.log("stop");
      return;
    }
    if (status) {
      const dfs = (x, y, targetX, targetY) => {
        if (!props.maze[targetY][targetX]) {
          console.log("벽");
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
        // let test = 0;
        while (flag) {
          // test++;
          // if (test > 100) {
          //   console.log("test over 100");
          //   flag = false;
          // }

          const length = queue.length;
          if (length < 1) {
            return false;
          }
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
              if (flag) {
                !route[phase]
                  ? (route[phase] = [{ x: result[j].x, y: result[j].y }])
                  : route[phase].push({
                      x: result[j].x,
                      y: result[j].y,
                    });
              }
              if (result[j].x === targetX && result[j].y === targetY) {
                flag = false;
              }
              // console.log(phase, { x: result[j].x, y: result[j].y });

              queue.push({ x: result[j].x, y: result[j].y });
              visited[result[j].y][result[j].x] = true;
            }
            // console.log(route[phase]);
          }
          phase++;
        }
        let target = { x: 0, y: 0 };
        route.reverse().forEach((route, index) => {
          if (index === 0) {
            target.x = route[route.length - 1].x;
            target.y = route[route.length - 1].y;
            success.unshift({ ...target });
          } else {
            const result = route.filter(
              (v) => Math.abs(target.x - v.x) + Math.abs(target.y - v.y) === 1
            );
            target.x = result[0].x;
            target.y = result[0].y;
            success.unshift({ ...result[0] });
          }
        });
        console.log("success", success);
        return success;
      };

      const success = dfs(
        parseInt(props.coordinate.x),
        parseInt(props.coordinate.y),
        num % props.rowCol.col,
        Math.floor(num / props.rowCol.col)
      );
      if (!success) {
        console.log("도달 할 수 없음.");
        return false;
      }
      moving.current = true;
      IntervalRef.current = setInterval(() => {
        const x = success[successIndex.current].x;
        const y = success[successIndex.current].y;
        if (successIndex.current >= success.length - 1) {
          props.setCoordinate({ x: x, y: y });
          moving.current = false;
          clearInterval(IntervalRef.current);
          successIndex.current = 0;
          return;
        }
        props.setCoordinate({ x: x, y: y });
        successIndex.current += 1;
      }, 100);
      const deepCopyMaze = JSON.parse(JSON.stringify(props.maze));
      deepCopyMaze.forEach((row, y) => {
        row.forEach((v, x) => {
          deepCopyMaze[y][x].line = false;
        });
      });
      success.forEach((v) => {
        deepCopyMaze[v.y][v.x].line = true;
      });
      props.setMaze(deepCopyMaze);
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
      <input
        className="button"
        type="button"
        onClick={onStart}
        value="미로 랜덤 생성"
      />
      <input
        className="button"
        type="button"
        onClick={autoMove}
        value={status ? "자동 움직이기" : "벽 생성/삭제"}
      />
      <p className="info">
        {status
          ? "자동으로 움직일 곳을 클릭해 주세요"
          : "클릭하면 벽을 만들거나 없앨수 있습니다."}
      </p>
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
                        <div
                          className={
                            bricks.line && moving.current ? "line" : ""
                          }
                        ></div>
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
