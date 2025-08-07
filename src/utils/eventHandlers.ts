// src/utils/eventHandlers.ts
import { ScoreController } from "../controllers/ScoreController.js";
import { defaultStaffConfig } from "../layout/index.js";

let currentListener: ((e: MouseEvent) => void) | null = null;

export function registerCanvasEvents(
  canvas: HTMLCanvasElement,
  controller: ScoreController,
  onConfirm: () => void
): void {
  unregisterCanvasEvents(canvas); // ensure no duplicates

  currentListener = (event: MouseEvent) => {
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    const spacing = defaultStaffConfig.spacing;

    if (controller.buttonLayouter.isInTopArrow(x, y, spacing)) {
      console.log("top arrow clicked");
      controller.updateLastNote(1);
    } else if (controller.buttonLayouter.isInBottomArrow(x, y, spacing)) {
      console.log("bottom arrow clicked");
      controller.updateLastNote(-1);
    } else if (controller.buttonLayouter.isInCheckmark(x, y, spacing)) {
      console.log("check clicked");
      controller.confirmNote();
      onConfirm(); // notify GameController that turn is over
    }
  };

  canvas.addEventListener("click", currentListener);
}

export function unregisterCanvasEvents(canvas: HTMLCanvasElement): void {
  if (currentListener) {
    canvas.removeEventListener("click", currentListener);
    currentListener = null;
  }
}
