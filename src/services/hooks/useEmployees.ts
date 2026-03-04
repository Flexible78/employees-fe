import { AxiosError, AxiosRequestConfig } from "axios";
import { Employee } from "../../models/Employee";
import { useQuery } from "@tanstack/react-query";
import apiClient from "../ApiClientImpl";

export default function useEmployees(config?: AxiosRequestConfig): {employees: Employee[], isLoading: boolean,
     error: AxiosError | null} {
        const queryKey: any[] = ["employees"];
        config && queryKey.push(config)
        const result = useQuery<Employee[], AxiosError>({
            queryKey,
            queryFn: () => apiClient.getEmployees(config),
            staleTime: 3600_000
        })
        return {employees: result.data || [], error: result.error, isLoading: result.isLoading}
     }