import { Button, HStack, VStack } from '@chakra-ui/react';
import useEmployees from '../../services/hooks/useEmployees';
import Employees from '../Employees'
import Filters from '../Filters';
import { useFilters } from '../../state-management/filters-store';

const HomePage = () => {
    const { department, minSalary, maxSalary, minAge, maxAge, resetToDefault } = useFilters();

    const { employees, isLoading } = useEmployees({
        department,
        minSalary,
        maxSalary,
        minAge,
        maxAge
    });

    return (
        <VStack>
            <HStack>
                <Filters/>
                <Button onClick={() => resetToDefault()}>Reset to Default</Button>
            </HStack>
            <Employees employees={employees} isLoading={isLoading}/>
        </VStack>
    )
}

export default HomePage
