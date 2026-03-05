import { FC } from 'react'
import { Table } from '@chakra-ui/react' // ОБЯЗАТЕЛЬНО: берем полки из Chakra!
import { DepartmentInfo } from '../models/DepartmentInfo'

type Props = {
  departmentsInfo: DepartmentInfo[]
}

const DepartmentsTable: FC<Props> = ({ departmentsInfo }) => {
  return (
      // Корпус нашего стеллажа
      <Table.Root size="md" variant="line">

        <Table.Header>
          <Table.Row>
            <Table.ColumnHeader>Department</Table.ColumnHeader>
            <Table.ColumnHeader>Employees</Table.ColumnHeader>
            <Table.ColumnHeader>Avg Salary</Table.ColumnHeader>
            <Table.ColumnHeader>Avg Age</Table.ColumnHeader>
          </Table.Row>
        </Table.Header>

        <Table.Body>
          {departmentsInfo.map((info) => (
              <Table.Row key={info.department}>
                <Table.Cell>{info.department}</Table.Cell>
                <Table.Cell>{info.nEmployees}</Table.Cell>
                <Table.Cell>{info.avgSalary}</Table.Cell>
                <Table.Cell>{info.avgAge}</Table.Cell>
              </Table.Row>
          ))}
        </Table.Body>

      </Table.Root>
  )
}

export default DepartmentsTable
