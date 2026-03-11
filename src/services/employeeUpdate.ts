import { type Employee } from "../models/Employee";
import {
  type EmployeeUpdatableFields,
  type EmployeeUpdater,
  type UpdatableEmployeeField,
  updatableEmployeeFields,
} from "../models/EmployeeUpdater";

function setUpdatedField<K extends UpdatableEmployeeField>(
  fields: Partial<EmployeeUpdatableFields>,
  field: K,
  value: EmployeeUpdatableFields[K],
): void {
  fields[field] = value;
}

export function buildEmployeeUpdater(
  original: Employee,
  edited: Employee,
): EmployeeUpdater | null {
  if (!original.id) {
    return null;
  }

  const fields: EmployeeUpdater["fields"] = {};
  for (const field of updatableEmployeeFields) {
    if (edited[field] !== original[field]) {
      setUpdatedField(fields, field, edited[field]);
    }
  }

  if (Object.keys(fields).length === 0) {
    return null;
  }

  return {
    id: original.id,
    fields,
  };
}
