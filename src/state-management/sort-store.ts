import { create } from "zustand";
import { NonFunctionProps } from "../utils/util-types";
import omit from "lodash/omit"
export type Order = "asc" | "desc" | "no";
export type SortByFieldsStore = {
  department: Order;
  fullName: Order;
  salary: Order;
  birthdate: Order;
  setOrder: (field: SortField, order: Order) => void;
  resetOrder: () => void;
};
export type SortField = keyof SortByFieldsStore;
const defaultValues: NonFunctionProps<SortByFieldsStore> = {
  department: "no",
  fullName: "no",
  salary: "no",
  birthdate: "no",
};
const defaultValuesNoDepartment = omit(defaultValues, "department")
//sorting is implied only by one field
export const useSortByFields = create<SortByFieldsStore>((set) => ({
  ...defaultValues,
  setOrder: (field, order) =>
    set((state) =>
      state[field] === order ? state : { ...defaultValuesNoDepartment, [field]: order },
    ),
  resetOrder: () => set(() => ({ ...defaultValues })),
}));
