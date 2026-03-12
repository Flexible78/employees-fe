import { Avatar, Card, HStack, Stack, Text } from "@chakra-ui/react";
import { FC } from "react";
import { Employee } from "../models/Employee";
import { useUserData } from "../state-management/auth-store";
import DeleteEmployee from "./DeleteEmployee";
import EditEmployee from "./EditEmployee";
type Props = {
  employee: Employee;
};

function resolveBirthdate(employee: Employee): string {
  const rawValue =
    (employee as { birthdate?: unknown }).birthdate ??
    (employee as { birthDate?: unknown }).birthDate ??
    (employee as { birthday?: unknown }).birthday ??
    "";
  const trimmed = typeof rawValue === "string" ? rawValue.trim() : String(rawValue).trim();
  if (!trimmed) {
    return "-";
  }
  const date = new Date(trimmed);
  if (Number.isNaN(date.getTime())) {
    return trimmed;
  }
  return date.toISOString().slice(0, 10);
}

const EmployeeCard: FC<Props> = ({ employee }) => {
  const role = useUserData((s) => s.role);
  const birthdateValue = resolveBirthdate(employee);

  return (
    <Card.Root width={{ base: "90vw", sm: "sm" }}>
      <Card.Header>
        <HStack gap="3">
          <Avatar.Root size="lg">
            <Avatar.Fallback name={employee.fullName} />
            <Avatar.Image src={employee.avatar} />
          </Avatar.Root>
          <Stack gap="1">
            <Card.Title>{employee.fullName}</Card.Title>
            <Text color="fg.muted" fontSize="sm">
              {employee.department}
            </Text>
          </Stack>
        </HStack>
      </Card.Header>
      <Card.Body>
        <Stack gap="2">
          <HStack justifyContent="space-between">
            <Text fontWeight="semibold">Salary</Text>
            <Text>{employee.salary}</Text>
          </HStack>
          <HStack justifyContent="space-between">
            <Text fontWeight="semibold">Birthdate</Text>
            <Text>{birthdateValue}</Text>
          </HStack>
        </Stack>
      </Card.Body>
      {role === "ADMIN" && (
        <Card.Footer>
          <HStack gap="2" justifyContent="flex-end">
            <EditEmployee employee={employee} />
            <DeleteEmployee empl={employee} />
          </HStack>
        </Card.Footer>
      )}
    </Card.Root>
  );
};

export default EmployeeCard;
