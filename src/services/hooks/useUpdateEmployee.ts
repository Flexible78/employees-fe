import { type Employee } from "../../models/Employee";
import { type EmployeeUpdater } from "../../models/EmployeeUpdater";
import apiClient from "../ApiClientImpl";
import useEmployeesMutation from "./useEmployeesMutation";

export default function useUpdateEmployee() {
  return useEmployeesMutation<Employee, EmployeeUpdater>((updater) =>
    apiClient.updateEmployee(updater),
  );
}
