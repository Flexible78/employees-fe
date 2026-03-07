import axios, { AxiosRequestConfig } from "axios";
import ApiClient from "./ApiClient";
import { type Employee } from "../models/Employee";
import { type EmployeeUpdater } from "../models/EmployeeUpdater";

const axiosInstance = axios.create({
    baseURL: "http://localhost:3001/"
})

type EmployeeResponse = Omit<Employee, "birthdate"> & {
    birthDate?: string
    birthdate?: string
}

function normalizeEmployee(employee: EmployeeResponse): Employee {
    return {
        ...employee,
        birthdate: employee.birthdate ?? employee.birthDate ?? "",
    }
}

class ApiClientJsonServer implements ApiClient {
    async getEmployees(config?: AxiosRequestConfig): Promise<Employee[]> {
        const response = await axiosInstance.get<EmployeeResponse[]>("employees", config);
        return response.data.map(normalizeEmployee)
    }
    async addEmployee(empl: Employee): Promise<Employee> {
        const payload = { ...empl, birthDate: empl.birthdate }
        const response = await axiosInstance.post<EmployeeResponse>("employees", payload);
        return normalizeEmployee(response.data)
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
