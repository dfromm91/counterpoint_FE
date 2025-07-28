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
      top +=
        5 * defaultStaffConfig.spacing + defaultStaffConfig.grandStaffSpacing;
    }
  }
}
