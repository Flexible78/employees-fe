import { Avatar, IconButton, Spinner, Stack, Table } from "@chakra-ui/react";
import { FC, ReactNode } from "react";
import { Employee } from "../models/Employee";
import {FaSort, FaSortUp, FaSortDown} from "react-icons/fa"
import { Order, SortByFieldsStore, SortField, useSortByFields } from "../state-management/sort-store";
type Props = {
  employees: Employee[],
  isLoading: boolean
}
function getIcon(field: SortField, sortOptions: SortByFieldsStore): ReactNode {
  const order = sortOptions[field] ;
  let result: ReactNode = <FaSort></FaSort>
  if (order != "no") {
    result = order == "asc" ? <FaSortUp> </FaSortUp> : <FaSortDown></FaSortDown>
  }
  return<IconButton size="xs" marginLeft={2}>{ result}</IconButton>;
}
const Employees: FC<Props> = ({employees, isLoading}) => {
  const sortOptions = useSortByFields();
  return (
    <>
      {isLoading && <Spinner></Spinner>}
      <Stack justifyContent={"center"} alignItems={"center"} height={"100%"}>
        <Table.ScrollArea borderWidth="1px" rounded="md" height="75vh"
         width={{base:"95vw", md: "80vw"}}>
          <Table.Root size={{base: "sm", sm: "md", lg: "lg"}} stickyHeader>
            <Table.Header>
              <Table.Row bg="bg.subtle">
                <Table.ColumnHeader hideBelow={"sm"}></Table.ColumnHeader>
                <Table.ColumnHeader>Full Name {getIcon("fullName", sortOptions)}</Table.ColumnHeader>
                <Table.ColumnHeader>Department{getIcon("department", sortOptions)}</Table.ColumnHeader>
                <Table.ColumnHeader>Salary{getIcon("salary", sortOptions)}</Table.ColumnHeader>
                <Table.ColumnHeader hideBelow={"sm"}>Birthdate{getIcon("birthdate", sortOptions)}</Table.ColumnHeader>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {employees.map((empl) => (
                <Table.Row key={empl.id} >
                  <Table.Cell hideBelow={"sm"} >
                    <Avatar.Root size={{sm:"sm", lg: "lg"}} >
                      <Avatar.Fallback name={empl .fullName} />
                      <Avatar.Image src={empl.avatar} />
                    </Avatar.Root>
                  </Table.Cell>
                  <Table.Cell>{empl.fullName}</Table.Cell>
                  <Table.Cell >{empl.department}</Table.Cell>
                  <Table.Cell >{empl.salary}</Table.Cell>
                  <Table.Cell hideBelow={"sm"} >{empl.birthdate}</Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table.Root>
        </Table.ScrollArea>
      </Stack>
    </>
  );
};

export default Employees;
