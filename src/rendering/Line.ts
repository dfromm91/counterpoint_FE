export class Line {
  public startX: number;
  public startY: number;
  public endX: number;
  public endY: number;
  public width: number;
  public color: string;

  constructor(
    startX: number,
    startY: number,
    endX: number,
    endY: number,
    width: number,
    color: string
  ) {
    const isHorizontal = Math.abs(startY - endY) < 0.01;
    const isVertical = Math.abs(startX - endX) < 0.01;

    if (isHorizontal) {
      // Align to pixel grid for horizontal line
      const y = Math.ceil((startY + endY) / 2) + 0.5;
      this.startY = this.endY = y;
      this.startX = Math.ceil(startX);
      this.endX = Math.ceil(endX);
    } else if (isVertical) {
      // Align to pixel grid for vertical line
      const x = Math.ceil((startX + endX) / 2) + 0.5;
      this.startX = this.endX = x;
      this.startY = Math.ceil(startY);
      this.endY = Math.ceil(endY);
    } else {
      // Diagonal or other — just ceil
      this.startX = Math.ceil(startX);
      this.startY = Math.ceil(startY);
      this.endX = Math.ceil(endX);
      this.endY = Math.ceil(endY);
    }

    this.width = Math.ceil(width);
    this.color = color;
  }
}
