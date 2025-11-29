import GameCanvas from "./GameCanvas";

export default class Game {
  level: (string | undefined)[][];
  canvas: GameCanvas;

  constructor() {
    this.level = new Array(9)
      .fill(1)
      .map((_, row) =>
        new Array(16).fill(1).map(() => (row == 8 ? "ground" : undefined))
      );

    this.canvas = new GameCanvas(this);
  }
}
