import { Box, Text, Button } from "@chakra-ui/react";
import useEmployeesMutation from "../../services/hooks/useEmployeesMutation";
import apiClient from "../../services/ApiClientImpl";
import { Employee } from "../../models/Employee";
import EmployeeForm from "../EmployeeForm";
import { useState } from "react";
import { Navigate } from "react-router-dom";

const AddEmployeePage = () => {
  const mutation = useEmployeesMutation<Employee, Employee>((empl) =>
    apiClient.addEmployee(empl),
  );
  const [isHomeNavigate, setHomeNavigate] = useState(false)
  return (
    <>
    {isHomeNavigate && <Navigate to="/" />}
    <EmployeeForm submitter={(empl) => {mutation.mutate(empl); setHomeNavigate(true)}}></EmployeeForm>
    </>
    
  );
};

export default AddEmployeePage;
