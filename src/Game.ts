import GameCanvas from "./GameCanvas";
import tiles from "./tiles";
import overlapping from "./overlapping";
import setCameraOffset from "./setCameraOffset";
import { background, level } from "./level";

export default class Game {
  level: Level;
  background: Level;
  canvas: GameCanvas;

  playerPosition: Position;
  playerSize = {
    width: 0.8,
    height: 0.8,
  };

  cameraOffset: Position = {
    x: 0,
    y: 0,
  };
  cameraBounds = {
    x: {
      min: -2,
      max: 220,
    },
    y: {
      min: -20,
      max: 7.5,
    },
  };

  movementAxis: number = 0;
  movementKeysDown: string[] = [];
  movementMomentum: number = 0;
  movementBuildSpeed = 0.00006;
  movementMaxSpeed = 0.01;

  jumpQueued: boolean = false;
  jumpHeight = 0.18;
  gravity: number = 0;
  gravitySpeed = 0.0008;

  lastTime: number;
  gameRunning: boolean = true;

  constructor() {
    this.level = level;
    this.background = background;

    this.canvas = new GameCanvas(this);

    this.playerPosition = { x: 1, y: 6 };

    document.addEventListener("keydown", (e) => this.keyDown(e));
    document.addEventListener("keyup", (e) => this.keyUp(e));

    alert(
      "Welcome to winter platformer!\n\nControls:\nLeft and Right arrows to move\nC to jump"
    );

    this.lastTime = Date.now();
    requestAnimationFrame(() => this.frame());
  }

  frame() {
    if (!this.gameRunning) return;

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

    const halfPlayerWidth = this.playerSize.width / 2;
    const playerHorizontalEdges: [number, number] = [
      this.playerPosition.x - halfPlayerWidth,
      this.playerPosition.x + halfPlayerWidth,
    ];
    let groundRange: number[] = [];
    for (let column = 0; column < this.level[0].length; column++) {
      const columnEdges: [number, number] = [column - 0.5, column + 0.5];
      if (overlapping(playerHorizontalEdges, columnEdges))
        groundRange.push(column);
    }

    const halfPlayerHeight = this.playerSize.height / 2;
    const playerVerticalEdges: [number, number] = [
      this.playerPosition.y - halfPlayerHeight + 0.1,
      this.playerPosition.y + halfPlayerHeight - 0.5,
    ];
    for (const column of groundRange) {
      for (let row = 0; row < this.level.length; row++) {
        const tile = this.level[row][column];
        if (tile == undefined) continue;
        const tileVerticalEdges: [number, number] = [row - 0.5, row + 0.5];
        if (overlapping(playerVerticalEdges, tileVerticalEdges)) {
          if (tile[0] == tiles.flag[0]) {
            alert("You win!");
            this.gameRunning = false;
          } else {
            if (this.movementMomentum > 0)
              this.playerPosition.x = column - 0.5 - halfPlayerWidth;
            else if (this.movementMomentum < 0)
              this.playerPosition.x = column + 0.5 + halfPlayerWidth;
            this.movementMomentum = 0;
          }
        }
      }
    }

    if (this.onGround()) {
      if (this.gravity < 0) this.gravity = 0;
      this.playerPosition.y =
        Math.floor(this.playerPosition.y) + (1 - this.playerSize.height) / 2;
      if (this.jumpQueued) this.gravity = this.jumpHeight;
    } else {
      this.gravity -= this.gravitySpeed * delta;
    }
    this.jumpQueued = false;
    this.playerPosition.y -= this.gravity;

    const halfViewDimensions = this.canvas.viewDimensions.map(
      (dimension) => dimension / 2
    );
    this.cameraOffset = {
      x: setCameraOffset(
        this.playerPosition.x,
        halfViewDimensions[0],
        this.cameraBounds.x
      ),
      y: setCameraOffset(
        this.playerPosition.y,
        halfViewDimensions[1],
        this.cameraBounds.y
      ),
    };
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

    const aboveRow =
      this.level[floorRow - 1] ??
      new Array(this.level[0].length).fill(undefined);
    const tiles = groundRange.map((column) =>
      aboveRow[column] == undefined ? this.level[floorRow][column] : undefined
    );
    if (!tiles.find((tile) => tile !== undefined)) return false;

    const bottomEdge = this.playerPosition.y + this.playerSize.height / 2;
    return bottomEdge >= floorRow - 0.5 && bottomEdge <= floorRow - 0.2;
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
