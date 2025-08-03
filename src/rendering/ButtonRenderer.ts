export class ButtonRenderer {
  private ctx: CanvasRenderingContext2D;

  constructor(ctx: CanvasRenderingContext2D) {
    this.ctx = ctx;
  }

  drawArrowButtons(center: { x: number; y: number }, staffSpacing: number) {
    const buttonWidth = staffSpacing;
    const buttonHeight = staffSpacing * 1.5;
    const spacing = staffSpacing * 0.5;
    const shadowOffset = 2;

    const drawArrow = (
      isUp: boolean,
      x: number,
      y: number,
      width: number,
      height: number
    ) => {
      const gradient = this.ctx.createLinearGradient(
        x,
        y - height / 2,
        x,
        y + height / 2
      );
      gradient.addColorStop(0, "#a8e063");
      gradient.addColorStop(1, "#56ab2f");

      this.ctx.save();
      this.ctx.shadowColor = "rgba(0, 0, 0, 0.3)";
      this.ctx.shadowBlur = 4;
      this.ctx.shadowOffsetX = shadowOffset;
      this.ctx.shadowOffsetY = shadowOffset;

      this.ctx.beginPath();
      if (isUp) {
        this.ctx.moveTo(x, y - height / 2);
        this.ctx.lineTo(x - width / 2, y + height / 2);
        this.ctx.lineTo(x + width / 2, y + height / 2);
      } else {
        this.ctx.moveTo(x, y + height / 2);
        this.ctx.lineTo(x - width / 2, y - height / 2);
        this.ctx.lineTo(x + width / 2, y - height / 2);
      }
      this.ctx.closePath();

      this.ctx.fillStyle = gradient;
      this.ctx.fill();
      this.ctx.lineWidth = 1.5;
      this.ctx.strokeStyle = "#333";
      this.ctx.stroke();

      this.ctx.restore();
    };

    const drawCheckmark = (x: number, y: number, size: number) => {
      this.ctx.save();
      this.ctx.strokeStyle = "#28a745"; // green
      this.ctx.lineWidth = 6;
      this.ctx.lineCap = "round";

      this.ctx.beginPath();
      this.ctx.moveTo(x - size * 0.4, y + size * 0.1);
      this.ctx.lineTo(x - size * 0.1, y + size * 0.4);
      this.ctx.lineTo(x + size * 0.5, y - size * 0.3);
      this.ctx.stroke();

      this.ctx.restore();
    };

    // Draw up and down arrows
    drawArrow(true, center.x, center.y, buttonWidth, buttonHeight);
    const downCenterY = center.y + buttonHeight + spacing;
    drawArrow(false, center.x, downCenterY, buttonWidth, buttonHeight);

    // Draw checkmark to the right of arrows
    const checkmarkSize = staffSpacing * 1.2;
    const checkmarkX = center.x + buttonWidth + spacing * 2;
    const checkmarkY = center.y + buttonHeight * 0.5;

    drawCheckmark(checkmarkX, checkmarkY, checkmarkSize);
  }

  eraseArrowButtons(center: { x: number; y: number }, staffSpacing: number) {
    const buttonWidth = staffSpacing;
    const buttonHeight = staffSpacing * 1.5;
    const spacing = staffSpacing * 0.5;
    const checkmarkSize = staffSpacing * 1.2;
    const totalHeight = buttonHeight * 2 + spacing;

    const padding = 10;

    const rightMost =
      center.x + buttonWidth + spacing * 2 + checkmarkSize + padding;

    this.ctx.clearRect(
      center.x - buttonWidth / 2 - padding,
      center.y - buttonHeight / 2 - padding,
      rightMost - (center.x - buttonWidth / 2 - padding),
      totalHeight + padding * 2
    );
  }
}
