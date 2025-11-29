import type Game from "./Game";

export default class GameCanvas {
  game: Game;

  element: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;

  tileSize = (16 / 1) * 4;

  constructor(game: Game) {
    this.game = game;

    this.element = document.createElement("canvas");
    this.ctx = this.element.getContext("2d")!;

    requestAnimationFrame(() => this.frame());
  }

  frame() {
    this.element.width = 1920;
    this.element.height = 1080;
    this.ctx.reset();
    this.ctx.imageSmoothingEnabled = false;

    for (const [rowIndex, row] of this.game.level.entries()) {
      for (const [columnIndex, tile] of row.entries()) {
        if (tile == undefined) continue;

        const image = new Image();
        image.src = `assets/ground.png`;
        this.ctx.drawImage(
          image,
          0,
          0,
          16,
          16,
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
