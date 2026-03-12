import { Box, Button, Dialog, Portal } from '@chakra-ui/react'
import {useMemo, useState} from 'react'
import { useFilters } from '../state-management/filters-store';
import { FilterFields } from '../models/FilterFields';
import FiltersForm from './FiltersForm';
import DialogShaper from './DialogShaper';

const Filters = () => {
 const [open, setOpen] = useState(false)
 const filters = useFilters();
 const {department, minAge, maxAge, minSalary, maxSalary,
     setDepartment, setMaxAge, setMaxSalary, setMinSalary, setMinAge} = filters;
 const filtersData: FilterFields = useMemo(() =>({department,
     maxAge, minAge, maxSalary,minSalary}),[filters])
  const buttonName = useMemo(() => `${department === "Departments" ?
    "": `${department}`} salary: [${minSalary}-${maxSalary}]\
    age: [${minAge}-${maxAge}]`, [filters])   
  return (
    <Box onClick={() => setOpen(true)}>
      <DialogShaper content={<FiltersForm filterFields={filtersData} submitter={({department, maxAge, minAge, minSalary, maxSalary}) => {
                  setMaxAge(maxAge);
                  setMinAge(minAge);
                  setMinSalary(minSalary);
                  setMaxSalary(maxSalary);
                  setDepartment(department);
                  setOpen(false)
              }} />} buttonName={buttonName} open={open}/>
    </Box>
   
            
         
  )
}

export default Filters

