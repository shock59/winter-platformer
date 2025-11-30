import GameCanvas from "./GameCanvas";
import tiles from "./tiles";
import overlapping from "./overlapping";

export default class Game {
  level: (AtlasPosition[] | undefined)[][];
  canvas: GameCanvas;
  camera: Position;
  playerSize = {
    width: 0.8,
    height: 0.8,
  };

  movementAxis: number = 0;
  speed = 0.01;

  gravity: number = 0;
  gravitySpeed = 0.005;

  lastTime: number;

  constructor() {
    this.level = new Array(9)
      .fill(1)
      .map((_, row) =>
        new Array(16)
          .fill(1)
          .map(() => (row == 8 ? tiles.groundMiddle : undefined))
      );
    this.level[7][15] = tiles.flag;

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

    if (this.onGround()) {
      this.gravity = 0;
      this.camera.y =
        Math.floor(this.camera.y) + (1 - this.playerSize.height) / 2;
    } else {
      this.gravity -= this.gravitySpeed;
      this.camera.y -= this.gravity;
    }

    this.canvas.frame(delta);

    requestAnimationFrame(() => this.frame());
  }

  onGround() {
    const floorRow = Math.floor(this.camera.y + 1);
    if (this.level[floorRow] === undefined) return false;

    const halfPlayerWidth = this.playerSize.width / 2;
    const rowEdges: [number, number] = [
      this.camera.x - halfPlayerWidth,
      this.camera.x + halfPlayerWidth,
    ];
    let groundRange: number[] = [];
    for (let column = 0; column < this.level[0].length; column++) {
      const columnEdges: [number, number] = [column - 0.5, column + 0.5];
      if (overlapping(rowEdges, columnEdges)) groundRange.push(column);
    }

    const tiles = groundRange.map((column) => this.level[floorRow][column]);
    if (!tiles.find((tile) => tile !== undefined)) return false;

    const bottomEdge = this.camera.y + this.playerSize.height / 2;
    return bottomEdge >= floorRow - 0.5 && bottomEdge <= floorRow + 0.5;
  }

  keyDown(event: KeyboardEvent) {
    if (event.key == "ArrowRight") this.movementAxis = 1;
    else if (event.key == "ArrowLeft") this.movementAxis = -1;
  }

  keyUp(event: KeyboardEvent) {
    if (["ArrowRight", "ArrowLeft"].includes(event.key)) this.movementAxis = 0;
  }
}
