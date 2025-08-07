// eventHandlers.ts
import { ScoreController } from "../controllers/ScoreController.js";
import { defaultStaffConfig } from "../layout/index.js";

export function registerCanvasEvents(
  canvas: HTMLCanvasElement,
  controller: ScoreController
) {
  canvas.addEventListener("click", (event: MouseEvent) => {
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    if (
      controller.buttonLayouter.isInTopArrow(x, y, defaultStaffConfig.spacing)
    ) {
      console.log("top arrow clicked");
      controller.updateLastNote(1);
    }
    if (
      controller.buttonLayouter.isInBottomArrow(
        x,
        y,
        defaultStaffConfig.spacing
      )
    ) {
      console.log("bottom arrow clicked");
      controller.updateLastNote(-1);
    }
    if (
      controller.buttonLayouter.isInCheckmark(x, y, defaultStaffConfig.spacing)
    ) {
      console.log("check clicked");
      controller.confirmNote();
    }
  });
}
