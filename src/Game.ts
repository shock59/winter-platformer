import GameCanvas from "./GameCanvas";
import tiles from "./tiles";
import overlapping from "./overlapping";

export default class Game {
  level: (AtlasPosition[] | undefined)[][];
  canvas: GameCanvas;

  playerPosition: Position;
  playerSize = {
    width: 0.8,
    height: 0.8,
  };

  movementAxis: number = 0;
  movementKeysDown: string[] = [];
  movementMomentum: number = 0;
  movementBuildSpeed = 0.00006;
  movementMaxSpeed = 0.01;

  jumpQueued: boolean = false;
  jumpHeight = 0.18;
  gravity: number = 0;
  gravitySpeed = 0.005;

  lastTime: number;

  constructor() {
    this.level = [
      ...new Array(7).fill(new Array(20).fill(undefined)),
      [
        ...new Array(15).fill(undefined),
        tiles.flag,
        ...new Array(4).fill(undefined),
      ],
      [
        tiles.groundLeft,
        ...new Array(18).fill(tiles.groundMiddle),
        tiles.groundRight,
      ],
      ...new Array(7).fill(new Array(20).fill(tiles.groundBottom)),
    ];
    this.level[7][15] = tiles.flag;

    this.canvas = new GameCanvas(this);

    this.playerPosition = { x: 0, y: 7 };

    document.addEventListener("keydown", (e) => this.keyDown(e));
    document.addEventListener("keyup", (e) => this.keyUp(e));

    this.lastTime = Date.now();
    requestAnimationFrame(() => this.frame());
  }

  frame() {
    const delta = Date.now() - this.lastTime;
    this.lastTime = Date.now();

    this.movementAxis = 0;
    if (this.movementKeysDown.includes("ArrowRight")) this.movementAxis += 1;
    if (this.movementKeysDown.includes("ArrowLeft")) this.movementAxis -= 1;

    if (this.movementAxis != 0) {
      this.movementMomentum +=
        this.movementAxis * this.movementBuildSpeed * delta;
      if (Math.abs(this.movementMomentum) >= this.movementMaxSpeed) {
        this.movementMomentum =
          this.movementMaxSpeed *
          (this.movementMomentum / Math.abs(this.movementMomentum));
      }
    } else if (this.movementMomentum != 0) {
      const startingAxis =
        this.movementMomentum / Math.abs(this.movementMomentum);
      this.movementMomentum -= this.movementBuildSpeed * startingAxis * delta;
      if (
        this.movementMomentum / Math.abs(this.movementMomentum) !=
        startingAxis
      ) {
        this.movementMomentum = 0;
      }
    }

    this.playerPosition.x += this.movementMomentum * delta;

    if (this.onGround()) {
      this.gravity = 0;
      this.playerPosition.y =
        Math.floor(this.playerPosition.y) + (1 - this.playerSize.height) / 2;
      if (this.jumpQueued) this.gravity = this.jumpHeight;
    } else {
      this.gravity -= this.gravitySpeed;
    }
    this.jumpQueued = false;
    this.playerPosition.y -= this.gravity;

    this.canvas.frame(delta);

    requestAnimationFrame(() => this.frame());
  }

  onGround() {
    const floorRow = Math.floor(this.playerPosition.y + 1);
    if (this.level[floorRow] === undefined) return false;

    const halfPlayerWidth = this.playerSize.width / 2;
    const rowEdges: [number, number] = [
      this.playerPosition.x - halfPlayerWidth,
      this.playerPosition.x + halfPlayerWidth,
    ];
    let groundRange: number[] = [];
    for (let column = 0; column < this.level[0].length; column++) {
      const columnEdges: [number, number] = [column - 0.5, column + 0.5];
      if (overlapping(rowEdges, columnEdges)) groundRange.push(column);
    }

    const tiles = groundRange.map((column) => this.level[floorRow][column]);
    if (!tiles.find((tile) => tile !== undefined)) return false;

    const bottomEdge = this.playerPosition.y + this.playerSize.height / 2;
    return bottomEdge >= floorRow - 0.5 && bottomEdge <= floorRow + 0.5;
  }

  keyDown(event: KeyboardEvent) {
    if (
      ["ArrowRight", "ArrowLeft"].includes(event.key) &&
      !this.movementKeysDown.includes(event.key)
    ) {
      this.movementKeysDown.push(event.key);
    } else if (event.key == "c") this.jumpQueued = true;
  }

  keyUp(event: KeyboardEvent) {
    if (["ArrowRight", "ArrowLeft"].includes(event.key)) {
      this.movementKeysDown.splice(this.movementKeysDown.indexOf(event.key), 1);
    }
  }
}
