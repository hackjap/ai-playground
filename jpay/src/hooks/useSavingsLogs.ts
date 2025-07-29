import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getSavingsLogs, createSavingsLog, updateSavingsLog, deleteSavingsLog } from '@/lib/supabase'

export function useSavingsLogs(goalId: string | null) {
  return useQuery({
    queryKey: ['savingsLogs', goalId],
    queryFn: () => goalId ? getSavingsLogs(goalId) : Promise.resolve([]),
    enabled: !!goalId,
  })
}

export function useCreateSavingsLog() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: createSavingsLog,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['savingsLogs', data.goal_id] })
      queryClient.invalidateQueries({ queryKey: ['goal', data.goal_id] })
    },
  })
}

export function useUpdateSavingsLog() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Parameters<typeof updateSavingsLog>[1] }) =>
      updateSavingsLog(id, updates),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['savingsLogs', data.goal_id] })
      queryClient.invalidateQueries({ queryKey: ['goal', data.goal_id] })
    },
  })
}

export function useDeleteSavingsLog() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: deleteSavingsLog,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['savingsLogs'] })
      queryClient.invalidateQueries({ queryKey: ['goal'] })
    },
  })
}