import axios, { AxiosRequestConfig } from "axios";
import ApiClient from "./ApiClient";
import { type Employee } from "../models/Employee";
import { type EmployeeUpdater } from "../models/EmployeeUpdater";
import { ActiveFilters } from "../models/FilterFields";
import { getIsoDateFromAge } from "../utils/date_functions";

const axiosInstance = axios.create({
    baseURL: "http://localhost:3001/"
})

class ApiClientJsonServer implements ApiClient {
    async getEmployees(filters?: ActiveFilters): Promise<Employee[]> {
        let config: AxiosRequestConfig | undefined = undefined;

        if (filters) {
            const params: any = {};

            if (filters.department) {
                params.department = filters.department;
            }

            if (filters.minSalary !== undefined) params.salary_gte = filters.minSalary;
            if (filters.maxSalary !== undefined) params.salary_lte = filters.maxSalary;

            if (filters.minAge !== undefined) params.birthDate_lte = getIsoDateFromAge(filters.minAge);
            if (filters.maxAge !== undefined) params.birthDate_gte = getIsoDateFromAge(filters.maxAge);

            config = { params };
        }


        const response = await axiosInstance.get<any[]>("employees", config);

        const fixedEmployees = response.data.map(emp => {
            const realDate = emp.birthDate || emp.birthdate || emp.dateOfBirth;

            return {
                ...emp,
                birthDate: realDate,
                birthdate: realDate
            }
        });

        return fixedEmployees as Employee[];
    }

    async addEmployee(empl: Employee): Promise<Employee> {
        const emplRes: Employee = await axiosInstance.post("employees", empl);
        return emplRes
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
