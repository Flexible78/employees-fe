import {FC} from 'react'
import { FilterFields } from '../models/FilterFields'
import { Button, Field, HStack, Input, NativeSelect, SimpleGrid, Stack } from '@chakra-ui/react'
import employeesConfig from '../config/employees-config'
import { useForm } from 'react-hook-form'
type Props = {
    filterFields: FilterFields,
    submitter: (filterFilters: FilterFields) => void
}
const FiltersForm: FC<Props> = ({filterFields, submitter}) => {
    const {
       register,
       handleSubmit,
       formState:{errors},
       getValues
    } = useForm<FilterFields>({defaultValues: filterFields})
  return (
    <Stack
      as="form"
      onSubmit={handleSubmit((data) => submitter(data))}
      onReset={()=>submitter(filterFields)}
    >
      <SimpleGrid
        columns={{
          base: 1,
          sm: 2,
        }}
        gap={10} 
      >
        <Field.Root  width="80%" >
          <Field.Label>Department</Field.Label>
          <NativeSelect.Root>
            <NativeSelect.Field
              {...register("department")}
            >
                <option value="Departments">Departments</option>
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
        <Field.Root invalid={!!errors.minAge}  width="80%">
          <Field.Label>Min Age</Field.Label>
          <Input  type="number" {...register("minAge", {required: "Min Age must be defined", valueAsNumber: true,
            validate: {gteConfigMin: v => v >= employeesConfig.age.min || `Min Age must be greater or equal than ${employeesConfig.age.min}`,
            ltMaxValue: v => v < getValues("maxAge") || `Min Age must be less than ${getValues("maxAge")}`}
           })}/>
          <Field.ErrorText>{errors.minAge?.message}</Field.ErrorText>
        </Field.Root>
        <Field.Root invalid={!!errors.maxAge}  width="80%">
          <Field.Label>Max Age</Field.Label>
          <Input  type="number" {...register("maxAge", {required: "Max Age must be defined", valueAsNumber: true,
            validate: {lteConfigMax: v => v <= employeesConfig.age.max || `Max Age must be less or equal than ${employeesConfig.age.max}`,
            gtMinValue: v => v > getValues("minAge") || `Max Age must be greater than ${getValues("minAge")}`}
           })}/>
          <Field.ErrorText>{errors.maxAge?.message}</Field.ErrorText>
        </Field.Root>
        <Field.Root invalid={!!errors.minSalary}  width="80%">
          <Field.Label>Min Salary</Field.Label>
          <Input  type="number" {...register("minSalary", {required: "Min Salary must be defined",valueAsNumber: true,
            validate: {gteConfigMin: v => v >= employeesConfig.salary.min || `Min Salary must be greater or equal than ${employeesConfig.salary.min}`,
            ltMaxValue: v => v < getValues("maxSalary") || `Min Salary must be less than ${getValues("maxSalary")}`}
           })}/>
          <Field.ErrorText>{errors.minSalary?.message}</Field.ErrorText>
        </Field.Root>
        <Field.Root invalid={!!errors.maxSalary}  width="80%">
          <Field.Label>Max Salary</Field.Label>
          <Input  type="number" {...register("maxSalary", {required: "Max Salary must be defined",valueAsNumber: true,
            validate: {lteConfigMax: v => v <= employeesConfig.salary.max || `Max Salary must be less or equal than ${employeesConfig.salary.max}`,
            gtMinValue: v => v > getValues("minSalary") || `Max Salary must be greater than ${getValues("minSalary")}`}
           })}/>
          <Field.ErrorText>{errors.maxSalary?.message}</Field.ErrorText>
        </Field.Root>
       
      </SimpleGrid>
      <HStack justifyContent={"space-around"}>
        <Button type="submit" size={"xl"} variant="subtle">ok</Button>
        <Button type="reset" size={"xl"} variant="subtle">Cancel</Button>
      </HStack>
    </Stack>
  );
}

export default FiltersForm

