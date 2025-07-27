import { PieChart, Pie, Cell } from 'recharts'
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import type { ChartDataPoint } from '@/utils/chartData'
import { formatChartValue, formatPercentage } from '@/utils/chartData'

interface CategoryChartProps {
  data: ChartDataPoint[]
  title?: string
}

const chartConfig = {
  amount: {
    label: "금액",
  },
}

export default function CategoryChart({ data, title = "카테고리별 지출" }: CategoryChartProps) {
  if (!data.length) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-[200px] text-muted-foreground">
            아직 지출 데이터가 없습니다
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* 파이 차트 */}
          <ChartContainer config={chartConfig} className="h-[200px]">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="amount"
              >
                {data.map((entry) => (
                  <Cell key={entry.category} fill={entry.color} />
                ))}
              </Pie>
              <ChartTooltip
                content={
                  <ChartTooltipContent
                    formatter={(value, name) => [
                      formatChartValue(value as number),
                      name,
                    ]}
                  />
                }
              />
            </PieChart>
          </ChartContainer>

          {/* 범례 */}
          <div className="space-y-2">
            {data.map((item) => (
              <div key={item.category} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-sm font-medium">{item.label}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold">
                    {formatChartValue(item.amount)}
                  </span>
                  <Badge variant="secondary" className="text-xs">
                    {formatPercentage(item.percentage)}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}