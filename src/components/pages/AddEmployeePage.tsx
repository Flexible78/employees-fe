import { Box, Text, Button } from '@chakra-ui/react'
import useEmployeesMutation from '../../services/hooks/useEmployeesMutation'
import apiClient from '../../services/ApiClientImpl'

const AddEmployeePage = () => {
  const mutation = useEmployeesMutation((empl) => apiClient.addEmployee(empl as any))
  return (
    <Box>
      <Text fontSize="2.5rem">Add Employee Page</Text>
      <Button onClick={() => mutation.mutate({id: "123",
     department: "QA",birthdate: "2000-01-01", fullName: "Pety IPetrov",salary: 10000})}>Add Dummy Employee</Button>
    </Box>
  )
}

export default AddEmployeePage
