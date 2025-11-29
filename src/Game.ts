import GameCanvas from "./GameCanvas";

const colors = ["red", "orange", "yellow", "green", "blue", "purple"];

export default class Game {
  level: string[][];
  canvas: GameCanvas;

  constructor() {
    this.level = new Array(16)
      .fill(1)
      .map((_, row) =>
        new Array(16)
          .fill(1)
          .map((_, column) => colors[(row * 16 + column) % colors.length])
      );

    this.canvas = new GameCanvas(this);
  }
}
