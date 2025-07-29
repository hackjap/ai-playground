import { useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { formatCurrency } from '@/lib/utils'
import { useGoal, useUpdateGoal, useDeleteGoal } from '@/hooks/useGoals'
import { useSavingsLogs } from '@/hooks/useSavingsLogs'
import { ArrowLeft, Edit, Trash2, Plus, Calendar, Target, TrendingUp } from 'lucide-react'
import SavingsLogForm from '@/components/forms/SavingsLogForm'

export default function GoalDetail() {
  const { id: goalId } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [isSavingsFormOpen, setIsSavingsFormOpen] = useState(false)
  
  const { data: goal, isLoading: isLoadingGoal } = useGoal(goalId || null)
  const { data: savingsLogs, isLoading: isLoadingLogs } = useSavingsLogs(goalId || null)
  const updateGoal = useUpdateGoal()
  const deleteGoal = useDeleteGoal()

  const handleCompleteGoal = async () => {
    if (!goal || goal.is_completed) return
    
    const confirmComplete = confirm('이 목표를 완료로 표시하시겠습니까?')
    if (!confirmComplete) return
    
    try {
      await updateGoal.mutateAsync({
        id: goal.id,
        updates: {
          is_completed: true,
          completed_at: new Date().toISOString()
        }
      })
    } catch (error) {
      console.error('목표 완료 처리 실패:', error)
      alert('목표 완료 처리에 실패했습니다.')
    }
  }

  const handleDeleteGoal = async () => {
    if (!goal) return
    
    const confirmDelete = confirm('이 목표를 삭제하시겠습니까? 모든 저축 내역도 함께 삭제됩니다.')
    if (!confirmDelete) return
    
    try {
      await deleteGoal.mutateAsync(goal.id)
      navigate('/goals')
    } catch (error) {
      console.error('목표 삭제 실패:', error)
      alert('목표 삭제에 실패했습니다.')
    }
  }

  const handleSavingsSuccess = () => {
    setIsSavingsFormOpen(false)
  }

  if (isLoadingGoal || !goal) {
    return (
      <div className="container mx-auto p-4 flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="text-lg font-medium">목표 로딩 중...</div>
        </div>
      </div>
    )
  }

  const remainingAmount = Math.max(0, goal.target_amount - goal.currentAmount)
  const remainingDays = goal.deadline 
    ? Math.ceil((new Date(goal.deadline).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
    : null

  return (
    <div className="container mx-auto p-4 space-y-6 pb-20">
      <header className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={() => navigate('/goals')}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">{goal.name}</h1>
            <Badge variant={goal.is_completed ? "default" : "secondary"} className="mt-1">
              {goal.is_completed ? "완료됨" : "진행 중"}
            </Badge>
          </div>
        </div>
        
        <div className="flex gap-2">
          <Link to={`/goals/${goal.id}/edit`}>
            <Button variant="outline" size="sm">
              <Edit className="h-4 w-4" />
            </Button>
          </Link>
          <Button variant="outline" size="sm" onClick={handleDeleteGoal}>
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </header>

      {/* Progress Card */}
      <Card className="p-6 bg-gradient-to-r from-primary-50 to-primary-100 border-primary-200">
        <CardContent className="p-0">
          <div className="text-center mb-6">
            <div className="text-3xl font-bold text-primary-600 mb-2">
              {formatCurrency(goal.currentAmount)}
            </div>
            <div className="text-muted-foreground">
              목표 {formatCurrency(goal.target_amount)} 중 {Math.round(goal.progressPercentage)}% 달성
            </div>
          </div>
          
          <Progress value={goal.progressPercentage} className="h-4 mb-4" />
          
          <div className="grid grid-cols-2 gap-4 text-center">
            <div>
              <div className="text-sm text-muted-foreground">남은 금액</div>
              <div className="text-lg font-semibold">{formatCurrency(remainingAmount)}</div>
            </div>
            {remainingDays !== null && (
              <div>
                <div className="text-sm text-muted-foreground">남은 기간</div>
                <div className="text-lg font-semibold">
                  {remainingDays > 0 ? `${remainingDays}일` : '기한 만료'}
                </div>
              </div>
            )}
          </div>
          
          {!goal.is_completed && (
            <div className="flex gap-2 mt-6">
              <Button 
                className="flex-1"
                onClick={() => setIsSavingsFormOpen(true)}
              >
                <Plus className="h-4 w-4 mr-2" />
                저축 추가
              </Button>
              {goal.progressPercentage >= 100 && (
                <Button 
                  variant="outline"
                  onClick={handleCompleteGoal}
                  className="bg-white/50 hover:bg-white/80"
                >
                  완료 표시
                </Button>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Goal Info */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            목표 정보
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-between">
            <span className="text-muted-foreground">목표 금액</span>
            <span className="font-medium">{formatCurrency(goal.target_amount)}</span>
          </div>
          {goal.deadline && (
            <div className="flex justify-between">
              <span className="text-muted-foreground">목표 일자</span>
              <span className="font-medium">{new Date(goal.deadline).toLocaleDateString()}</span>
            </div>
          )}
          <div className="flex justify-between">
            <span className="text-muted-foreground">생성일</span>
            <span className="font-medium">{new Date(goal.created_at).toLocaleDateString()}</span>
          </div>
          {goal.is_completed && goal.completed_at && (
            <div className="flex justify-between">
              <span className="text-muted-foreground">완료일</span>
              <span className="font-medium">{new Date(goal.completed_at).toLocaleDateString()}</span>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Savings History */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            저축 내역
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoadingLogs ? (
            <div className="text-center py-4">로딩 중...</div>
          ) : !savingsLogs || savingsLogs.length === 0 ? (
            <div className="text-center py-8">
              <div className="text-muted-foreground mb-4">아직 저축 내역이 없습니다</div>
              {!goal.is_completed && (
                <Button onClick={() => setIsSavingsFormOpen(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  첫 저축 추가하기
                </Button>
              )}
            </div>
          ) : (
            <div className="space-y-3">
              {savingsLogs.map((log) => (
                <div key={log.id} className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
                  <div>
                    <div className="font-medium">{formatCurrency(log.amount)}</div>
                    <div className="text-sm text-muted-foreground">
                      {new Date(log.date).toLocaleDateString()}
                      {log.memo && ` • ${log.memo}`}
                    </div>
                  </div>
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Savings Form Modal */}
      {isSavingsFormOpen && (
        <SavingsLogForm
          goalId={goal.id}
          onClose={() => setIsSavingsFormOpen(false)}
          onSuccess={handleSavingsSuccess}
        />
      )}
    </div>
  )
}