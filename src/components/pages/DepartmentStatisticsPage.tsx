import { Box, Text, VStack } from "@chakra-ui/react";
import _ from "lodash";
import { useMemo } from "react";
import DepartmentsTable from "../DepartmentsTable";
import { DepartmentInfo } from "../../models/DepartmentInfo";
import { Employee } from "../../models/Employee";
import useEmployees from "../../services/hooks/useEmployees";

/**
 *
 * @param employees
 * returns arry of DepartmentInfo objects
 */
function getDepartmentsInfo(employees: Employee[]): DepartmentInfo[] {
  const employeesByDepartment = _.groupBy(employees, "department");

  return Object.entries(employeesByDepartment)
    .map(([department, depEmployees]) => {
      const avgSalary = _.round(_.meanBy(depEmployees, "salary"), 2);
      const avgAge = _.round(
        _.meanBy(depEmployees, (employee) => {
          const birthYear = new Date(employee.birthdate).getFullYear();
          return new Date().getFullYear() - birthYear;
        }),
        2,
      );

      return {
        department,
        nEmployees: depEmployees.length,
        avgSalary,
        avgAge,
      };
    })
    .sort((a, b) => a.department.localeCompare(b.department));
}

const DepartmentStatisticsPage = () => {
  const { employees } = useEmployees();
  const data: DepartmentInfo[] = useMemo(() => getDepartmentsInfo(employees), [employees]);

  return (
    <Box as="div" w="100%">
      <VStack>
        <Text as="h1" fontSize="1.2rem" fontWeight={"bold"} textAlign={"center"}>
          Departments Statistsics Page
        </Text>
        <DepartmentsTable departmentsInfo={data}></DepartmentsTable>
      </VStack>
    </Box>
  );
};

export default DepartmentStatisticsPage;
