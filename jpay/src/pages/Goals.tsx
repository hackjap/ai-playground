import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { formatCurrency } from '@/lib/utils'
import { useGoals } from '@/hooks/useGoals'
import { getTotalSavingsForGoal } from '@/lib/supabase'
import { Plus, Target } from 'lucide-react'

export default function Goals() {
  const [pairId, setPairId] = useState<string | null>(null)
  const [goalsWithProgress, setGoalsWithProgress] = useState<any[]>([])
  const { data: goals, isLoading } = useGoals(pairId)

  useEffect(() => {
    const savedPairId = localStorage.getItem('jpay_current_pair_id')
    if (savedPairId) {
      setPairId(savedPairId)
    }
  }, [])

  useEffect(() => {
    if (goals) {
      const updateGoalsWithProgress = async () => {
        const goalsWithCurrentAmount = await Promise.all(
          goals.map(async (goal) => {
            const currentAmount = await getTotalSavingsForGoal(goal.id)
            const progressPercentage = Math.min((currentAmount / goal.target_amount) * 100, 100)
            
            return {
              ...goal,
              currentAmount,
              progressPercentage
            }
          })
        )
        setGoalsWithProgress(goalsWithCurrentAmount)
      }
      
      updateGoalsWithProgress()
    }
  }, [goals])

  if (isLoading || !pairId) {
    return (
      <div className="container mx-auto p-4 flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="text-lg font-medium">목표 로딩 중...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-4 space-y-6 pb-20">
      <header className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Target className="h-6 w-6 text-primary-600" />
          <h1 className="text-2xl font-bold text-slate-900">저축 목표</h1>
        </div>
        <Link to="/goals/new">
          <Button size="sm">
            <Plus className="h-4 w-4 mr-1" />
            목표 추가
          </Button>
        </Link>
      </header>

      {goalsWithProgress.length === 0 ? (
        <Card className="p-8 text-center">
          <CardContent className="p-0">
            <Target className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">첫 번째 저축 목표를 만들어보세요</h3>
            <p className="text-muted-foreground mb-6">
              여행, 가전제품 구매 등 함께 이루고 싶은 목표를 설정하고 달성해보세요
            </p>
            <Link to="/goals/new">
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                목표 만들기
              </Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {goalsWithProgress.map((goal) => (
            <Link key={goal.id} to={`/goals/${goal.id}`}>
              <Card className="hover:shadow-md transition-shadow cursor-pointer">
                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg mb-2">{goal.name}</CardTitle>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <span>{formatCurrency(goal.currentAmount)}</span>
                        <span>/</span>
                        <span>{formatCurrency(goal.target_amount)}</span>
                        {goal.deadline && (
                          <>
                            <span>•</span>
                            <span>목표일: {new Date(goal.deadline).toLocaleDateString()}</span>
                          </>
                        )}
                      </div>
                    </div>
                    <Badge variant={goal.is_completed ? "default" : "secondary"}>
                      {goal.is_completed ? "완료" : `${Math.round(goal.progressPercentage)}%`}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="space-y-2">
                    <Progress value={goal.progressPercentage} className="h-2" />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>
                        남은 금액: {formatCurrency(Math.max(0, goal.target_amount - goal.currentAmount))}
                      </span>
                      {goal.deadline && !goal.is_completed && (
                        <span>
                          {Math.ceil((new Date(goal.deadline).getTime() - Date.now()) / (1000 * 60 * 60 * 24))}일 남음
                        </span>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}