import { type Employee } from "./Employee";

export const updatableEmployeeFields = [
  "fullName",
  "department",
  "salary",
  "birthdate",
] as const;

export type UpdatableEmployeeField = (typeof updatableEmployeeFields)[number];
export type EmployeeUpdatableFields = Pick<Employee, UpdatableEmployeeField>;

export type EmployeeUpdater = {
  id: string;
  fields: Partial<EmployeeUpdatableFields>;
};
