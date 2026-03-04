import { Box, Text } from '@chakra-ui/react'
import _ from "lodash"
import useEmployees from '../../services/hooks/useEmployees'
import { useMemo } from 'react'
import employeesConfig from '../../config/employees-config'
const SalaryStatisticsPage = () => {
  const {employees} = useEmployees()
  const data: {amount: number, value: number}[] = useMemo(() => {
//TODO 
     return []
  }, [employees, employeesConfig.salary.interval])
  return (
    <Box>
      <Text fontSize="2.5rem">Salary Statistics Page ({data.length})</Text>
    </Box>
  )
}

export default SalaryStatisticsPage
