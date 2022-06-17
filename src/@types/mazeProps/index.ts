import { MazeGameType, RowCol } from "../mazeGame";
import React from "react";


export interface mazeProps {
  maze: MazeGameType;
  setMaze: React.Dispatch<React.SetStateAction<MazeGameType>>;
  rowCol: RowCol;
  move: (direction: string) => void;
}
