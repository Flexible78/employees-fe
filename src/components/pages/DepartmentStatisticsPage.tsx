import { Box, Text } from '@chakra-ui/react'
import DepartmentsTable from '../DepartmentsTable'
import useEmployees from '../../services/hooks/useEmployees'
import { DepartmentInfo } from '../../models/DepartmentInfo'
import { Employee } from '../../models/Employee'
import { useMemo } from 'react'
import _ from 'lodash'

function getDepartmentsInfo(employees: Employee[]): DepartmentInfo[] {
    const grouped = _.groupBy(employees, 'department');

    return Object.entries(grouped).map(([deptName, emps]) => {


        const ages = emps
            .map(emp => {
                // @ts-ignore
                const dateString = emp.birthdate || emp.birthDate;

                if (!dateString) return null;

                const birthYear = new Date(dateString).getFullYear();
                return new Date().getFullYear() - birthYear;
            })

            .filter(age => age !== null && !isNaN(age));


        const finalAvgAge = ages.length > 0 ? _.round(_.mean(ages), 1) : 0;

        return {
            department: deptName,
            nEmployees: emps.length,
            avgSalary: _.round(_.meanBy(emps, 'salary'), 2),
            avgAge: finalAvgAge
        };
    });
}

const DepartmentStatisticsPage = () => {
    const {employees} = useEmployees()
    const data: DepartmentInfo[] = useMemo(() => getDepartmentsInfo(employees), [employees])
    return (
        <Box w="100%" as="div" >
            <Text fontSize="1.2rem" as="h1" textAlign={"center"} fontWeight={"bold"}>Departments Statistics Page</Text>
            <DepartmentsTable departmentsInfo={data}></DepartmentsTable>
        </Box>
    )
}

export default DepartmentStatisticsPage
