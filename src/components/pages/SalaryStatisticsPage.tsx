import _ from "lodash";
import { useMemo } from "react";
import employeesConfig from "../../config/employees-config";
import useEmployees from "../../services/hooks/useEmployees";
import StatisticsLineChart, {
  StatisticsPoint,
} from "../StatisticsLineChart";

const SalaryStatisticsPage = () => {
  const { employees, isLoading } = useEmployees();

  const data: StatisticsPoint[] = useMemo(() => {
    const numbers: number[] = employees.map((empl) => empl.salary);
    const interval = employeesConfig.salary.interval;

    return _.chain(numbers)
      .countBy((num) => Math.floor(num / interval))
      .toPairs()
      .map(([key, value]) => ({
        amount: value,
        value: +key * interval + interval,
      }))
      .sortBy("value")
      .value();
  }, [employees, employeesConfig.salary.interval]);

  return (
    <StatisticsLineChart
      data={data}
      isLoading={isLoading}
      title="Salaries Distribution Statistics"
      xAxisLabel="Salary(NIS)"
      xTickFormatter={(value) => value.toLocaleString()}
      yAxisLabel="Employees"
    />
  );
};

export default SalaryStatisticsPage;
