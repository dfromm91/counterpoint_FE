import { defaultStaffConfig } from "../layout/index.js";
import { Renderer } from "./Renderer.js";
import { Line } from "./Line.js";
export class NoteRenderer {
  constructor(
    private ctx: CanvasRenderingContext2D,
    private renderer: Renderer
  ) {}

  drawWholeNote(
    x: number,
    y: number,
    spacing: number,
    clef = "treble",
    offsetY: number = 0
  ): void {
    function getLedgerLines(): Line[] {
      const ledgerLines: Line[] = [];
      let topLine;
      if (clef == "treble") {
        topLine = offsetY;
      } else {
        topLine =
          defaultStaffConfig.upperLeftCorner.y +
          offsetY +
          defaultStaffConfig.spacing +
          defaultStaffConfig.grandStaffSpacing;
      }
      const bottomLine = 5 * defaultStaffConfig.spacing + topLine;
      let tl = topLine;
      let bl = bottomLine;
      let i = y;
      if (i < tl) {
        while (i < tl) {
          i += defaultStaffConfig.spacing;

          ledgerLines.push(
            new Line(
              x - 1.8 * outerRadiusX,
              i,
              x + 1.8 * outerRadiusX,
              i,
              defaultStaffConfig.lineThickness,
              "black"
            )
          );
        }
      }
      if (i > bl) {
        top;
        while (i > bl) {
          i -= defaultStaffConfig.spacing;

          ledgerLines.push(
            new Line(
              x - 1.8 * outerRadiusX,
              i,
              x + 1.8 * outerRadiusX,
              i,
              defaultStaffConfig.lineThickness,
              "black"
            )
          );
        }
      }

      return ledgerLines;
    }
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
    this.ctx.fillStyle = "black";
    const top = defaultStaffConfig.upperLeftCorner.y;
    if (clef == "treble") {
      if (Number.isInteger((y - top) / defaultStaffConfig.spacing)) {
        this.renderer.drawLine(
          new Line(
            x - 1.8 * outerRadiusX,
            y,
            x + 1.8 * outerRadiusX,
            y,
            defaultStaffConfig.lineThickness,
            "black"
          )
        );
      }
    } else {
      if (
        Number.isInteger(
          (y - top - defaultStaffConfig.grandStaffSpacing) /
            defaultStaffConfig.spacing
        )
      ) {
        this.renderer.drawLine(
          new Line(
            x - 1.8 * outerRadiusX,
            y,
            x + 1.8 * outerRadiusX,
            y,
            defaultStaffConfig.lineThickness,
            "black"
          )
        );
      }
    }

    getLedgerLines().forEach((line) => {
      this.renderer.drawLine(line);
    });
  }
}
