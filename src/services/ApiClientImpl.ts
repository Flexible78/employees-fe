import axios, { AxiosRequestConfig } from "axios";
import ApiClient from "./ApiClient";
import { type Employee } from "../models/Employee";
import { type EmployeeUpdater } from "../models/EmployeeUpdater";
import { FilterFields } from "../models/FilterFields";
import { defaultValues } from "../state-management/filters-store";
import { getIsoDateFromAge } from "../utils/date_functions";
const axiosInstance = axios.create({
    baseURL: "http://localhost:3000/"
})
function getConfig(filters: FilterFields): AxiosRequestConfig {
    const {department, minAge, maxAge,minSalary, maxSalary} = filters;
      const maxDate = getIsoDateFromAge(minAge);
      const minDate = getIsoDateFromAge(maxAge);
    return {params: {department: department === defaultValues.department ? null : department,
                     birthdate_gte: getIsoDateFromAge(defaultValues.maxAge) ==  minDate ? null : minDate,
                     birthdate_lte:  getIsoDateFromAge(defaultValues.minAge) ==  maxDate ? null : maxDate,  
                     salary_gte: defaultValues.minSalary == minSalary ? null : minSalary,
                     salary_lte: defaultValues.maxSalary == maxSalary ? null : maxSalary
    }}
}
class ApiClientJsonServer implements ApiClient {
    async getEmployees(filters?: FilterFields): Promise<Employee[]> {
        const config: AxiosRequestConfig | undefined = filters ?
         getConfig(filters) : undefined
        const response = await axiosInstance.get<Employee[]>("employees", config);
        return response.data
    }
    async addEmployee(empl: Employee): Promise<Employee> {
        const res = await axiosInstance.post<Employee>("employees", empl);
        return res.data
    }
    async deleteEmployee(id: string): Promise<Employee> {
       const res = await axiosInstance.delete<Employee>(`employees/${id}`);
        return res.data
    }
    async updateEmployee(updater: EmployeeUpdater): Promise<Employee> {
        const res = await axiosInstance.patch<Employee>(`employees/${updater.id}`, updater.fields)
        return res.data;
    }
    
}
const apiClient: ApiClient = new ApiClientJsonServer();
export default apiClient;