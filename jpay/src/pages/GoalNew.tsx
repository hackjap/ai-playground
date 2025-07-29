import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import GoalForm from '@/components/forms/GoalForm'

export default function GoalNew() {
  const navigate = useNavigate()
  const [pairId, setPairId] = useState<string | null>(null)

  useEffect(() => {
    const savedPairId = localStorage.getItem('jpay_current_pair_id')
    if (savedPairId) {
      setPairId(savedPairId)
    } else {
      navigate('/goals')
    }
  }, [navigate])

  if (!pairId) {
    return (
      <div className="container mx-auto p-4 flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="text-lg font-medium">로딩 중...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-4">
      <header className="flex items-center gap-4 mb-6">
        <Button variant="ghost" size="sm" onClick={() => navigate('/goals')}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-2xl font-bold text-slate-900">새 목표 만들기</h1>
      </header>

      <GoalForm
        pairId={pairId}
        onClose={() => navigate('/goals')}
        onSuccess={() => navigate('/goals')}
      />
    </div>
  )
}