import { FC } from "react";
import { Employee } from "../models/Employee";
import useEmployeesMutation from "../services/hooks/useEmployeesMutation";
import apiClient from "../services/ApiClientImpl";
import ConfirmDialog from "./ConfirmationDialog";
import { MdDelete } from "react-icons/md";
type Props = {
  empl: Employee;
};
const DeleteEmployee: FC<Props> = ({empl}) => {
  const mutationDel = useEmployeesMutation<Employee, string>((id) =>
    apiClient.deleteEmployee(id),
  );
  return (
    <ConfirmDialog
      content={`Deleting employee ${empl.fullName}`}
      onClose={(isDelete) => {
        isDelete && mutationDel.mutate(empl.id!);
      }}
      isPending={mutationDel.isPending}
      icon={<MdDelete></MdDelete>}
    ></ConfirmDialog>
  );
};

export default DeleteEmployee;

