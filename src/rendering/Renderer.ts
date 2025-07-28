import { Line } from "./Line.js";

export class Renderer {
  public ctx: CanvasRenderingContext2D;

  constructor(ctx: CanvasRenderingContext2D) {
    this.ctx = ctx;
  }

  public drawLine(line: Line): void {
    this.ctx.beginPath();
    this.ctx.moveTo(line.startX, line.startY);
    this.ctx.lineTo(line.endX, line.endY);
    this.ctx.strokeStyle = line.color;
    this.ctx.lineWidth = line.width;
    this.ctx.stroke();
  }

  public animateLine(line: Line, speed: number): void {
    const dx = line.endX - line.startX;
    const dy = line.endY - line.startY;
    const length = Math.sqrt(dx * dx + dy * dy);
    const steps = Math.ceil(length / speed);
    let t = 0;

    const drawNextFrame = () => {
      if (t >= 1) return;

      const nextT = Math.min(t + speed / length, 1);
      const x1 = line.startX + dx * t;
      const y1 = line.startY + dy * t;
      const x2 = line.startX + dx * nextT;
      const y2 = line.startY + dy * nextT;

      this.drawLine(new Line(x1, y1, x2, y2, line.width, line.color));
      t = nextT;
      requestAnimationFrame(drawNextFrame);
    };

    drawNextFrame();
  }
}
