import { Chart, useChart } from "@chakra-ui/charts";
import { Spinner, Text, VStack } from "@chakra-ui/react";
import { CartesianGrid, Line, LineChart, Tooltip, XAxis, YAxis } from "recharts";

export type StatisticsPoint = {
  amount: number;
  value: number;
};

type StatisticsLineChartProps = {
  data: StatisticsPoint[];
  isLoading?: boolean;
  title: string;
  xAxisLabel: string;
  yAxisLabel: string;
  xTickFormatter?: (value: number) => string;
  color?: string;
};

const StatisticsLineChart = ({
  data,
  isLoading = false,
  title,
  xAxisLabel,
  yAxisLabel,
  xTickFormatter,
  color = "teal.solid",
}: StatisticsLineChartProps) => {
  const chart = useChart({
    data,
    series: [{ name: "amount", color }],
  });

  return (
    <VStack
      justifyContent={"center"}
      alignItems={"center"}
      px={2}
      marginTop={{ base: "15vh", sm: 0 }}
      w={"100%"}
    >
      <Text as="h1" fontWeight={"bold"} fontSize={"1.2rem"}>
        {title}
      </Text>
      {isLoading && <Spinner></Spinner>}
      {!isLoading && !data.length && <Text color="fg.muted">No data for statistics</Text>}
      {!isLoading && data.length > 0 && (
        <Chart.Root
          chart={chart}
          width={{ base: "95vw", md: "80vw" }}
          h={{ base: "xs", sm: "60vh", md: "md" }}
        >
          <LineChart data={chart.data} responsive>
            <CartesianGrid stroke={chart.color("border")} vertical={false} />
            <XAxis
              axisLine={false}
              dataKey={chart.key("value")}
              label={{ value: xAxisLabel, position: "bottom" }}
              stroke={chart.color("border")}
              tickFormatter={(value) =>
                xTickFormatter ? xTickFormatter(Number(value)) : String(Number(value))
              }
            />
            <YAxis
              axisLine={false}
              label={{ value: yAxisLabel, position: "left", angle: -90 }}
              stroke={chart.color("border")}
              tickLine={false}
              tickMargin={10}
            />
            <Tooltip animationDuration={100} cursor={false} content={<Chart.Tooltip />} />
            {chart.series.map((item) => (
              <Line
                key={item.name}
                dataKey={chart.key(item.name)}
                dot={false}
                isAnimationActive={false}
                stroke={chart.color(item.color)}
                strokeWidth={2}
              />
            ))}
          </LineChart>
        </Chart.Root>
      )}
    </VStack>
  );
};

export default StatisticsLineChart;
