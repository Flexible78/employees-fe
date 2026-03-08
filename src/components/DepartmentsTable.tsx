import {FC} from 'react'
import { DepartmentInfo } from '../models/DepartmentInfo'
import { HStack, Table } from '@chakra-ui/react'
type Props = {
    departmentsInfo: DepartmentInfo[]
}
const DepartmentsTable: FC<Props> = ({departmentsInfo}) => {
    //TODO
    //only view of Chakra table containg stat info about all departments
  return (
    <HStack justifyContent={"center"}>
        <Table.Root size="sm" showColumnBorder width={"60vw"} height={"50vh"} alignItems={"center"}>
          <Table.Header>
            <Table.Row>
              <Table.ColumnHeader>Department</Table.ColumnHeader>
              <Table.ColumnHeader textAlign="end">Number of Employees</Table.ColumnHeader>
              <Table.ColumnHeader textAlign="end">Average Salary</Table.ColumnHeader>
              <Table.ColumnHeader textAlign="end">Average Age</Table.ColumnHeader>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {departmentsInfo.map((item) => (
              <Table.Row key={item.department}>
                <Table.Cell>{item.department}</Table.Cell>
                <Table.Cell textAlign="end">{item.nEmployees}</Table.Cell>
                <Table.Cell textAlign="end">{item.avgSalary}</Table.Cell>
                <Table.Cell textAlign="end">{item.avgAge}</Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table.Root>
    </HStack>
  )
}

export default DepartmentsTable
