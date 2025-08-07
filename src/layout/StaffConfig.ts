export interface StaffConfig {
  upperLeftCorner: { x: number; y: number };
  width: number;
  lineThickness: number;
  spacing: number;
  horizontalNoteSpacing: number;
  staffLineSpacing: number;
  grandStaffSpacing: number;
}
const spacing = 15;
export const defaultStaffConfig: StaffConfig = {
  upperLeftCorner: { x: 100, y: 50 },
  width: 766,
  lineThickness: 1,
  spacing: spacing,
  horizontalNoteSpacing: spacing * 6,
  staffLineSpacing: spacing * 4,
  grandStaffSpacing: spacing * 4,
};
