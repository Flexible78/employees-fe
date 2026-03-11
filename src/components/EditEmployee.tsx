import {FC, useState} from 'react'
import { type Employee } from '../models/Employee'
import { IconButton, Dialog, Portal } from '@chakra-ui/react'
import useEmployeesMutation from '../services/hooks/useEmployeesMutation'
import { EmployeeUpdater } from '../models/EmployeeUpdater'
import apiClient from '../services/ApiClientImpl'
import {FaEdit} from "react-icons/fa"
import EmployeeForm from './EmployeeForm'
type Props = {
    employee: Employee
}
const EditEmployee: FC<Props> = ({employee}) => {
    const [open, setOpen] = useState(false)
    const mutation = useEmployeesMutation<Employee, EmployeeUpdater>((updater) => apiClient.updateEmployee(updater))
    function updateEmployee(empl: Employee) {
        const updater: EmployeeUpdater = {
            id: empl.id!,
            fields: {
                fullName: employee.fullName != empl.fullName ? empl.fullName : undefined,
                salary: employee.salary != empl.salary ? empl.salary : undefined,
                department: employee.department != empl.department ? empl.department : undefined
            }
        }
        if (Object.values(updater.fields).some(v => !!v)) {
            mutation.mutate(updater)
        }
    }
  return(
      <Dialog.Root lazyMount open={open} onOpenChange={(e) => setOpen(e.open)}>
        <Dialog.Trigger asChild>
          <IconButton variant="outline" disabled={mutation.isPending}><FaEdit></FaEdit></IconButton>
        </Dialog.Trigger>
        <Portal>
          <Dialog.Backdrop />
          <Dialog.Positioner>
            <Dialog.Content display={"flex"} alignItems={"center"}>
              <EmployeeForm submitter={(empl) => {updateEmployee(empl); setOpen(false)}} employee={employee} />
            </Dialog.Content>
          </Dialog.Positioner>
        </Portal>
      </Dialog.Root>
    )
}

export default EditEmployee
