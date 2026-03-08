import useEmployees from "../../services/hooks/useEmployees";
import employeesConfig from "../../config/employees-config";
import StatisticsLineChart from "../StatisticsLineChart";
import { getAge } from "../../utils/date_functions";


const AgeStatisticsPage = () => {
  const { employees } = useEmployees();
  
  return (
    <StatisticsLineChart numbers={employees.map(empl => getAge(empl.birthdate))} interval={employeesConfig.age.interval} xLine={"Age"} title={"Age Distibution Line Chart"} ></StatisticsLineChart>
  );
};

export default AgeStatisticsPage;