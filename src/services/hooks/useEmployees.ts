import { AxiosError } from "axios";
import { Employee } from "../../models/Employee";
import { useQuery } from "@tanstack/react-query";
import apiClient from "../ApiClientImpl";
import { ActiveFilters, FilterFields } from "../../models/FilterFields";
import { defaultFilterValues } from "../../state-management/filters-store";

function getActiveFilters(filters?: FilterFields): ActiveFilters | undefined {
    if (!filters) return undefined;

    const activeFilters: ActiveFilters = {};

    if (filters.department !== defaultFilterValues.department) {
        activeFilters.department = filters.department;
    }

    if (filters.minSalary !== defaultFilterValues.minSalary) {
        activeFilters.minSalary = filters.minSalary;
    }

    if (filters.maxSalary !== defaultFilterValues.maxSalary) {
        activeFilters.maxSalary = filters.maxSalary;
    }

    if (filters.minAge !== defaultFilterValues.minAge) {
        activeFilters.minAge = filters.minAge;
    }

    if (filters.maxAge !== defaultFilterValues.maxAge) {
        activeFilters.maxAge = filters.maxAge;
    }

    return Object.keys(activeFilters).length > 0 ? activeFilters : undefined;
}

export default function useEmployees(filters?: FilterFields): {
    employees: Employee[],
    isLoading: boolean,
    error: AxiosError | null
} {
    const activeFilters = getActiveFilters(filters);
    const queryKey = activeFilters ? ["employees", activeFilters] : ["employees"];

    const result = useQuery<Employee[], AxiosError>({
        queryKey,
        queryFn: () => apiClient.getEmployees(activeFilters),
        staleTime: 3600_000
    });

    return { employees: result.data || [], error: result.error, isLoading: result.isLoading };
}
