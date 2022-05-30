import { useRef, useState, useEffect } from "react";

const Maze = (props) => {
  const [status, setStatus] = useState(true);
  const moving = useRef(false);
  const successIndex = useRef(0);
  const IntervalRef = useRef(null);

  const onStart = () => {
    props.setCoordinate({ x: 0, y: 0 });
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

              if (j === 1 && Math.floor(Math.random() * 10)) {
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
      console.log(visited, props.maze);
      return true;
    };
    const result = dfs(0, 0);
    if (!result) {
      onStart();
    }
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
    const MAX_X = props.maze.mazeMap[0].length;
    const MAX_Y = props.maze.mazeMap.length;
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
        if (!props.maze.mazeMap[targetY][targetX]) {
          console.log("벽");
        }
        const queue = [];
        const route = [];
        const success = [];
        let phase = 0;
        let flag = true;

        const visited = props.maze.mazeMap.map((row) =>
          row.map((v) => !v.item)
        );
        queue.push({ x: x, y: y });
        visited[y][x] = true;
        const check = (x, y) => {
          if (x >= 0 && y >= 0 && MAX_X > x && MAX_Y > y && !visited[y][x]) {
            return { x: x, y: y, r: true };
          } else {
            return { r: false };
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
        num % props.rowCol.row,
        Math.floor(num / props.rowCol.row)
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
      const deepCopyMaze = JSON.parse(JSON.stringify(props.maze.mazeMap));
      deepCopyMaze.forEach((row, y) => {
        row.forEach((v, x) => {
          deepCopyMaze[y][x].line = false;
        });
      });
      success.forEach((v) => {
        deepCopyMaze[v.y][v.x].line = true;
      });
      props.setMaze({ ...props.maze, mazeMap: deepCopyMaze });
    } else {
      console.log(num);
      props.setMaze({
        ...props.maze,
        mazeMap: props.maze.mazeMap.map((arr) => {
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
        }),
      });
    }
  };

  useEffect(() => {
    const pointsIndex = props.maze.points.findIndex(
      (v) => v.x === props.coordinate.x && v.y === props.coordinate.y
    );

    if (pointsIndex !== -1) {
      const copyPoints = JSON.parse(JSON.stringify(props.maze.points));
      copyPoints.splice(pointsIndex, 1);
      props.setMaze({ ...props.maze, points: copyPoints });
    }
  }, [props.coordinate]);
  return (
    <div>
      <input
        className="button"
        type="button"
        onClick={onStart}
        value="미로 랜덤 생성"
        disabled={
          !(
            props.rowCol.row >= 3 &&
            props.rowCol.col >= 3 &&
            props.rowCol.col % 2 === 1 &&
            props.rowCol.row % 2 === 1
          )
        }
      />
      <input
        className="button"
        type="button"
        onClick={autoMove}
        value={status ? "자동 움직이기" : "벽 생성/삭제"}
        disabled={
          !(
            props.rowCol.row >= 3 &&
            props.rowCol.col >= 3 &&
            props.rowCol.col % 2 === 1 &&
            props.rowCol.row % 2 === 1
          )
        }
      />
      <p className="info">
        {status
          ? "자동으로 움직일 곳을 클릭해 주세요"
          : "클릭하면 벽을 만들거나 없앨수 있습니다."}
      </p>
      <p className="info">
        <i className="fa-solid fa-heart"></i> x {props.maze.points.length}
      </p>
      <table className="maze">
        <thead></thead>
        <tbody>
          <tr>
            <td>
              <div className="bricks"></div>
            </td>
            {props.maze.mazeMap[0]?.map((row, index) => (
              <td key={"wall " + index}>
                <div className="bricks"></div>
              </td>
            ))}
            <td>
              <div className="bricks"></div>
            </td>
          </tr>
          {props.maze.mazeMap.map((row, y) => (
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
                          data-num={bricks.index}
                          className={
                            bricks.line && moving.current ? "line" : ""
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
            {props.maze.mazeMap[0]?.map((row, index) => (
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
