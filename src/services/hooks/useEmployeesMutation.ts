import {
  MutationFunction,
  useMutation,
  UseMutationResult,
  useQueryClient,
} from "@tanstack/react-query";
import { AxiosError } from "axios";

export default function useEmployeesMutation<TData, TVariables>(
  mutateFn: MutationFunction<TData, TVariables>,
): UseMutationResult<TData, AxiosError, TVariables, any> {
  const client = useQueryClient();
  const res = useMutation<TData, AxiosError, TVariables>({
    mutationFn: mutateFn,
    onSuccess: () =>
      client.invalidateQueries({
        queryKey: ["employees"],
      }),
  });
  if (res.error) {
    throw res.error;
  }
  return res;
}
