import { Xy } from "../../@types/mazeGame";

const bfs = (x: number, y: number, MAX_X: number, MAX_Y: number) => {
  const points: Xy[] = [];
  const queue: Xy[] = [];
  let flag: boolean = true;
  const visited:boolean[][] = new Array(MAX_Y)
    .fill(null)
    .map((v) => new Array(MAX_X).fill(false));
  queue.push({ x: x, y: y });
  visited[0][0] = true;
  const check = (x: number, y: number, dx: number, dy: number) => {
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
      break;
    }
    for (let k = 0; k < length; k++) {
      const shifted = queue.shift();
      if (shifted === undefined) {
        continue;
      }
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
        if (result === undefined) {
          continue;
        }
        for (let j = 0; j < result.length; j++) {
          if (result[j].x + 1 === MAX_X && result[j].y + 1 === MAX_Y) {
            flag = false;
          }

          if (j === 1 && 1 !== Math.floor(Math.random() * 10)) {
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
  return {
    points: points,
    visited: visited,
  };
};

export default bfs;