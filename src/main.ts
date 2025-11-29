import GameCanvas from "./GameCanvas";
import "./style.css";

const app = document.querySelector<HTMLDivElement>("#app")!;
const gameCanvas = new GameCanvas();
app.appendChild(gameCanvas.element);
