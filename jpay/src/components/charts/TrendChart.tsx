import { BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts'
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { MonthlyTrendData } from '@/utils/chartData'
import { formatChartValue, formatTrendChartData } from '@/utils/chartData'

interface TrendChartProps {
  data: MonthlyTrendData[]
  title?: string
}

const chartConfig = {
  me: {
    label: "내 지출",
    color: "#3b82f6",
  },
  partner: {
    label: "상대방 지출", 
    color: "#ef4444",
  },
  total: {
    label: "총 지출",
    color: "#10b981",
  },
}

export default function TrendChart({ data, title = "월별 지출 트렌드" }: TrendChartProps) {
  const chartData = formatTrendChartData(data)

  if (!data.length) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-[250px] text-muted-foreground">
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
        <ChartContainer config={chartConfig} className="h-[250px]">
          <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="month" 
              axisLine={false}
              tickLine={false}
              className="text-xs"
            />
            <YAxis 
              axisLine={false}
              tickLine={false}
              className="text-xs"
              tickFormatter={(value) => `${Math.round(value / 10000)}만`}
            />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  formatter={(value, name) => [
                    formatChartValue(value as number),
                    chartConfig[name as keyof typeof chartConfig]?.label || name,
                  ]}
                />
              }
            />
            <Bar 
              dataKey="me" 
              fill="var(--color-me)" 
              radius={[2, 2, 0, 0]}
              name="me"
            />
            <Bar 
              dataKey="partner" 
              fill="var(--color-partner)" 
              radius={[2, 2, 0, 0]}
              name="partner"
            />
          </BarChart>
        </ChartContainer>
        
        {/* 범례 */}
        <div className="flex justify-center gap-6 mt-4">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded bg-[#3b82f6]" />
            <span className="text-sm">내 지출</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded bg-[#ef4444]" />
            <span className="text-sm">상대방 지출</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}