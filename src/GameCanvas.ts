import type Game from "./Game";

export default class GameCanvas {
  game: Game;

  element: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;

  tileSize = 32;

  constructor(game: Game) {
    this.game = game;

    this.element = document.createElement("canvas");
    this.ctx = this.element.getContext("2d")!;

    requestAnimationFrame(() => this.frame());
  }

  frame() {
    this.element.width = window.innerWidth;
    this.element.height = window.innerHeight;

    this.ctx.reset();
    for (const [rowIndex, row] of this.game.level.entries()) {
      for (const [columnIndex, tile] of row.entries()) {
        this.ctx.fillStyle = tile;
        this.ctx.fillRect(
          columnIndex * this.tileSize,
          rowIndex * this.tileSize,
          this.tileSize,
          this.tileSize
        );
      }
    }

    requestAnimationFrame(() => this.frame());
  }
}
