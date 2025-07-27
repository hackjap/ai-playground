import { createClient } from '@supabase/supabase-js'
import type { DatabasePair, DatabaseExpense, DatabaseBudget } from '@/types'

// Supabase 환경 변수 (실제 운영 시에는 .env 파일에서 관리)
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://your-project.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'your-anon-key'

// Database 타입 정의
export interface Database {
  public: {
    Tables: {
      pairs: {
        Row: DatabasePair
        Insert: Omit<DatabasePair, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<DatabasePair, 'id' | 'created_at'>>
      }
      expenses: {
        Row: DatabaseExpense
        Insert: Omit<DatabaseExpense, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<DatabaseExpense, 'id' | 'created_at'>>
      }
      budgets: {
        Row: DatabaseBudget
        Insert: Omit<DatabaseBudget, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<DatabaseBudget, 'id' | 'created_at'>>
      }
    }
  }
}

// Supabase 클라이언트 생성
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: false, // 익명 세션이므로 세션 유지 비활성화
  },
})

// 익명 사용자 ID 관리 함수들
const ANONYMOUS_USER_KEY = 'jpay_anonymous_user_id'

export function getAnonymousUserId(): string {
  let userId = localStorage.getItem(ANONYMOUS_USER_KEY)
  
  // 기존 잘못된 형식의 ID가 있으면 제거
  if (userId && userId.length > 36) {
    localStorage.removeItem(ANONYMOUS_USER_KEY)
    userId = null
  }
  
  if (!userId) {
    // 짧은 익명 ID 생성 (36자 제한에 맞도록)
    const randomString = crypto.randomUUID().replace(/-/g, '').substring(0, 28)
    userId = 'anon_' + randomString
    localStorage.setItem(ANONYMOUS_USER_KEY, userId)
  }
  
  return userId
}

export function clearAnonymousUserId(): void {
  localStorage.removeItem(ANONYMOUS_USER_KEY)
}

// 초대 코드 생성 함수
export function generateInviteCode(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  let code = ''
  
  for (let i = 0; i < 8; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  
  return code
}

// 페어 관련 함수들
export async function createPair(pairName: string = '우리') {
  const inviteCode = generateInviteCode()
  const userId = getAnonymousUserId()
  
  const { data, error } = await supabase
    .from('pairs')
    .insert({
      invite_code: inviteCode,
      user1_id: userId,
      user2_id: null,
      pair_name: pairName,
      currency: 'KRW'
    })
    .select()
    .single()
  
  if (error) {
    throw new Error(`페어 생성 실패: ${error.message}`)
  }
  
  return data
}

export async function joinPair(inviteCode: string) {
  const userId = getAnonymousUserId()
  
  // 먼저 초대 코드로 페어 찾기
  const { data: pair, error: findError } = await supabase
    .from('pairs')
    .select('*')
    .eq('invite_code', inviteCode.toUpperCase())
    .single()
  
  if (findError || !pair) {
    throw new Error('유효하지 않은 초대 코드입니다')
  }
  
  // 이미 두 명이 모두 있는 경우
  if (pair.user2_id) {
    throw new Error('이미 두 명이 모두 참여한 페어입니다')
  }
  
  // 같은 사용자인 경우
  if (pair.user1_id === userId) {
    throw new Error('자신이 만든 페어에는 참여할 수 없습니다')
  }
  
  // user2_id 업데이트
  const { data, error } = await supabase
    .from('pairs')
    .update({ user2_id: userId })
    .eq('id', pair.id)
    .select()
    .single()
  
  if (error) {
    throw new Error(`페어 참여 실패: ${error.message}`)
  }
  
  return data
}

export async function getPairByInviteCode(inviteCode: string) {
  const { data, error } = await supabase
    .from('pairs')
    .select('*')
    .eq('invite_code', inviteCode.toUpperCase())
    .single()
  
  if (error) {
    throw new Error(`페어 조회 실패: ${error.message}`)
  }
  
  return data
}

// 지출 관련 함수들
export async function getExpenses(pairId: string) {
  const { data, error } = await supabase
    .from('expenses')
    .select('*')
    .eq('pair_id', pairId)
    .order('expense_date', { ascending: false })
  
  if (error) {
    throw new Error(`지출 조회 실패: ${error.message}`)
  }
  
  return data
}

export async function addExpense(expense: Database['public']['Tables']['expenses']['Insert']) {
  const { data, error } = await supabase
    .from('expenses')
    .insert(expense)
    .select()
    .single()
  
  if (error) {
    throw new Error(`지출 추가 실패: ${error.message}`)
  }
  
  return data
}

export async function updateExpense(id: string, updates: Database['public']['Tables']['expenses']['Update']) {
  const { data, error } = await supabase
    .from('expenses')
    .update(updates)
    .eq('id', id)
    .select()
    .single()
  
  if (error) {
    throw new Error(`지출 수정 실패: ${error.message}`)
  }
  
  return data
}

export async function deleteExpense(id: string) {
  const { error } = await supabase
    .from('expenses')
    .delete()
    .eq('id', id)
  
  if (error) {
    throw new Error(`지출 삭제 실패: ${error.message}`)
  }
}

// 예산 관련 함수들
export async function getBudget(pairId: string, year: number, month: number) {
  const { data, error } = await supabase
    .from('budgets')
    .select('*')
    .eq('pair_id', pairId)
    .eq('budget_year', year)
    .eq('budget_month', month)
    .single()
  
  if (error && error.code !== 'PGRST116') { // PGRST116: no rows found
    throw new Error(`예산 조회 실패: ${error.message}`)
  }
  
  return data
}

export async function setBudget(budget: Database['public']['Tables']['budgets']['Insert']) {
  const { data, error } = await supabase
    .from('budgets')
    .upsert(budget)
    .select()
    .single()
  
  if (error) {
    throw new Error(`예산 설정 실패: ${error.message}`)
  }
  
  return data
}

// 정산 관련 함수들
export async function settleExpenses(pairId: string, expenseIds: string[]) {
  const { data, error } = await supabase
    .from('expenses')
    .update({ 
      is_settled: true, 
      settled_at: new Date().toISOString() 
    })
    .eq('pair_id', pairId)
    .in('id', expenseIds)
    .select()
  
  if (error) {
    throw new Error(`정산 처리 실패: ${error.message}`)
  }
  
  return data
}