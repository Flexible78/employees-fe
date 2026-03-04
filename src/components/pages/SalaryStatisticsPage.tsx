import { Chart, useChart } from "@chakra-ui/charts";
import { Spinner, Stack, Text } from "@chakra-ui/react";
import _ from "lodash";
import { useMemo } from "react";
import {
  CartesianGrid,
  Line,
  LineChart,
  Tooltip as RechartsTooltip,
  XAxis,
  YAxis,
} from "recharts";
import employeesConfig from "../../config/employees-config";
import useEmployees from "../../services/hooks/useEmployees";

type SalaryPoint = {
  amount: number;
  value: number;
};

const SalaryStatisticsPage = () => {
  const { employees, isLoading } = useEmployees();
  const data: SalaryPoint[] = useMemo(() => {
    const interval = employeesConfig.salary.interval;
    if (!employees.length) {
      return [];
    }

    // Group employees into salary buckets by configured interval (e.g. every 5000).
    const grouped = _.countBy(
      employees,
      (employee) => Math.floor(employee.salary / interval) * interval,
    );

    return Object.entries(grouped)
      .map(([amount, value]) => ({ amount: Number(amount), value }))
      .sort((a, b) => a.amount - b.amount);
  }, [employees, employeesConfig.salary.interval]);

  const chart = useChart({
    data,
    series: [{ name: "value", label: "Employees", color: "teal.solid" }],
  });

  return (
    <Stack gap={6} px={{ base: 3, md: 6 }} pb={6}>
      <Text fontSize={{ base: "2rem", md: "2.5rem" }} fontWeight="semibold">
        Salary Statistics ({data.length} intervals)
      </Text>
      {isLoading && <Spinner />}
      {!isLoading && data.length === 0 && (
        <Text color="fg.muted">No employees available for salary statistics.</Text>
      )}
      {!isLoading && data.length > 0 && (
        <Chart.Root chart={chart} maxW="6xl">
          <LineChart data={chart.data} margin={{ top: 12, right: 12, left: 8, bottom: 8 }}>
            <CartesianGrid vertical={false} />
            <XAxis
              axisLine={false}
              dataKey={chart.key("amount")}
              tickLine={false}
              tickMargin={8}
              tickFormatter={(value: number) => `$${value.toLocaleString()}`}
            />
            <YAxis allowDecimals={false} axisLine={false} tickLine={false} tickMargin={8} />
            <RechartsTooltip
              cursor={false}
              content={
                <Chart.Tooltip
                  formatter={(value) => [`${value}`, "Employees"]}
                  labelFormatter={(value) => `From $${Number(value).toLocaleString()}`}
                />
              }
            />
            <Line
              activeDot={{ r: 6 }}
              dataKey={chart.key("value")}
              dot={{ fill: chart.color("teal.solid") }}
              stroke={chart.color("teal.solid")}
              strokeWidth={2}
              type="monotone"
            />
          </LineChart>
        </Chart.Root>
      )}
    </Stack>
  );
};

export default SalaryStatisticsPage
