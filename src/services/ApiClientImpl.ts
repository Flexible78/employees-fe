import axios, { AxiosRequestConfig } from "axios";
import ApiClient from "./ApiClient";
import { type Employee } from "../models/Employee";
import { type EmployeeUpdater } from "../models/EmployeeUpdater";
const axiosInstance = axios.create({
    baseURL: "http://localhost:3000/"
})
class ApiClientJsonServer implements ApiClient {
    async getEmployees(config?: AxiosRequestConfig): Promise<Employee[]> {
        const response = await axiosInstance.get<Employee[]>("employees", config);
        return response.data
    }
    async addEmployee(empl: Employee): Promise<Employee> {
        const response = await axiosInstance.post<Employee>("employees", empl);
        return response.data
    }
    deleteEmployee(_id: string): Promise<Employee> {
        throw new Error("Method not implemented.");
    }
    updateEmployee(_updater: EmployeeUpdater): Promise<Employee> {
        throw new Error("Method not implemented.");
    }
    
}
const apiClient: ApiClient = new ApiClientJsonServer();
export default apiClient;
