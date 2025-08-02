export class ButtonRenderer {
  private ctx: CanvasRenderingContext2D;

  constructor(ctx: CanvasRenderingContext2D) {
    this.ctx = ctx;
  }

  drawArrowButtons(center: { x: number; y: number }, staffSpacing: number) {
    const buttonWidth = staffSpacing;
    const buttonHeight = staffSpacing * 1.5;
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
      gradient.addColorStop(0, "#a8e063"); // light green
      gradient.addColorStop(1, "#56ab2f"); // darker green

      this.ctx.save();

      // Shadow
      this.ctx.shadowColor = "rgba(0, 0, 0, 0.3)";
      this.ctx.shadowBlur = 4;
      this.ctx.shadowOffsetX = shadowOffset;
      this.ctx.shadowOffsetY = shadowOffset;

      // Arrow
      this.ctx.beginPath();
      if (isUp) {
        this.ctx.moveTo(x, y - height / 2); // top point
        this.ctx.lineTo(x - width / 2, y + height / 2); // bottom left
        this.ctx.lineTo(x + width / 2, y + height / 2); // bottom right
      } else {
        this.ctx.moveTo(x, y + height / 2); // bottom point
        this.ctx.lineTo(x - width / 2, y - height / 2); // top left
        this.ctx.lineTo(x + width / 2, y - height / 2); // top right
      }
      this.ctx.closePath();

      this.ctx.fillStyle = gradient;
      this.ctx.fill();

      this.ctx.lineWidth = 1.5;
      this.ctx.strokeStyle = "#333";
      this.ctx.stroke();

      this.ctx.restore();
    };

    // Draw up arrow
    drawArrow(true, center.x, center.y, buttonWidth, buttonHeight);

    // Draw down arrow
    const downCenterY = center.y + buttonHeight + staffSpacing * 0.5;
    drawArrow(false, center.x, downCenterY, buttonWidth, buttonHeight);
  }
  eraseArrowButtons(center: { x: number; y: number }, staffSpacing: number) {
    const buttonWidth = staffSpacing;
    const buttonHeight = staffSpacing * 1.5;
    const spacing = staffSpacing * 0.5;
    const totalHeight = buttonHeight * 2 + spacing;
  
    const padding = 10; // extra space around the buttons
  
    this.ctx.clearRect(
      center.x - buttonWidth / 2 - padding,
      center.y - buttonHeight / 2 - padding,
      buttonWidth + padding * 2,
      totalHeight + padding * 2
    );
  }
  
}
