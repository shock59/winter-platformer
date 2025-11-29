import Game from "./Game";
import "./style.css";

const app = document.querySelector<HTMLDivElement>("#app")!;
const game = new Game();
app.appendChild(game.canvas.element);
