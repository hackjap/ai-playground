import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Button } from '@/components/ui/button'
import { formatCurrency } from '@/lib/utils'

export default function Dashboard() {
  // 임시 데이터 (향후 Zustand store에서 가져올 예정)
  const balanceAmount = 15000
  const monthlySpent = 450000
  const monthlyBudget = 800000
  const budgetPercentage = Math.round((monthlySpent / monthlyBudget) * 100)

  const quickStats = [
    { label: '이번 달 총 지출', value: formatCurrency(monthlySpent) },
    { label: '어제 지출', value: formatCurrency(35000) },
    { label: '예산 대비 사용률', value: `${budgetPercentage}%` },
    { label: '가장 많은 카테고리', value: '외식' },
  ]

  const recentExpenses = [
    { description: '스타벅스 커피', amount: 8500, payer: 'A', category: '외식' },
    { description: '마트 장보기', amount: 45000, payer: 'B', category: '생활' },
    { description: '영화 티켓', amount: 32000, payer: 'A', category: '문화' },
  ]

  return (
    <div className="container mx-auto p-4 space-y-6 pb-20">
      {/* Header */}
      <header className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-slate-900">PairPay</h1>
        <Button variant="ghost" size="sm">
          ⚙️
        </Button>
      </header>

      {/* Balance Card */}
      <Card className="p-6 text-center bg-gradient-to-r from-primary-50 to-primary-100 border-primary-200">
        <CardContent className="p-0">
          <Badge variant="secondary" className="mb-2">
            A가 B에게
          </Badge>
          <div className="text-3xl font-bold text-primary-600 mb-2">
            {formatCurrency(balanceAmount)}
          </div>
          <p className="text-slate-600">받을 금액</p>
        </CardContent>
      </Card>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-2 gap-4">
        {quickStats.map((stat, index) => (
          <Card key={index}>
            <CardContent className="p-4">
              <div className="text-sm text-slate-600 mb-1">{stat.label}</div>
              <div className="text-lg font-bold">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Budget Progress */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">월 예산</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between text-sm">
              <span>{formatCurrency(monthlySpent)}</span>
              <span>{formatCurrency(monthlyBudget)}</span>
            </div>
            <Progress 
              value={budgetPercentage} 
              variant={budgetPercentage > 80 ? 'danger' : budgetPercentage > 60 ? 'warning' : 'default'}
            />
            <div className="text-center">
              <Badge variant={budgetPercentage > 80 ? 'destructive' : 'secondary'}>
                {budgetPercentage}% 사용
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recent Expenses */}
      <Card>
        <CardHeader>
          <CardTitle>최근 지출</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {recentExpenses.map((expense, index) => (
            <div key={index} className="flex justify-between items-center">
              <div>
                <div className="font-medium">{expense.description}</div>
                <Badge variant="outline" className="text-xs mt-1">
                  {expense.category}
                </Badge>
              </div>
              <div className="text-right">
                <div className="font-bold">{formatCurrency(expense.amount)}</div>
                <div className="text-sm text-slate-500">{expense.payer}</div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* FAB */}
      <Button 
        className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg z-50"
        size="icon"
      >
        <span className="text-2xl">+</span>
      </Button>
    </div>
  )
}