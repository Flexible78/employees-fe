import { Button, HStack, VStack } from '@chakra-ui/react';
import useEmployees from '../../services/hooks/useEmployees';
import Employees from '../Employees'
import Filters from '../Filters';
import { useFilters } from '../../state-management/filters-store';
import { useMemo } from 'react';
import { FilterFields } from '../../models/FilterFields';
import { useSortByFields } from '../../state-management/sort-store';
const HomePage = () => {
  const filters = useFilters();
  const resetOrder = useSortByFields(s => s.resetOrder)
  const {department, minAge, minSalary,maxAge, maxSalary, resetToDefault} = filters;
  const filterFields: FilterFields = useMemo(()=>({department, minAge, maxAge, minSalary, maxSalary}),[filters])
  const { employees, isLoading } = useEmployees(filterFields);
  
  return (
    <VStack>
      <HStack>
        <Filters/>
        <Button onClick={() => {resetToDefault(); resetOrder()}}>Reset to Default</Button>
      </HStack>
      <Employees employees={employees} isLoading={isLoading}/>
    </VStack>
  )
}

export default HomePage
