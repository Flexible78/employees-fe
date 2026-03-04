import { Chart, useChart } from "@chakra-ui/charts";
import { Box, Spinner, Stack, Text } from "@chakra-ui/react";
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

const salaryInterval = employeesConfig.salary.interval;
const formatCurrency = (value: number) => `$${value.toLocaleString()}`;
const desktopViewportOffset = "170px";

const SalaryStatisticsPage = () => {
  const { employees, isLoading } = useEmployees();

  const data: SalaryPoint[] = useMemo(() => {
    return _.chain(employees)
      .map("salary")
      .map((salary) => Number(salary))
      .filter((salary) => Number.isFinite(salary))
      .map((salary) => Math.floor(salary / salaryInterval) * salaryInterval)
      .countBy()
      .toPairs()
      .map(([amount, value]) => ({ amount: Number(amount), value }))
      .sortBy("amount")
      .value();
  }, [employees]);

  const chart = useChart({
    data,
    series: [{ name: "value", label: "Employees", color: "teal.solid" }],
  });

  const hasData = data.length > 0;

  return (
    <Stack
      gap={{ base: 6, md: 4 }}
      h={{ md: `calc(100vh - ${desktopViewportOffset})` }}
      px={{ base: 3, md: 6 }}
      pb={{ base: 6, md: 0 }}
    >
      <Text fontSize={{ base: "2rem", md: "2.5rem" }} fontWeight="semibold">
        Salary Statistics ({data.length} intervals)
      </Text>
      {isLoading ? (
        <Spinner />
      ) : !hasData ? (
        <Text color="fg.muted">No employees available for salary statistics.</Text>
      ) : (
        <Box flex={{ md: 1 }} minH={{ md: 0 }}>
          <Chart.Root
            aspectRatio={{ base: "landscape", md: "auto" }}
            chart={chart}
            h={{ md: "100%" }}
            maxW="6xl"
            w="100%"
          >
            <LineChart
              accessibilityLayer
              data={chart.data}
              margin={{ top: 12, right: 12, left: 8, bottom: 8 }}
              responsive
            >
              <CartesianGrid vertical={false} />
              <XAxis
                axisLine={false}
                dataKey={chart.key("amount")}
                tickLine={false}
                tickMargin={8}
                tickFormatter={(value: number) => formatCurrency(value)}
              />
              <YAxis allowDecimals={false} axisLine={false} tickLine={false} tickMargin={8} />
              <RechartsTooltip
                cursor={false}
                content={
                  <Chart.Tooltip
                    formatter={(value) => [`${value}`, "Employees"]}
                    labelFormatter={(value) => `From ${formatCurrency(Number(value))}`}
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
        </Box>
      )}
    </Stack>
  );
};

export default SalaryStatisticsPage
