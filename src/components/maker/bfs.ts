import { MazeMap, Xy } from "../../@types/mazeGame";


const mazeMaker = (x: number, y: number, MAX_X: number, MAX_Y: number): {points:Xy[], visited:boolean[][]} => {
  const points: Xy[] = [];
  const queue: Xy[] = [];
  let flag: boolean = true;
  const visited: boolean[][] = new Array(MAX_Y)
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

const mazeMover = (
  x: number,
  y: number,
  MAX_X: number,
  MAX_Y: number,
  mazeMap: MazeMap[][],
  targetX: number,
  targetY: number
): Xy[] | boolean => {
  const queue: Xy[] = [];
  const route: Xy[][] = [];
  const success: Xy[] = [];
  let phase = 0;
  let flag = true;
  const visited = mazeMap.map((row) => row.map((v) => !v.item));
  queue.push({ x: x, y: y });
  visited[y][x] = true;

  const check = (x: number, y: number) => {
    if (x >= 0 && y >= 0 && MAX_X > x && MAX_Y > y && !visited[y][x]) {
      return { x: x, y: y, r: true };
    } else {
      return { x: x, y: y, r: false };
    }
  };
  if (!mazeMap[y][x].item) {
    return false;
  }
  while (flag) {
    const length = queue.length;
    if (length < 1) {
      return false;
    }
    for (let k = 0; k < length; k++) {
      const shifted = queue.shift();
      if (!shifted) {
        break;
      }
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
        console.log(phase, { x: result[j].x, y: result[j].y });

        queue.push({ x: result[j].x, y: result[j].y });
        visited[result[j].y][result[j].x] = true;
      }
      console.log(route[phase]);
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
  return success;
};

export {
  mazeMaker,
  mazeMover
};