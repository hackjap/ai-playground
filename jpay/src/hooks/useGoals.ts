import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getGoals, createGoal, updateGoal, deleteGoal, getTotalSavingsForGoal } from '@/lib/supabase'

export function useGoals(pairId: string | null) {
  return useQuery({
    queryKey: ['goals', pairId],
    queryFn: () => pairId ? getGoals(pairId) : Promise.resolve([]),
    enabled: !!pairId,
  })
}

export function useGoal(goalId: string | null) {
  return useQuery({
    queryKey: ['goal', goalId],
    queryFn: async () => {
      if (!goalId) return null
      
      const goals = await getGoals('')
      const goal = goals.find(g => g.id === goalId)
      
      if (!goal) throw new Error('목표를 찾을 수 없습니다')
      
      const totalSavings = await getTotalSavingsForGoal(goalId)
      
      return {
        ...goal,
        currentAmount: totalSavings,
        progressPercentage: Math.min((totalSavings / goal.target_amount) * 100, 100)
      }
    },
    enabled: !!goalId,
  })
}

export function useCreateGoal() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: createGoal,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['goals', data.pair_id] })
    },
  })
}

export function useUpdateGoal() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Parameters<typeof updateGoal>[1] }) =>
      updateGoal(id, updates),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['goals', data.pair_id] })
      queryClient.invalidateQueries({ queryKey: ['goal', data.id] })
    },
  })
}

export function useDeleteGoal() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: deleteGoal,
    onSuccess: (_, goalId) => {
      queryClient.removeQueries({ queryKey: ['goal', goalId] })
      queryClient.invalidateQueries({ queryKey: ['goals'] })
    },
  })
}

export function useInvalidateGoals() {
  const queryClient = useQueryClient()
  
  return (pairId: string) => {
    queryClient.invalidateQueries({ queryKey: ['goals', pairId] })
  }
}