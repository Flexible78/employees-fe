import { Avatar, IconButton, Spinner, Stack, Table } from "@chakra-ui/react";
import { FC, ReactNode, useMemo } from "react";
import { Employee } from "../models/Employee";
import {FaSort, FaSortUp, FaSortDown} from "react-icons/fa"
import { Order, SortByFieldsStore, SortField, useSortByFields } from "../state-management/sort-store";
import orderBy from "lodash/orderBy"
import { useUserData } from "../state-management/auth-store";
import useEmployeesMutation from "../services/hooks/useEmployeesMutation";
import apiClient from "../services/ApiClientImpl";
import ConfirmDialog from "./ConfirmationDialog";
import { MdDelete } from "react-icons/md";

type Props = {
  employees: Employee[]
  isLoading: boolean
}
function updateSortingState(field: SortField, sortOptions: SortByFieldsStore):void {
    const order = sortOptions[field] ;
    let newOrder: Order = "asc"
    if (order != "no") {
      newOrder = order == "asc" ? "desc" : "asc";
    }
    sortOptions.setOrder(field, newOrder)
}
function getIcon(field: SortField, sortOptions: SortByFieldsStore): ReactNode {
  const order = sortOptions[field] ;
  let result: ReactNode = <FaSort></FaSort>
  if (order != "no") {
    result = order == "asc" ? <FaSortUp> </FaSortUp> : <FaSortDown></FaSortDown>
  }
  return<IconButton size="xs" marginLeft={2} onClick={() => updateSortingState(field, sortOptions)}>{ result}</IconButton>;
}
function getSortingFields(sortOptions:SortByFieldsStore): SortField[] {
      const keys: SortField[] = Object.keys(sortOptions) as SortField[]
      return keys.filter(k => sortOptions[k] == "asc" || sortOptions[k] == "desc")
}
const Employees: FC<Props> = ({employees, isLoading}) => {
  const role = useUserData(s => s.role)
  const mutationDel = useEmployeesMutation<Employee, string>((id) => apiClient.deleteEmployee(id))
  const sortOptions = useSortByFields();
  const sortedEmployees: Employee[] = useMemo(()=>{
    const sortFields: SortField[] = getSortingFields(sortOptions);
    let result: Employee[] = []
    result = sortFields.length == 0 ? orderBy(employees, ["id"], ["asc"]) : orderBy(employees, sortFields,
      sortFields.map(sf => (sortOptions as any)[sf])
     )
    return result;
  }, [employees, sortOptions] )
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
                {role == "ADMIN" && <Table.ColumnHeader ></Table.ColumnHeader>}
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {sortedEmployees.map((empl) => (
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
                   { role === "ADMIN" && <Table.Cell >
                       <ConfirmDialog content={`Deleting employee ${empl.fullName}` } onClose={(isDelete) => {
                        isDelete && mutationDel.mutate(empl.id!)
                       }} isPending={mutationDel.isPending} icon={<MdDelete></MdDelete>}></ConfirmDialog>
                      </Table.Cell>}
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
