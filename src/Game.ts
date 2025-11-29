import GameCanvas from "./GameCanvas";

export default class Game {
  level: (string | undefined)[][];
  canvas: GameCanvas;
  camera: Position;
  playerSize = {
    width: 14,
    height: 14,
  };
  movementAxis: number = 0;
  speed = 0.01;
  lastTime: number;

  constructor() {
    this.level = new Array(9)
      .fill(1)
      .map((_, row) =>
        new Array(16).fill(1).map(() => (row == 8 ? "ground" : undefined))
      );

    this.canvas = new GameCanvas(this);

    this.camera = { x: 0, y: 7 };

    document.addEventListener("keydown", (e) => this.keyDown(e));
    document.addEventListener("keyup", (e) => this.keyUp(e));

    this.lastTime = Date.now();
    requestAnimationFrame(() => this.frame());
  }

  frame() {
    const delta = Date.now() - this.lastTime;
    this.lastTime = Date.now();

    this.camera.x += this.movementAxis * this.speed * delta;

    this.canvas.frame();

    requestAnimationFrame(() => this.frame());
  }

  onGround() {}

  keyDown(event: KeyboardEvent) {
    if (event.key == "ArrowRight") this.movementAxis = 1;
    else if (event.key == "ArrowLeft") this.movementAxis = -1;
  }

  keyUp(event: KeyboardEvent) {
    if (["ArrowRight", "ArrowLeft"].includes(event.key)) this.movementAxis = 0;
  }
}
