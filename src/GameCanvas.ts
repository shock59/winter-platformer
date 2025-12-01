import type Game from "./Game";
import tiles from "./tiles";

export default class GameCanvas {
  game: Game;

  element: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  image: HTMLImageElement;

  tileSize = 16;
  viewDimensions = [16, 9];

  animationFrame: number = 0;
  animationSpeed = 125; // ms per frame

  snowflakes: Position[] = [];
  nextSnowflakeSpawnFrame: number = 1;

  constructor(game: Game) {
    this.game = game;

    this.element = document.createElement("canvas");
    this.ctx = this.element.getContext("2d")!;

    this.image = new Image();
    this.image.src = "assets/atlas.png";
  }

  frame(delta: number) {
    const minDimension = [
      [window.innerWidth, this.viewDimensions[0]],
      [window.innerHeight, this.viewDimensions[1]],
    ].toSorted((a, b) => a[0] / a[1] - b[0] / b[1])[0];

    const scale = Math.floor(minDimension[0] / minDimension[1]);

    this.element.width = scale * this.viewDimensions[0];
    this.element.height = scale * this.viewDimensions[1];

    this.ctx.reset();
    this.ctx.imageSmoothingEnabled = false;

    this.animationFrame += delta / this.animationSpeed;

    if (this.animationFrame > this.nextSnowflakeSpawnFrame) {
      this.nextSnowflakeSpawnFrame += Math.floor(Math.random() * 5 + 10);
      this.snowflakes.push({ x: Math.random() * this.viewDimensions[0], y: 0 });
    }
    for (const snowflakeIndex in this.snowflakes) {
      const snowflake = this.snowflakes[snowflakeIndex];

      this.ctx.drawImage(
        this.image,
        ...tiles.snowflake[0],
        this.tileSize,
        this.tileSize,
        snowflake.x * scale,
        snowflake.y * scale,
        scale,
        scale
      );

      this.snowflakes[snowflakeIndex].y += delta / 500;
    }

    this.drawLevel(this.game.background, scale);
    this.drawLevel(this.game.level, scale);

    const image = new Image();
    image.src = `assets/player.png`;
    this.ctx.drawImage(
      image,
      (this.viewDimensions[0] / 2 -
        this.game.playerSize.width / 2 -
        this.game.cameraOffset.x) *
        scale,
      (this.viewDimensions[1] / 2 -
        this.game.playerSize.height / 2 -
        this.game.cameraOffset.y) *
        scale,
      scale * this.game.playerSize.width,
      scale * this.game.playerSize.height
    );
  }

  drawLevel(level: Level, scale: number) {
    for (const [rowIndex, row] of level.entries()) {
      for (const [columnIndex, tile] of row.entries()) {
        if (tile == undefined) continue;

        const animationFrame =
          tile[Math.floor(this.animationFrame) % tile.length];
        this.ctx.drawImage(
          this.image,
          animationFrame[0],
          animationFrame[1],
          this.tileSize,
          this.tileSize,
          (columnIndex -
            this.game.playerPosition.x -
            this.game.cameraOffset.x +
            this.viewDimensions[0] / 2 -
            0.5) *
            scale,
          (rowIndex -
            this.game.playerPosition.y -
            this.game.cameraOffset.y +
            this.viewDimensions[1] / 2 -
            0.5) *
            scale,
          scale * 1.005,
          scale * 1.005
        );
      }
    }
  }
}
