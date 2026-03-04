import useEmployees from "../../services/hooks/useEmployees";
import employeesConfig from "../../config/employees-config";
import StatisticsLineChart from "../StatisticsLineChart";
function getAge(birthdate: string): number {
  return new Date().getFullYear() - new Date(birthdate).getFullYear()
}

const AgeStatisticsPage = () => {
  const { employees } = useEmployees();
  
  return (
    <StatisticsLineChart numbers={employees.map(empl => getAge(empl.birthdate))} interval={employeesConfig.age.interval} xLine={"Age"} title={"Age Distibution Line Chart"} ></StatisticsLineChart>
  );
};

export default AgeStatisticsPage;