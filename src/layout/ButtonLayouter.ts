export class ButtonLayouter {
  constructor(private currentButtonCenter: { x: number; y: number }) {
    this.currentButtonCenter = currentButtonCenter;
  }

  getCurrentButtonCenter() {
    return this.currentButtonCenter;
  }

  updateButtonCenter(center: { x: number; y: number }) {
    this.currentButtonCenter = center;
  }

  isInTopArrow(x: number, y: number, staffSpacing: number): boolean {
    const width = staffSpacing;
    const height = staffSpacing * 1.5;
    const center = this.currentButtonCenter;

    const left = center.x - width / 2;
    const right = center.x + width / 2;
    const top = center.y - height / 2;
    const bottom = center.y + height / 2;

    return this.isInTriangle(
      x,
      y,
      { x: center.x, y: top },
      { x: left, y: bottom },
      { x: right, y: bottom }
    );
  }

  isInBottomArrow(x: number, y: number, staffSpacing: number): boolean {
    const width = staffSpacing;
    const height = staffSpacing * 1.5;
    const spacing = staffSpacing * 0.5;
    const downCenterY = this.currentButtonCenter.y + height + spacing;

    const left = this.currentButtonCenter.x - width / 2;
    const right = this.currentButtonCenter.x + width / 2;
    const top = downCenterY - height / 2;
    const bottom = downCenterY + height / 2;

    return this.isInTriangle(
      x,
      y,
      { x: this.currentButtonCenter.x, y: bottom },
      { x: left, y: top },
      { x: right, y: top }
    );
  }

  isInCheckmark(x: number, y: number, staffSpacing: number): boolean {
    const arrowWidth = staffSpacing;
    const arrowHeight = staffSpacing * 1.5;
    const spacing = staffSpacing * 0.5;

    const checkSize = staffSpacing * 1.2;

    const checkX =
      this.currentButtonCenter.x + arrowWidth + spacing * 2 - checkSize / 2;
    const checkY =
      this.currentButtonCenter.y + arrowHeight * 0.5 - checkSize / 2;

    return (
      x >= checkX &&
      x <= checkX + checkSize &&
      y >= checkY &&
      y <= checkY + checkSize
    );
  }

  private isInTriangle(
    px: number,
    py: number,
    a: { x: number; y: number },
    b: { x: number; y: number },
    c: { x: number; y: number }
  ): boolean {
    const area = (p1: any, p2: any, p3: any) =>
      Math.abs(
        (p1.x * (p2.y - p3.y) +
          p2.x * (p3.y - p1.y) +
          p3.x * (p1.y - p2.y)) / 2
      );

    const A = area(a, b, c);
    const A1 = area({ x: px, y: py }, b, c);
    const A2 = area(a, { x: px, y: py }, c);
    const A3 = area(a, b, { x: px, y: py });

    return Math.abs(A - (A1 + A2 + A3)) < 0.5;
  }
}
