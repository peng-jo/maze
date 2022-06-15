export interface xy {
  x: number,
  y: number
}

interface mazeMap {
  item: boolean;
  index: number;
}

export interface rowCol {
  row: number;
  col: number;
}

export interface MazeGameType {
  score: number;
  time: number;
  started: boolean;
  point: number;
  points: Array<xy>;
  mazeMap: Array<Array<mazeMap>>;
  recent: Array<xy>;
  end: xy;
  start: xy;
  coordinate: xy;
}