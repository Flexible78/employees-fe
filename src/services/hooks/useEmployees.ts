import { AxiosError, AxiosRequestConfig } from "axios";
import { Employee } from "../../models/Employee";
import { useQuery } from "@tanstack/react-query";
import apiClient from "../ApiClientImpl";
import { FilterFields } from "../../models/FilterFields";

export default function useEmployees(filters?: FilterFields): {employees: Employee[], isLoading: boolean,
     error: AxiosError | null} {
        const queryKey: any[] = ["employees"];
        filters && queryKey.push(filters)
        const result = useQuery<Employee[], AxiosError>({
            queryKey,
            queryFn: () => apiClient.getEmployees(filters),
            staleTime: 3600_000
        })
        return {employees: result.data || [], error: result.error, isLoading: result.isLoading}
     }