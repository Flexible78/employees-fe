import { Dialog, IconButton, Portal } from "@chakra-ui/react";
import { FC, useState } from "react";
import { MdEdit } from "react-icons/md";
import { type Employee } from "../models/Employee";
import { buildEmployeeUpdater } from "../services/employeeUpdate";
import useUpdateEmployee from "../services/hooks/useUpdateEmployee";
import EmployeeForm from "./EmployeeForm";

type Props = {
  employee: Employee;
};

const EditEmployee: FC<Props> = ({ employee }) => {
  const [open, setOpen] = useState(false);
  const mutation = useUpdateEmployee();

  const handleSubmit = (edited: Employee) => {
    if (mutation.isPending) {
      return;
    }
    const updater = buildEmployeeUpdater(employee, edited);
    if (!updater) {
      setOpen(false);
      return;
    }
    mutation.mutate(updater, {
      onSuccess: () => setOpen(false),
    });
  };

  return (
    <Dialog.Root open={open} onOpenChange={(e) => setOpen(e.open)}>
      <Dialog.Trigger asChild>
        <IconButton
          aria-label="Edit"
          size="xs"
          disabled={mutation.isPending}
        >
          <MdEdit />
        </IconButton>
      </Dialog.Trigger>
      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content maxW={{ base: "95vw", md: "3xl" }}>
            <Dialog.Header>
              <Dialog.Title>Edit Employee</Dialog.Title>
            </Dialog.Header>
            <Dialog.Body>
              <EmployeeForm
                employee={employee}
                submitter={handleSubmit}
                layout="dialog"
              />
            </Dialog.Body>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  );
};

export default EditEmployee;
