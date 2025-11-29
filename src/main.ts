import "./style.css";

class GameCanvas {
  element: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;

  constructor() {
    this.element = document.createElement("canvas");
    this.ctx = this.element.getContext("2d")!;

    requestAnimationFrame(() => this.frame());
  }

  frame() {
    this.element.width = window.innerWidth;
    this.element.height = window.innerHeight;

    this.ctx.reset();
    this.ctx.fillStyle = "red";
    this.ctx.fillRect(
      window.innerWidth / 2 - 50,
      window.innerHeight / 2 - 50,
      100,
      100
    );

    requestAnimationFrame(() => this.frame());
  }
}

const app = document.querySelector<HTMLDivElement>("#app")!;
const gameCanvas = new GameCanvas();
app.appendChild(gameCanvas.element);
