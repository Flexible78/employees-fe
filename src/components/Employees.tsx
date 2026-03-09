import { Avatar, IconButton, Spinner, Stack, Table, Button, Box, Text, HStack } from "@chakra-ui/react";
import { FC, ReactNode, useMemo, useState } from "react";
import { Employee } from "../models/Employee";
import { FaSort, FaSortUp, FaSortDown, FaTrash } from "react-icons/fa";
import { Order, SortByFieldsStore, SortField, useSortByFields } from "../state-management/sort-store";
import orderBy from "lodash/orderBy";
import { useUserData } from "../state-management/auth-store";
import useEmployeesMutation from "../services/hooks/useEmployeesMutation";
import apiClient from "../services/ApiClientImpl";

type Props = {
  employees: Employee[]
  isLoading: boolean
}

function updateSortingState(field: SortField, sortOptions: SortByFieldsStore):void {
  const order = sortOptions[field];
  let newOrder: Order = "asc"
  if (order != "no") {
    newOrder = order == "asc" ? "desc" : "asc";
  }
  sortOptions.setOrder(field, newOrder)
}

function getIcon(field: SortField, sortOptions: SortByFieldsStore): ReactNode {
  const order = sortOptions[field];
  let result: ReactNode = <FaSort></FaSort>
  if (order != "no") {
    result = order == "asc" ? <FaSortUp> </FaSortUp> : <FaSortDown></FaSortDown>
  }
  return <IconButton size="xs" marginLeft={2} onClick={() => updateSortingState(field, sortOptions)}>{result}</IconButton>;
}

function getSortingFields(sortOptions:SortByFieldsStore): SortField[] {
  const keys: SortField[] = Object.keys(sortOptions) as SortField[]
  return keys.filter(k => sortOptions[k] == "asc" || sortOptions[k] == "desc")
}

const Employees: FC<Props> = ({employees, isLoading}) => {
  const sortOptions = useSortByFields();
  const role = useUserData(state => state.role);
  const isAdmin = role === "ADMIN";

  const [employeeToDelete, setEmployeeToDelete] = useState<Employee | null>(null);

  const deleteMutation = useEmployeesMutation(
      (id: string) => apiClient.deleteEmployee(id)
  );

  const handleConfirmDelete = () => {
    if (employeeToDelete?.id) {
      deleteMutation.mutate(employeeToDelete.id.toString(), {
        onSuccess: () => setEmployeeToDelete(null)
      });
    }
  };

  const sortedEmployees: Employee[] = useMemo(()=>{
    const sortFields: SortField[] = getSortingFields(sortOptions);
    let result: Employee[] = []
    result = sortFields.length == 0 ? orderBy(employees, ["id"], ["asc"]) : orderBy(employees, sortFields,
        sortFields.map(sf => (sortOptions as any)[sf])
    )
    return result;
  }, [employees, sortOptions])

  return (
      <>
        {employeeToDelete && (
            <Box position="fixed" top="0" left="0" w="100vw" h="100vh" bg="blackAlpha.600" zIndex="1000" display="flex" alignItems="center" justifyContent="center">
              <Box bg="white" p={6} rounded="md" shadow="xl" maxW="400px" color="black" mx={4}>
                <Text fontSize="xl" fontWeight="bold" mb={4}>Are you sure?</Text>
                <Text mb={6}>
                  This action cannot be undone. This will permanently delete <b>{employeeToDelete.fullName}</b> and remove their data from our systems.
                </Text>
                <HStack justifyContent="flex-end" gap={4}>
                  <Button colorScheme="gray" variant="outline" onClick={() => setEmployeeToDelete(null)}>Cancel</Button>
                  <Button colorScheme="red" loading={deleteMutation.isPending} onClick={handleConfirmDelete}>Delete</Button>
                </HStack>
              </Box>
            </Box>
        )}

        {isLoading && <Spinner></Spinner>}

        <Stack justifyContent={"center"} alignItems={"center"} height={"100%"}>
          {/* 👈 МАГИЯ ЗДЕСЬ: Добавили overflowX="auto", чтобы таблица скроллилась вбок на мобилке */}
          <Table.ScrollArea borderWidth="1px" rounded="md" height="75vh" width={{base:"95vw", md: "80vw"}} overflowX="auto">
            <Table.Root size={{base: "sm", sm: "md", lg: "lg"}} stickyHeader>
              <Table.Header>
                <Table.Row bg="bg.subtle">
                  {/* Убрали все hideBelow! Ничего не пропадает! */}
                  <Table.ColumnHeader></Table.ColumnHeader>
                  <Table.ColumnHeader>Full Name {getIcon("fullName", sortOptions)}</Table.ColumnHeader>
                  <Table.ColumnHeader>Department{getIcon("department", sortOptions)}</Table.ColumnHeader>
                  <Table.ColumnHeader>Salary{getIcon("salary", sortOptions)}</Table.ColumnHeader>
                  <Table.ColumnHeader>Birthdate{getIcon("birthdate", sortOptions)}</Table.ColumnHeader>
                  {isAdmin && <Table.ColumnHeader>Changes</Table.ColumnHeader>}
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {sortedEmployees.map((empl) => (
                    <Table.Row key={empl.id} >
                      <Table.Cell>
                        <Avatar.Root size={{base:"sm", lg: "lg"}} >
                          <Avatar.Fallback name={empl.fullName} />
                          <Avatar.Image src={empl.avatar} />
                        </Avatar.Root>
                      </Table.Cell>
                      <Table.Cell whiteSpace="nowrap">{empl.fullName}</Table.Cell>
                      <Table.Cell>{empl.department}</Table.Cell>
                      <Table.Cell>{empl.salary}</Table.Cell>
                      <Table.Cell whiteSpace="nowrap">{empl.birthdate}</Table.Cell>

                      {isAdmin && (
                          <Table.Cell>
                            <IconButton
                                aria-label="Delete"
                                colorScheme="red"
                                variant="ghost"
                                size="sm"
                                onClick={() => setEmployeeToDelete(empl)}
                            >
                              <FaTrash />
                            </IconButton>
                          </Table.Cell>
                      )}
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
