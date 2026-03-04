import {FC, useMemo} from 'react'
import _ from "lodash"
import { Chart, useChart } from '@chakra-ui/charts'
import { VStack, Text } from '@chakra-ui/react'
import {
  CartesianGrid,
  Line,
  LineChart,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
type Props = {
    numbers: number[],
    interval: number,
    xLine: string,
    title: string
}
const StatisticsLineChart: FC<Props> = ({numbers, interval, xLine, title}) => {
 const data: { amount: number; value: number }[] = useMemo(() => {
    const objStat = _.countBy(numbers, (num) => Math.floor(num / interval));
    const data: { amount: number; value: number }[] = Object.entries(
      objStat,
    ).map(([key, value]) => ({
      amount: value,
      value: +key * interval + interval,
    }));
    return data;
}, [numbers, interval]);
const chart = useChart({
    data,
    series: [{ name: "amount", color: "teal.solid" }],
  });
return (
    <VStack justifyContent={"center"} alignItems={"center"} px={2} marginTop={{base: "15vh", sm:0}}>
          <Text as="h1" fontWeight={"bold"} fontSize={"1.2rem"}>{title}</Text>
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
                  stroke={chart.color("border")}
                  label={{ value: xLine, position: "bottom" }}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tickMargin={10}
                  stroke={chart.color("border")}
                  label={{ value: "Employees", position: "left", angle: -90 }}
                />
                <Tooltip
                  animationDuration={100}
                  cursor={false}
                  content={<Chart.Tooltip />}
                />
                {chart.series.map((item) => (
                  <Line
                    key={item.name}
                    isAnimationActive={false}
                    dataKey={chart.key(item.name)}
                    stroke={chart.color(item.color)}
                    strokeWidth={2}
                    dot={false}
                  />
                ))}
              </LineChart>
          </Chart.Root>
        </VStack>
  )
}
   
  

export default StatisticsLineChart
