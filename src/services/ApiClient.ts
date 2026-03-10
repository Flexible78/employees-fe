import { type AxiosRequestConfig } from "axios";
import { type Employee } from "../models/Employee";
import { type EmployeeUpdater } from "../models/EmployeeUpdater";
import { FilterFields } from "../models/FilterFields";

export default interface ApiClient {
    getEmployees(filters?: FilterFields): Promise<Employee[]>;
    addEmployee(empl: Employee): Promise<Employee>;
    deleteEmployee(id: string): Promise<Employee>;
    updateEmployee(updater: EmployeeUpdater): Promise<Employee>
}