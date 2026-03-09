import { create } from "zustand";
import employeesConfig from "../config/employees-config";
import { NonFunctionProps } from "../utils/util-types";
export type FiltersStore = {
  department: string;
  minSalary: number;
  maxSalary: number;
  minAge: number;
  maxAge: number;
  setDepartment: (department: string) => void;
  setMinAge: (minAge: number) => void;
  setMaxAge: (maxAge: number) => void;
  setMinSalary: (minSalary: number) => void;
  setMaxSalary: (maxSalary: number) => void;
  resetToDefault: () =>void
};
export const defaultValues: NonFunctionProps<FiltersStore> = {
  department: "Departments",
  minSalary: employeesConfig.salary.min,
  maxSalary: employeesConfig.salary.max,
  minAge: employeesConfig.age.min,
  maxAge: employeesConfig.age.max,
};
export const useFilters = create<FiltersStore>((set) => ({
  ...defaultValues,
  setDepartment: (department) =>
    set((state) => (state.department === department ? state : { department })),
  setMinSalary: (minSalary) =>
    set((state) => (state.minSalary === minSalary ? state : { minSalary })),
  setMaxSalary: (maxSalary) =>
    set((state) => (state.maxSalary === maxSalary ? state : { maxSalary })),
  setMaxAge: (maxAge) =>
    set((state) => (state.maxAge === maxAge ? state : { maxAge })),
  setMinAge: (minAge) =>
    set((state) => (state.minAge === minAge ? state : { minAge })),
  resetToDefault: () => set(() => ({...defaultValues}))
}));
