import { FC, useState } from "react";
import { type Employee } from "../models/Employee";
import {Box } from "@chakra-ui/react";
import useEmployeesMutation from "../services/hooks/useEmployeesMutation";
import { EmployeeUpdater } from "../models/EmployeeUpdater";
import apiClient from "../services/ApiClientImpl";
import { FaEdit } from "react-icons/fa";
import EmployeeForm from "./EmployeeForm";
import DialogShaper from "./DialogShaper";
type Props = {
  employee: Employee;
};
const EditEmployee: FC<Props> = ({ employee }) => {
  const [open, setOpen] = useState(false);
  const mutation = useEmployeesMutation<Employee, EmployeeUpdater>((updater) =>
    apiClient.updateEmployee(updater),
  );
  function updateEmployee(empl: Employee) {
    const updater: EmployeeUpdater = {
      id: empl.id!,
      fields: {
        fullName:
          employee.fullName != empl.fullName ? empl.fullName : undefined,
        salary: employee.salary != empl.salary ? empl.salary : undefined,
        department:
          employee.department != empl.department ? empl.department : undefined,
      },
    };
    if (Object.values(updater.fields).some((v) => !!v)) {
      mutation.mutate(updater);
    }
  }
  return (
    <Box onClick={() => setOpen(true)}>
      <DialogShaper
        content={
          <EmployeeForm
            submitter={(empl) => {
              updateEmployee(empl);
              setOpen(false);
            }}
            employee={employee}
          />
        }
        open={open}
        buttonName={<FaEdit />}
        isPending={mutation.isPending}
      />
    </Box>
  );
};

export default EditEmployee;

