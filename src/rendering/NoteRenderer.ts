import { defaultStaffConfig } from "../layout/index.js";
import { Renderer } from "./Renderer.js";
import { Line } from "./Line.js";
export class NoteRenderer {
  constructor(
    private ctx: CanvasRenderingContext2D,
    private renderer: Renderer
  ) {}

  renderNote(
    x: number,
    y: number,
    spacing: number,
    clef = "treble",
    offsetY: number = 0,
    color: string
  ): void {
    function getLedgerLines(color: string): Line[] {
      const multiplier = color == "black" ? 1 : 1.5;
      const ledgerLines: Line[] = [];
      let topLine;
      if (clef == "treble") {
        topLine = offsetY;
      } else {
        topLine =
        
          offsetY +
          5*defaultStaffConfig.spacing +
          defaultStaffConfig.grandStaffSpacing;
      }
      const blMultiplier = clef=="treble"?4:5
      const bottomLine =  blMultiplier*defaultStaffConfig.spacing + topLine;
      let tl = topLine;
      let bl = bottomLine;
      let i = y;
      if (i < tl) {
        if (
          !Number.isInteger(
            tl -
              (i - defaultStaffConfig.upperLeftCorner.y) /
                defaultStaffConfig.spacing
          )
        ) {
              i -= 0.5 * defaultStaffConfig.spacing;
        }
        else{
           i-=defaultStaffConfig.spacing
        }
        while (i < tl) {
          i += defaultStaffConfig.spacing;

          ledgerLines.push(
            new Line(
              x - 1.8 * outerRadiusX * multiplier,
              i,
              x + 1.8 * outerRadiusX * multiplier,
              i,
              Math.round(defaultStaffConfig.lineThickness * multiplier),
              color
            )
          );
        }
      }
      if (i > bl) {
        
        if (
          !Number.isInteger(
            tl -
              (i - defaultStaffConfig.upperLeftCorner.y) /
                defaultStaffConfig.spacing
          )
        ) {
          
          i += 0.5 * defaultStaffConfig.spacing;
        }else{
       
          i+=defaultStaffConfig.spacing
        }
        while (i > bl) {
          i -= defaultStaffConfig.spacing;

          ledgerLines.push(
            new Line(
              x - 1.8 * outerRadiusX * multiplier,
              i,
              x + 1.8 * outerRadiusX * multiplier,
              i,
              Math.round(defaultStaffConfig.lineThickness * multiplier),
              color
            )
          );
        }
      }
    
      return ledgerLines;
    }
    const multiplier = color == "black" ? 1 : color=="gray"?1:1.15;
    const outerRadiusX = spacing * 0.6 * multiplier;
    const outerRadiusY = spacing * 0.5 * multiplier;
    const innerRadiusX = spacing * 0.43 * multiplier;
    const innerRadiusY = spacing * 0.25;

    this.ctx.beginPath();
    this.ctx.ellipse(x, y, outerRadiusX, outerRadiusY, 0, 0, 2 * Math.PI);
    this.ctx.fillStyle = color;
    this.ctx.fill();

    this.ctx.beginPath();
    this.ctx.ellipse(x, y, innerRadiusX, innerRadiusY, 0.9, 0, 2 * Math.PI);
    this.ctx.fillStyle = "white";

    this.ctx.fill();
    this.ctx.fillStyle = color;
    const top = defaultStaffConfig.upperLeftCorner.y;
   

    getLedgerLines(color).forEach((line) => {
      this.renderer.drawLine(line);
    });
    this.ctx.fillStyle = "black";
  }
  drawWholeNote(
    x: number,
    y: number,
    spacing: number,
    clef = "treble",
    offsetY: number = 0
  ) {
    this.renderNote(x, y, spacing, clef, offsetY, "black");
  }
  eraseWholeNote(
    x: number,
    y: number,
    spacing: number,
    clef = "treble",
    offsetY: number = 0
  ) {
    this.renderNote(x, y, spacing, clef, offsetY, "white");
  }
  selectWholeNote(
    x: number,
    y: number,
    spacing: number,
    clef = "treble",
    offsetY: number = 0
  ) {
    this.renderNote(x, y, spacing, clef, offsetY, "gray");
  }
}
