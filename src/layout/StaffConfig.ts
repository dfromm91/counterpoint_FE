export interface StaffConfig {
  upperLeftCorner: { x: number; y: number };
  width: number;
  lineThickness: number;
  spacing: number;
  horizontalNoteSpacing: number;
  staffLineSpacing: number;
  grandStaffSpacing: number;
}

export const defaultStaffConfig: StaffConfig = {
  upperLeftCorner: { x: 100, y: 50 },
  width: 1000,
  lineThickness: 2,
  spacing: 20,
  horizontalNoteSpacing: 100,
  staffLineSpacing: 100,
  grandStaffSpacing: 70,
};
