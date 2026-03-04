import useEmployees from "../../services/hooks/useEmployees";
import employeesConfig from "../../config/employees-config";
import StatisticsLineChart from "../StatisticsLineChart";

const SalaryStatisticsPage = () => {
  const { employees } = useEmployees();
  
  return (
    <StatisticsLineChart numbers={employees.map(empl => empl.salary)} interval={employeesConfig.salary.interval} xLine={"Salaries"} title={"Salaries Distibution Line Chart"} ></StatisticsLineChart>
  );
};

export default SalaryStatisticsPage;
