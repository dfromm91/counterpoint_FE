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
    this.startX = startX;
    this.startY = startY;
    this.endX = endX;
    this.endY = endY;
    this.width = width;
    this.color = color;
  }
}
