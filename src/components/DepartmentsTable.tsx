import { FC } from "react";
import { Table } from "@chakra-ui/react";
import { DepartmentInfo } from "../models/DepartmentInfo";

type Props = {
  departmentsInfo: DepartmentInfo[];
};

const DepartmentsTable: FC<Props> = ({ departmentsInfo }) => {
  return (
    <Table.ScrollArea borderWidth="1px" rounded="md" maxW={{ base: "95vw", md: "80vw" }}>
      <Table.Root size={{ base: "sm", md: "md" }}>
        <Table.Header>
          <Table.Row bg="bg.subtle">
            <Table.ColumnHeader>Department</Table.ColumnHeader>
            <Table.ColumnHeader>Employees</Table.ColumnHeader>
            <Table.ColumnHeader>Avg salary</Table.ColumnHeader>
            <Table.ColumnHeader>Avg age</Table.ColumnHeader>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {departmentsInfo.map((item) => (
            <Table.Row key={item.department}>
              <Table.Cell>{item.department}</Table.Cell>
              <Table.Cell>{item.nEmployees}</Table.Cell>
              <Table.Cell>{item.avgSalary}</Table.Cell>
              <Table.Cell>{item.avgAge}</Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table.Root>
    </Table.ScrollArea>
  );
};

export default DepartmentsTable;
