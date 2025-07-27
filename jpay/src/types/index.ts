// PairPay 기본 타입 정의

export interface User {
  id: string
  name: string
  isMe: boolean
}

// Supabase Database Types
export interface DatabasePair {
  id: string
  invite_code: string
  created_at: string
  updated_at: string
  user1_id: string
  user2_id: string | null
  pair_name: string
  currency: string
}

export interface DatabaseExpense {
  id: string
  pair_id: string
  created_at: string
  updated_at: string
  amount: number
  title: string
  description: string | null
  expense_date: string
  paid_by: string
  split_ratio: number
  category: string
  receipt_url: string | null
  memo: string | null
  is_settled: boolean
  settled_at: string | null
}

export interface DatabaseBudget {
  id: string
  pair_id: string
  created_at: string
  updated_at: string
  budget_year: number
  budget_month: number
  total_budget: number | null
  category_budgets: Record<string, number>
  alert_threshold: number
}

export interface Expense {
  id: string
  amount: number
  description: string
  category: ExpenseCategory
  payer: string // User ID
  splitType: SplitType
  splitRatio?: number // 0-1 범위, splitType이 'custom'일 때 사용
  date: string // ISO string
  memo?: string
  attachments?: string[] // 이미지 URL 배열
  createdAt: string
  updatedAt: string
}

export type ExpenseCategory = 
  | 'food'      // 외식
  | 'transport' // 교통
  | 'shopping'  // 쇼핑
  | 'utilities' // 생활용품
  | 'etc'       // 기타

export type SplitType = 
  | 'half'      // 반반
  | 'full-me'   // 내가 전액
  | 'full-partner' // 상대방 전액
  | 'custom'    // 직접 입력

export interface Budget {
  id: string
  category?: ExpenseCategory // undefined면 전체 예산
  amount: number
  period: 'monthly' | 'yearly'
  startDate: string
  endDate: string
}

export interface PairRoom {
  id: string
  code: string
  users: User[]
  expenses: Expense[]
  budgets: Budget[]
  createdAt: string
  lastActivityAt: string
}

export interface AppState {
  // 현재 페어룸
  currentRoom: PairRoom | null
  currentUser: User | null
  
  // UI 상태
  isLoading: boolean
  error: string | null
  
  // 필터 및 정렬
  selectedMonth: string // YYYY-MM 형식
  selectedCategory: ExpenseCategory | 'all'
  
  // 모달 상태
  isAddExpenseModalOpen: boolean
  isSettlementModalOpen: boolean
}

// 정산 계산 결과
export interface SettlementResult {
  fromUser: string
  toUser: string
  amount: number
}

// 통계 데이터
export interface ExpenseStats {
  totalAmount: number
  myAmount: number
  partnerAmount: number
  categoryBreakdown: Record<ExpenseCategory, number>
  monthlyTrend: Array<{
    month: string
    amount: number
  }>
}