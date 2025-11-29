import type Game from "./Game";

export default class GameCanvas {
  game: Game;

  element: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;

  tileSize = 16;
  viewDimensions = [16, 9];

  constructor(game: Game) {
    this.game = game;

    this.element = document.createElement("canvas");
    this.ctx = this.element.getContext("2d")!;
  }

  frame() {
    const minDimension = [
      [window.innerWidth, this.viewDimensions[0]],
      [window.innerHeight, this.viewDimensions[1]],
    ].toSorted((a, b) => a[0] / a[1] - b[0] / b[1])[0];

    const scale = Math.floor(minDimension[0] / minDimension[1]);

    this.element.width = scale * this.viewDimensions[0];
    this.element.height = scale * this.viewDimensions[1];

    this.ctx.reset();
    this.ctx.imageSmoothingEnabled = false;

    for (const [rowIndex, row] of this.game.level.entries()) {
      for (const [columnIndex, tile] of row.entries()) {
        if (tile == undefined) continue;

        const image = new Image();
        image.src = `assets/${tile}.png`;
        this.ctx.drawImage(
          image,
          (columnIndex - this.game.camera.x + this.viewDimensions[0] / 2 - 1) *
            scale,
          (rowIndex - this.game.camera.y + this.viewDimensions[1] / 2 + 0) *
            scale,
          scale,
          scale
        );
      }
    }

    const image = new Image();
    image.src = `assets/player.png`;
    this.ctx.drawImage(
      image,
      (this.viewDimensions[0] / 2 - 1) * scale,
      (this.viewDimensions[1] / 2 + 0) * scale,
      scale,
      scale
    );
  }
}
