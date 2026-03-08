import { FC } from "react";
import { Employee } from "../models/Employee";
import { useForm } from "react-hook-form";
import { Button, Field, HStack, Input, NativeSelect, SimpleGrid, Stack } from "@chakra-ui/react";
import employeesConfig from "../config/employees-config";
import { getIsoDateFromAge } from "../utils/date_functions";
type Props = {
  submitter: (empl: Employee) => void;
};
const EmployeeForm: FC<Props> = ({ submitter }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Employee>();
  return (
    <Stack
      as="form"
      onSubmit={handleSubmit((data) => submitter(data))}
      height={"80vh"}
      justifyContent={"space-around"}
    >
      <SimpleGrid
        columns={{
          base: 1,
          sm: 2,
        }}
        gap={10} marginLeft={{
          base: "16",
          lg: 72
        }}
      >
        <Field.Root invalid={!!errors.department} width="80%" >
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
        <Field.Root invalid={!!errors.fullName} required width="80%">
          <Field.Label>Full Name</Field.Label>
          <Input placeholder="Enter full name"  {...register("fullName", {required: true})}/>
          <Field.ErrorText>Name is required</Field.ErrorText>
        </Field.Root>
        <Field.Root invalid={!!errors.birthdate} required width="80%">
          <Field.Label>Birthdate</Field.Label>
          <Input type="date"  {...register("birthdate", {required: true})}
          min={getIsoDateFromAge(employeesConfig.age.max) } max={getIsoDateFromAge(employeesConfig.age.min)} />
          <Field.ErrorText>Birthdate is required</Field.ErrorText>
        </Field.Root>
        <Field.Root invalid={!!errors.salary} required width="80%">
          <Field.Label>Salary</Field.Label>
          <Input placeholder="Enter salary" type="number"  {...register("salary",
             {required: true, valueAsNumber: true, min: employeesConfig.salary.min,
              max: employeesConfig.salary.max
             }
             )}/>
          <Field.ErrorText>{`salary should be in range [${employeesConfig.salary.min}-${employeesConfig.salary.max}]`}</Field.ErrorText>
        </Field.Root>      
      </SimpleGrid>
      <HStack justifyContent={"space-around"}>
        <Button type="submit" size={"xl"} variant="subtle">Save</Button>
        <Button type="reset" size={"xl"} variant="subtle">Reset</Button>
      </HStack>
    </Stack>
  );
};

export default EmployeeForm;
