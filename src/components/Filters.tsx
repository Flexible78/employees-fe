import { Button, Dialog, Portal } from '@chakra-ui/react'
import {useMemo, useState} from 'react'
import { useFilters } from '../state-management/filters-store';
import { FilterFields } from '../models/FilterFields';
import FiltersForm from './FiltersForm';

const Filters = () => {
 const [open, setOpen] = useState(false)
 const filters = useFilters();
 const {department, minAge, maxAge, minSalary, maxSalary,
     setDepartment, setMaxAge, setMaxSalary, setMinSalary, setMinAge} = filters;
 const filtersData: FilterFields = useMemo(() =>({department,
     maxAge, minAge, maxSalary,minSalary}),[filters])
  const buttonName = useMemo(() => `${department === "Departments" ?
    "All departments": `department: ${department}`}; salary: [${minSalary}-${maxSalary}]\
    age: [${minAge}-${maxAge}]`, [filters])   
  return (
    <Dialog.Root lazyMount open={open} onOpenChange={(e) => setOpen(e.open)}>
      <Dialog.Trigger asChild>
        <Button variant="outline">{buttonName}</Button>
      </Dialog.Trigger>
      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content display={"flex"} alignItems={"center"}>
            <FiltersForm filterFields={filtersData} submitter={({department, maxAge, minAge, minSalary, maxSalary}) => {
                setMaxAge(maxAge);
                setMinAge(minAge);
                setMinSalary(minSalary);
                setMaxSalary(maxSalary);
                setDepartment(department);
                setOpen(false)
            }} ></FiltersForm>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  )
}

export default Filters
