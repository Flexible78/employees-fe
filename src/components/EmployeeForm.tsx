import { FC } from "react";
import { Employee } from "../models/Employee";
import { useForm } from "react-hook-form";
import {
  Button,
  Field,
  HStack,
  Input,
  NativeSelect,
  SimpleGrid,
  Stack,
} from "@chakra-ui/react";
import employeesConfig from "../config/employees-config";
import { getIsoDateFromAge } from "../utils/date_functions";
type Props = {
  employee?: Employee;
  submitter: (empl: Employee) => void;
  layout?: "page" | "dialog";
};
const EmployeeForm: FC<Props> = ({ employee, submitter, layout = "page" }) => {
  const isDialogLayout = layout === "dialog";
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<Employee>({ defaultValues: employee });

  return (
    <Stack
      as="form"
      onSubmit={handleSubmit((data) => submitter(data))}
      onReset={(event) => {
        employee && event.preventDefault();
        reset(employee);
      }}
      width="100%"
      maxW={isDialogLayout ? "100%" : "960px"}
      mx={isDialogLayout ? 0 : "auto"}
      px={isDialogLayout ? 0 : { base: 4, sm: 6, md: 8 }}
      py={isDialogLayout ? 0 : { base: 4, md: 6 }}
      justifyContent="flex-start"
      gap={isDialogLayout ? 4 : 8}
    >
      <SimpleGrid
        columns={
          isDialogLayout
            ? {
                base: 1,
                md: 2,
              }
            : {
                base: 1,
                sm: 2,
              }
        }
        gap={isDialogLayout ? 4 : 10}
        width="100%"
      >
        <Field.Root
          invalid={!!errors.department}
          width={isDialogLayout ? "100%" : "80%"}
        >
          <Field.Label>Department</Field.Label>
          <NativeSelect.Root>
            <NativeSelect.Field
              placeholder="Select department"
              {...register("department", { required: true })}
            >
              {employeesConfig.departments.map((d) => (
                <option value={d} key={d}>
                  {d}
                </option>
              ))}
            </NativeSelect.Field>

            <NativeSelect.Indicator />
          </NativeSelect.Root>
          <Field.ErrorText>Selection of Department is required</Field.ErrorText>
        </Field.Root>
        <Field.Root
          invalid={!!errors.fullName}
          required
          width={isDialogLayout ? "100%" : "80%"}
        >
          <Field.Label>Full Name</Field.Label>
          <Input
            placeholder="Enter full name"
            {...register("fullName", { required: true })}
          />
          <Field.ErrorText>Name is required</Field.ErrorText>
        </Field.Root>
        <Field.Root
          invalid={!!errors.birthdate}
          required
          width={isDialogLayout ? "100%" : "80%"}
        >
          <Field.Label>Birthdate</Field.Label>
          <Input
            type="date"
            readOnly={!!employee?.birthdate}
            {...register("birthdate", { required: true })}
            min={getIsoDateFromAge(employeesConfig.age.max)}
            max={getIsoDateFromAge(employeesConfig.age.min)}
          />
          <Field.ErrorText>Birthdate is required</Field.ErrorText>
        </Field.Root>
        <Field.Root
          invalid={!!errors.salary}
          required
          width={isDialogLayout ? "100%" : "80%"}
        >
          <Field.Label>Salary</Field.Label>
          <Input
            placeholder="Enter salary"
            type="number"
            {...register("salary", {
              required: true,
              valueAsNumber: true,
              min: employeesConfig.salary.min,
              max: employeesConfig.salary.max,
            })}
          />
          <Field.ErrorText>{`salary should be in range [${employeesConfig.salary.min}-${employeesConfig.salary.max}]`}</Field.ErrorText>
        </Field.Root>
      </SimpleGrid>
      <HStack
        justifyContent={isDialogLayout ? "flex-end" : "center"}
        flexWrap="wrap"
        gap={3}
      >
        <Button type="submit" size={isDialogLayout ? "md" : "xl"} variant="subtle">
          {!!employee ? "OK" : "Save"}
        </Button>
        <Button type="reset" size={isDialogLayout ? "md" : "xl"} variant="subtle">
          {!!employee ? "Undo" : "Reset"}
        </Button>
        {!!employee && (
          <Button
            type="button"
            onClick={() => submitter(employee)}
            size={isDialogLayout ? "md" : "xl"}
            variant="outline"
          >
            Cancel
          </Button>
        )}
      </HStack>
    </Stack>
  );
};

export default EmployeeForm;
