import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import { useGoals } from '@/hooks/useGoals'
import GoalForm from '@/components/forms/GoalForm'

export default function GoalEdit() {
  const { id: goalId } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [pairId, setPairId] = useState<string | null>(null)
  
  const { data: goals, isLoading } = useGoals(pairId)
  const currentGoal = goals?.find(g => g.id === goalId)

  useEffect(() => {
    const savedPairId = localStorage.getItem('jpay_current_pair_id')
    if (savedPairId) {
      setPairId(savedPairId)
    } else {
      navigate('/goals')
    }
  }, [navigate])

  if (isLoading || !pairId || !currentGoal) {
    return (
      <div className="container mx-auto p-4 flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="text-lg font-medium">목표 로딩 중...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-4">
      <header className="flex items-center gap-4 mb-6">
        <Button variant="ghost" size="sm" onClick={() => navigate(`/goals/${goalId}`)}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-2xl font-bold text-slate-900">목표 수정</h1>
      </header>

      <GoalForm
        pairId={pairId}
        existingGoal={currentGoal}
        onClose={() => navigate(`/goals/${goalId}`)}
        onSuccess={() => navigate(`/goals/${goalId}`)}
      />
    </div>
  )
}