// src/utils/eventHandlers.ts
import { ScoreController } from "../controllers/ScoreController.js";
import { defaultStaffConfig } from "../layout/index.js";

let currentListener: ((e: MouseEvent) => void) | null = null;
let isRegistered = false;

export function registerCanvasEvents(
  canvas: HTMLCanvasElement,
  controller: ScoreController,
  onConfirm: () => void,
  socket: any,
  roomId: string
): void {
  if (isRegistered) return; // guard against duplicates

  // remove any old listener just in case
  unregisterCanvasEvents(canvas);

  currentListener = (event: MouseEvent) => {
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    const spacing = defaultStaffConfig.spacing;

    if (controller.buttonLayouter.isInTopArrow(x, y, spacing)) {
      controller.updateLastNote(1);
      socket.emit("update_note", { roomId, increment: 1 });
    } else if (controller.buttonLayouter.isInBottomArrow(x, y, spacing)) {
      controller.updateLastNote(-1);
      socket.emit("update_note", { roomId, increment: -1 });
    } else if (controller.buttonLayouter.isInCheckmark(x, y, spacing)) {
      controller.confirmNote();
      socket.emit("confirm_note", { roomId });
      onConfirm();
    }
  };

  canvas.addEventListener("pointerup", currentListener);
  isRegistered = true; // ✅ set it!
}

export function unregisterCanvasEvents(canvas: HTMLCanvasElement): void {
  if (currentListener) {
    canvas.removeEventListener("pointerup", currentListener);
    currentListener = null;
  }
  isRegistered = false; // ✅ reset it!
}
