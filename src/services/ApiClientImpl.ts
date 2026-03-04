import axios, { AxiosRequestConfig } from "axios";
import ApiClient from "./ApiClient";
import { type Employee } from "../models/Employee";
import { type EmployeeUpdater } from "../models/EmployeeUpdater";

type ApiEmployee = Employee & {
    birthDate?: string
}

const axiosInstance = axios.create({
    baseURL: "http://localhost:3001/"
})
class ApiClientJsonServer implements ApiClient {
    async getEmployees(config?: AxiosRequestConfig): Promise<Employee[]> {
        const response = await axiosInstance.get<ApiEmployee[]>("employees", config);
        return response.data.map((employee) => ({
            ...employee,
            birthdate: employee.birthdate ?? employee.birthDate ?? "",
        }))
    }
    addEmployee(_empl: Employee): Promise<Employee> {
        throw new Error("Method not implemented.");
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
