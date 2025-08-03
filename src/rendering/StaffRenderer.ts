import { Line } from "./Line.js";
import { Renderer } from "./Renderer.js";
import { defaultStaffConfig, StaffConfig } from "../layout/index.js";

export class StaffRenderer {
  constructor(private renderer: Renderer) {}

  public drawStaff(top: number, isAnimated = true, drawClef = false): void {
    const ctx = this.renderer.ctx;
    ctx.fillStyle = "black";
    ctx.textAlign = "left";
    ctx.textBaseline = "middle";

    const originalTop = top; // save starting top for brace positioning

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
      const clefSymbol = h == 0 ? "𝄞" : "𝄢";
      const clefY =
        h == 0
          ? top + defaultStaffConfig.spacing * 2.5
          : top + defaultStaffConfig.spacing * 2.2;
      const clefX = defaultStaffConfig.upperLeftCorner.x;
      if (drawClef) {
        ctx.fillText(clefSymbol, clefX, clefY);
      }

      // Move down for the second staff in the grand staff
      top +=
        5 * defaultStaffConfig.spacing + defaultStaffConfig.grandStaffSpacing;
    }
    if (drawClef) {
      // Draw vertically stretched curly brace
      const braceX =
        defaultStaffConfig.upperLeftCorner.x - defaultStaffConfig.spacing * 1.5;
      const braceY = originalTop;
      const braceHeight =
        top - originalTop - defaultStaffConfig.grandStaffSpacing * 1.5;

      ctx.save(); // Save canvas state

      ctx.translate(braceX, braceY);
      ctx.scale(1, braceHeight / (defaultStaffConfig.spacing * 5)); // stretch vertically

      ctx.font = `${defaultStaffConfig.spacing * 5}px serif`;
      ctx.textAlign = "center";
      ctx.textBaseline = "top";
      ctx.fillText("{", 0, 0);

      ctx.restore(); // Restore canvas state
    }
  }
}
