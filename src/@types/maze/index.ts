import { MazeGameType, rowCol } from "../mazeGame";
import React from "react";

export interface mazeProps {
  maze: MazeGameType;
  setMaze: React.Dispatch<React.SetStateAction<MazeGameType>>;
  rowCol: rowCol;
  move: (direction: string) => void;
}
