import { MutateFunction, useMutation, UseMutationResult, useQueryClient } from "@tanstack/react-query";

export default function useEmployeesMutation(mutateFn: MutateFunction): UseMutationResult {
    const client = useQueryClient();
    const res = useMutation({
        mutationFn: mutateFn as any,
        onSuccess: () => client.invalidateQueries({
            queryKey: ["employees"]
        })  
    })
    if (res.error) {
        throw res.error
    }
    return res as any;
}