import axios, {AxiosRequestConfig} from "axios";
import ApiClient from "./ApiClient";
import {type Employee} from "../models/Employee";
import {type EmployeeUpdater} from "../models/EmployeeUpdater";
import {FilterFields} from "../models/FilterFields";
import {defaultValues} from "../state-management/filters-store";
import {getIsoDateFromAge} from "../utils/date_functions";

type EmployeeApiModel = Employee & {
    birthDate?: string;
    dateOfBirth?: string;
};

const axiosInstance = axios.create({
    baseURL: "http://localhost:3000/"
})

function normalizeEmployee(employee: EmployeeApiModel): Employee {
    const birthdate = employee.birthdate || employee.birthDate || employee.dateOfBirth || "";

    return {
        ...employee,
        birthdate
    };
}

function toApiEmployee(employee: Employee): Omit<Employee, "birthdate"> & { birthDate: string } {
    const {birthdate, ...rest} = employee;

    return {
        ...rest,
        birthDate: birthdate
    };
}

function getConfig(filters: FilterFields): AxiosRequestConfig {
    const {department, minAge, maxAge, minSalary, maxSalary} = filters;
    const maxDate = getIsoDateFromAge(minAge);
    const minDate = getIsoDateFromAge(maxAge);
    return {
        params: {
            department: department === defaultValues.department ? null : department,
            birthDate_gte: getIsoDateFromAge(defaultValues.maxAge) == minDate ? null : minDate,
            birthDate_lte: getIsoDateFromAge(defaultValues.minAge) == maxDate ? null : maxDate,
            salary_gte: defaultValues.minSalary == minSalary ? null : minSalary,
            salary_lte: defaultValues.maxSalary == maxSalary ? null : maxSalary
        }
    }
}

class ApiClientJsonServer implements ApiClient {
    async getEmployees(filters?: FilterFields): Promise<Employee[]> {
        const config: AxiosRequestConfig | undefined = filters ?
            getConfig(filters) : undefined
        const response = await axiosInstance.get<EmployeeApiModel[]>("employees", config);
        return response.data.map(normalizeEmployee)
    }

    async addEmployee(empl: Employee): Promise<Employee> {
        const response = await axiosInstance.post<EmployeeApiModel>("employees", toApiEmployee(empl));
        return normalizeEmployee(response.data)
    }

    async deleteEmployee(id: string): Promise<Employee> {
        await axiosInstance.delete(`employees/${id}`);
        return {} as Employee;
    }

    updateEmployee(_updater: EmployeeUpdater): Promise<Employee> {
        throw new Error("Method not implemented.");
    }

}

const apiClient: ApiClient = new ApiClientJsonServer();
export default apiClient;
