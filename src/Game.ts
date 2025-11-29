import GameCanvas from "./GameCanvas";

export default class Game {
  level: (string | undefined)[][];

  canvas: GameCanvas;

  camera: Position;

  constructor() {
    this.level = new Array(9)
      .fill(1)
      .map((_, row) =>
        new Array(16).fill(1).map(() => (row == 8 ? "ground" : undefined))
      );

    this.canvas = new GameCanvas(this);

    this.camera = { x: 0, y: 7 };

    requestAnimationFrame(() => this.frame());
  }

  frame() {
    this.canvas.frame();
    requestAnimationFrame(() => this.frame());
  }
}
