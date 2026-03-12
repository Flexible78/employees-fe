import { Avatar, IconButton, Spinner, Stack, Table } from "@chakra-ui/react";
import { FC, useMemo } from "react";
import { Employee } from "../models/Employee";
import { SortByFieldsStore, SortField, useSortByFields } from "../state-management/sort-store";
import orderBy from "lodash/orderBy"
import {BsThreeDots}  from "react-icons/bs"
import DialogShaper from "./DialogShaper";
import EmployeeCard from "./EmployeeCard";

type Props = {
  employees: Employee[];
  isLoading: boolean;
};

function getSortingFields(sortOptions:SortByFieldsStore): SortField[] {
      const keys: SortField[] = Object.keys(sortOptions) as SortField[]
      return keys.filter(k => sortOptions[k] == "asc" || sortOptions[k] == "desc")
}
const EmployeesPortrait: FC<Props> = ({employees, isLoading}) => {
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
         width="95vw">
          <Table.Root size="sm" stickyHeader>
            <Table.Header>
              <Table.Row bg="bg.subtle">
                <Table.ColumnHeader ></Table.ColumnHeader>
                <Table.ColumnHeader textAlign="center">Employees </Table.ColumnHeader>
               <Table.ColumnHeader ></Table.ColumnHeader>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {sortedEmployees.map((empl) => (
                <Table.Row key={empl.id} >
                  <Table.Cell  >
                    <Avatar.Root size="lg" >
                      <Avatar.Fallback name={empl .fullName} />
                      <Avatar.Image src={empl.avatar} />
                    </Avatar.Root>
                  </Table.Cell>
                  <Table.Cell>{empl.fullName}</Table.Cell>
                  <Table.Cell>
                    <DialogShaper
                      trigger={(
                        <IconButton aria-label="Details" bg="white" color="black" size="sm">
                          <BsThreeDots />
                        </IconButton>
                      )}
                      content={<EmployeeCard employee={empl} />}
                    />
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table.Root>
        </Table.ScrollArea>
      </Stack>
    </>
  );
};

export default EmployeesPortrait;

