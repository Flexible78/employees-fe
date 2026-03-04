import { Avatar, Spinner, Stack, Table } from "@chakra-ui/react";
import useEmployees from "../services/hooks/useEmployees";

const Employees = () => {
  const { employees, isLoading } = useEmployees();
  return (
    <>
      {isLoading && <Spinner></Spinner>}
      <Stack justifyContent={"center"} alignItems={"center"} height={"100%"}>
        <Table.ScrollArea borderWidth="1px" rounded="md" height="75vh" width={{base:"95vw", md: "80vw"}}>
          <Table.Root size={{base: "sm", sm: "md", lg: "lg"}} stickyHeader>
            <Table.Header>
              <Table.Row bg="bg.subtle">
                <Table.ColumnHeader hideBelow={"sm"}></Table.ColumnHeader>
                <Table.ColumnHeader>Full Name</Table.ColumnHeader>
                <Table.ColumnHeader>Department</Table.ColumnHeader>
                <Table.ColumnHeader>Salary</Table.ColumnHeader>
                <Table.ColumnHeader hideBelow={"sm"}>Birthdate</Table.ColumnHeader>
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
