import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useEffect } from 'react'
import { getExpenses, supabase } from '@/lib/supabase'

/**
 * 지출 데이터를 가져오고 실시간 업데이트를 구독하는 훅
 */
export function useExpenses(pairId: string | null) {
  const queryClient = useQueryClient()
  
  const query = useQuery({
    queryKey: ['expenses', pairId],
    queryFn: () => {
      if (!pairId) return []
      return getExpenses(pairId)
    },
    enabled: !!pairId,
    staleTime: 1000, // 1초 후 stale로 간주
    refetchInterval: 2000, // 2초마다 자동 리페치
  })

  // Supabase Realtime 구독 설정
  useEffect(() => {
    if (!pairId) return

    const channel = supabase
      .channel(`expenses_${pairId}`)
      .on(
        'postgres_changes',
        {
          event: '*', // INSERT, UPDATE, DELETE 모든 이벤트
          schema: 'public',
          table: 'expenses',
          filter: `pair_id=eq.${pairId}`,
        },
        (payload) => {
          console.log('Expense change detected:', payload)
          
          // 데이터 즉시 업데이트
          queryClient.invalidateQueries({
            queryKey: ['expenses', pairId]
          })
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [pairId, queryClient])

  return {
    data: query.data || [],
    isLoading: query.isLoading,
    error: query.error,
    refetch: query.refetch,
  }
}

/**
 * 지출 데이터 캐시를 수동으로 무효화하는 훅
 */
export function useInvalidateExpenses() {
  const queryClient = useQueryClient()
  
  return (pairId: string) => {
    queryClient.invalidateQueries({
      queryKey: ['expenses', pairId]
    })
  }
}