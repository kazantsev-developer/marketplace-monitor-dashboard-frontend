export interface ColumnDef<T> {
  key: keyof T;
  label: string;
  align?: "left" | "center" | "right";
}
