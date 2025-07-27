import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useEffect } from 'react'
import { getBudget, supabase } from '@/lib/supabase'
import type { DatabaseBudget } from '@/types'

/**
 * 예산 데이터를 가져오고 실시간 업데이트를 구독하는 훅
 */
export function useBudget(pairId: string | null, year?: number, month?: number) {
  const queryClient = useQueryClient()
  
  // 기본값: 현재 연도/월
  const currentDate = new Date()
  const targetYear = year || currentDate.getFullYear()
  const targetMonth = month || (currentDate.getMonth() + 1)

  const query = useQuery({
    queryKey: ['budget', pairId, targetYear, targetMonth],
    queryFn: () => {
      if (!pairId) return null
      return getBudget(pairId, targetYear, targetMonth)
    },
    enabled: !!pairId,
    staleTime: 1000 * 60, // 1분 후 stale
    retry: false, // 예산이 없을 수 있으므로 재시도 하지 않음
  })

  // Supabase Realtime 구독 설정
  useEffect(() => {
    if (!pairId) return

    const channel = supabase
      .channel(`budgets_${pairId}`)
      .on(
        'postgres_changes',
        {
          event: '*', // INSERT, UPDATE, DELETE 모든 이벤트
          schema: 'public',
          table: 'budgets',
          filter: `pair_id=eq.${pairId}`,
        },
        (payload) => {
          console.log('Budget change detected:', payload)
          
          // 예산 데이터 즉시 업데이트
          queryClient.invalidateQueries({
            queryKey: ['budget', pairId]
          })
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [pairId, queryClient])

  return {
    data: query.data,
    isLoading: query.isLoading,
    error: query.error,
    refetch: query.refetch,
  }
}

/**
 * 예산 데이터 캐시를 수동으로 무효화하는 훅
 */
export function useInvalidateBudget() {
  const queryClient = useQueryClient()
  
  return (pairId: string) => {
    queryClient.invalidateQueries({
      queryKey: ['budget', pairId]
    })
  }
}

/**
 * 현재 월 예산 상태를 분석하는 유틸 훅
 */
export function useBudgetAnalysis(
  budget: DatabaseBudget | null | undefined, 
  totalExpenses: number
) {
  if (!budget || !budget.total_budget) {
    return {
      hasBudget: false,
      spentAmount: totalExpenses,
      budgetAmount: 0,
      remainingAmount: 0,
      spentPercentage: 0,
      isOverBudget: false,
      isNearAlert: false,
      alertThreshold: 80,
    }
  }

  const budgetAmount = budget.total_budget
  const spentAmount = totalExpenses
  const remainingAmount = Math.max(0, budgetAmount - spentAmount)
  const spentPercentage = budgetAmount > 0 ? (spentAmount / budgetAmount) * 100 : 0
  const alertThreshold = budget.alert_threshold || 80
  const isOverBudget = spentPercentage >= 100
  const isNearAlert = spentPercentage >= alertThreshold

  return {
    hasBudget: true,
    spentAmount,
    budgetAmount,
    remainingAmount,
    spentPercentage,
    isOverBudget,
    isNearAlert,
    alertThreshold,
  }
}