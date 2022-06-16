export interface Xy {
  x: number,
  y: number
}

interface MazeMap {
  item: boolean;
  index: number;
}

export interface RowCol {
  row: number;
  col: number;
}

export interface MazeGameType {
  score: number;
  time: number;
  started: boolean;
  point: number;
  points: Array<Xy>;
  mazeMap: Array<Array<MazeMap>>;
  recent: Array<Xy>;
  end: Xy;
  start: Xy;
  coordinate: Xy;
}