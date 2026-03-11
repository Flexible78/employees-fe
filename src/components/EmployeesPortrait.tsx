import { Stack, Table, Text } from "@chakra-ui/react"
import { useMemo, type FC } from "react"
import type { Employee } from "../models/Employee"
import { useSortByFields, type SortByFieldStore, type SortField } from "../store/sort-store"
import { orderBy } from "lodash"
import AvatarMenu from "./AvatarMenu"


type Props = {
    employees: Employee[],
}



function getSortingFields (sortOption: SortByFieldStore): SortField[] {
    const keys: SortField[] = Object.keys(sortOption) as SortField[];
    return keys.filter(key => sortOption[key] === "asc" || sortOption[key] === "desc")
}

const EmployeesPortrait: FC<Props> = ({employees}) => {
    const sortOptions = useSortByFields();
    const sortedEmployees: Employee[] = useMemo(() => {
        const sortField: SortField[] = getSortingFields(sortOptions);
        const result: Employee[] = sortField.length == 0 ? orderBy(employees, ["id"], ["asc"]) : orderBy(employees, sortField, sortField.map(field => (sortOptions as any)[field]));
        return result
    }, [employees, sortOptions])


    return (
        <Stack justifyContent={"center"} alignItems={"center"} height={"100%"}>
            <Text>Control elements for filtering and sorting aveliable in landscape mode</Text>
            <Table.ScrollArea borderWidth="1px" rounded="md" height="80vh" width={"95vw"}>
                <Table.Root size={"sm"} stickyHeader>
                    <Table.Header>
                        <Table.Row bg="bg.subtle">
                            <Table.ColumnHeader></Table.ColumnHeader>
                            <Table.ColumnHeader>
                                Employee
                            </Table.ColumnHeader>
                        </Table.Row>
                    </Table.Header>

                    <Table.Body>
                        {sortedEmployees.map((employee) => (
                            <Table.Row key={employee.id}>
                                <Table.Cell>
                                    <AvatarMenu employee={employee}/>
                                </Table.Cell>
                                <Table.Cell>{employee.fullname}</Table.Cell>
                            </Table.Row>
                        ))}
                    </Table.Body>
                </Table.Root>
            </Table.ScrollArea>
        </Stack>
    )
}

export default EmployeesPortrait
