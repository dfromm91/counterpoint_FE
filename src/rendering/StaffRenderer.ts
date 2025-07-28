import { Line } from "./Line.js";
import { Renderer } from "./Renderer.js";
import { defaultStaffConfig, StaffConfig } from "../layout/index.js";

export class StaffRenderer {
  constructor(private renderer: Renderer) {}

  /**
   * Draws the five staff lines.
   * @param config    Configuration for staff metrics.
   * @param isAnimated  If true, uses animateLine; otherwise uses drawLine.
   */
  public drawStaff(top: number, isAnimated = true): void {
    const ctx = this.renderer.ctx; // make sure Renderer exposes this method

    ctx.textAlign = "left";
    ctx.textBaseline = "middle";

    for (let h = 0; h < 2; h++) {
      for (let i = 0; i < 5; i++) {
        const y = top + defaultStaffConfig.spacing * i;
        const line = new Line(
          defaultStaffConfig.upperLeftCorner.x,
          y,
          defaultStaffConfig.upperLeftCorner.x + defaultStaffConfig.width,
          y,
          defaultStaffConfig.lineThickness,
          "black"
        );

        if (isAnimated) {
          this.renderer.animateLine(line, 10);
        } else {
          this.renderer.drawLine(line);
        }
      }

      // Draw clef
      ctx.font =
        h == 0
          ? `${defaultStaffConfig.spacing * 7}px serif`
          : `${defaultStaffConfig.spacing * 6}px serif`;
      const clefSymbol = h == 0 ? "𝄞" : "𝄢"; // Treble or Bass
      const clefY =
        h == 0
          ? top + defaultStaffConfig.spacing * 2.5
          : top + defaultStaffConfig.spacing * 2.5; // middle line
      const clefX = defaultStaffConfig.upperLeftCorner.x;

      ctx.fillText(clefSymbol, clefX, clefY);

      // Move down for the second staff in the grand staff
      top +=
        5 * defaultStaffConfig.spacing + defaultStaffConfig.grandStaffSpacing;
    }
  }
}
