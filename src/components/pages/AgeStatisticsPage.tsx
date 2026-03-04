import _ from "lodash";
import { useMemo } from "react";
import StatisticsLineChart, {
  StatisticsPoint,
} from "../StatisticsLineChart";
import useEmployees from "../../services/hooks/useEmployees";

const ageInterval = 10;

const getAge = (birthdate: string): number | null => {
  const birth = new Date(birthdate);
  if (Number.isNaN(birth.getTime())) {
    return null;
  }

  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();
  const dayDiff = today.getDate() - birth.getDate();
  if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
    age -= 1;
  }

  return age >= 0 ? age : null;
};

const AgeStatisticsPage = () => {
  const { employees, isLoading } = useEmployees();

  const data: StatisticsPoint[] = useMemo(() => {
    const ages = employees
      .map((employee) => getAge(employee.birthdate))
      .filter((age): age is number => age !== null);

    return _.chain(ages)
      .countBy((age) => Math.floor(age / ageInterval))
      .toPairs()
      .map(([key, value]) => ({
        amount: value,
        value: +key * ageInterval + ageInterval,
      }))
      .sortBy("value")
      .value();
  }, [employees]);

  return (
    <StatisticsLineChart
      data={data}
      isLoading={isLoading}
      title="Age Distribution Statistics"
      xAxisLabel="Age"
      yAxisLabel="Employees"
    />
  );
}

export default AgeStatisticsPage
