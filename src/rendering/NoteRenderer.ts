import { defaultStaffConfig } from "../layout/index.js";
import { Renderer } from "./Renderer.js";
import { Line } from "./Line.js";
export class NoteRenderer {
  constructor(
    private ctx: CanvasRenderingContext2D,
    private renderer: Renderer
  ) {}

  drawWholeNote(x: number, y: number, spacing: number): void {
    const outerRadiusX = spacing * 0.6;
    const outerRadiusY = spacing * 0.5;
    const innerRadiusX = spacing * 0.43;
    const innerRadiusY = spacing * 0.25;

    this.ctx.beginPath();
    this.ctx.ellipse(x, y, outerRadiusX, outerRadiusY, 0, 0, 2 * Math.PI);
    this.ctx.fillStyle = "black";
    this.ctx.fill();

    this.ctx.beginPath();
    this.ctx.ellipse(x, y, innerRadiusX, innerRadiusY, 0.9, 0, 2 * Math.PI);
    this.ctx.fillStyle = "white";

    this.ctx.fill();
    const top = defaultStaffConfig.upperLeftCorner.y;
    if (Number.isInteger((y - top) / defaultStaffConfig.spacing)) {
      this.renderer.drawLine(
        new Line(
          x - outerRadiusX / 2,
          y,
          x + outerRadiusX / 2,
          y,
          defaultStaffConfig.lineThickness,
          "black"
        )
      );
    }
  }
}
