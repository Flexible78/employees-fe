import axios, { AxiosRequestConfig } from "axios";
import ApiClient from "./ApiClient";
import { type Employee } from "../models/Employee";
import { type EmployeeUpdater } from "../models/EmployeeUpdater";
import { FilterFields } from "../models/FilterFields";
const axiosInstance = axios.create({
    baseURL: "http://localhost:3001/"
})
class ApiClientJsonServer implements ApiClient {
    async getEmployees(filters?: FilterFields): Promise<Employee[]> {
        // FIXME if parameter "filters" contains value to get config for Axios
        let config: AxiosRequestConfig | undefined = undefined
        const response = await axiosInstance.get<Employee[]>("employees", config);
        return response.data
    }
    async addEmployee(empl: Employee): Promise<Employee> {
        const emplRes: Employee = await axiosInstance.post("employees", empl);
        return emplRes
    }
    deleteEmployee(id: string): Promise<Employee> {
        throw new Error("Method not implemented.");
    }
    updateEmployee(updater: EmployeeUpdater): Promise<Employee> {
        throw new Error("Method not implemented.");
    }

}
const apiClient: ApiClient = new ApiClientJsonServer();
export default apiClient;
