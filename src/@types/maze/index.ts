import { mazeGame, rowCol } from "../mazeGame"
import React from "react";

export interface mazeProps {
  maze: mazeGame;
  setMaze: React.Dispatch<React.SetStateAction<mazeGame>>;
  rowCol: rowCol;
  move: (direction: string) => void;
}