import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'
import type { AppState, PairRoom, User, Expense, Budget, ExpenseCategory } from '@/types'

interface AppActions {
  // Room 관련
  setCurrentRoom: (room: PairRoom | null) => void
  setCurrentUser: (user: User | null) => void
  
  // Expense 관련
  addExpense: (expense: Expense) => void
  updateExpense: (id: string, expense: Partial<Expense>) => void
  deleteExpense: (id: string) => void
  
  // Budget 관련
  addBudget: (budget: Budget) => void
  updateBudget: (id: string, budget: Partial<Budget>) => void
  deleteBudget: (id: string) => void
  
  // UI 상태
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  setSelectedMonth: (month: string) => void
  setSelectedCategory: (category: ExpenseCategory | 'all') => void
  
  // 모달 상태
  setAddExpenseModalOpen: (open: boolean) => void
  setSettlementModalOpen: (open: boolean) => void
  
  // 유틸리티
  clearRoom: () => void
  reset: () => void
}

type AppStore = AppState & AppActions

const initialState: AppState = {
  currentRoom: null,
  currentUser: null,
  isLoading: false,
  error: null,
  selectedMonth: new Date().toISOString().slice(0, 7), // 현재 월
  selectedCategory: 'all',
  isAddExpenseModalOpen: false,
  isSettlementModalOpen: false,
}

export const useAppStore = create<AppStore>()(
  devtools(
    persist(
      (set) => ({
        ...initialState,
        
        // Room 관련
        setCurrentRoom: (room) => set({ currentRoom: room }),
        setCurrentUser: (user) => set({ currentUser: user }),
        
        // Expense 관련
        addExpense: (expense) => set((state) => {
          if (!state.currentRoom) return state
          return {
            currentRoom: {
              ...state.currentRoom,
              expenses: [...state.currentRoom.expenses, expense],
              lastActivityAt: new Date().toISOString(),
            }
          }
        }),
        
        updateExpense: (id, updatedExpense) => set((state) => {
          if (!state.currentRoom) return state
          return {
            currentRoom: {
              ...state.currentRoom,
              expenses: state.currentRoom.expenses.map(expense => 
                expense.id === id 
                  ? { ...expense, ...updatedExpense, updatedAt: new Date().toISOString() }
                  : expense
              ),
              lastActivityAt: new Date().toISOString(),
            }
          }
        }),
        
        deleteExpense: (id) => set((state) => {
          if (!state.currentRoom) return state
          return {
            currentRoom: {
              ...state.currentRoom,
              expenses: state.currentRoom.expenses.filter(expense => expense.id !== id),
              lastActivityAt: new Date().toISOString(),
            }
          }
        }),
        
        // Budget 관련
        addBudget: (budget) => set((state) => {
          if (!state.currentRoom) return state
          return {
            currentRoom: {
              ...state.currentRoom,
              budgets: [...state.currentRoom.budgets, budget],
              lastActivityAt: new Date().toISOString(),
            }
          }
        }),
        
        updateBudget: (id, updatedBudget) => set((state) => {
          if (!state.currentRoom) return state
          return {
            currentRoom: {
              ...state.currentRoom,
              budgets: state.currentRoom.budgets.map(budget => 
                budget.id === id ? { ...budget, ...updatedBudget } : budget
              ),
              lastActivityAt: new Date().toISOString(),
            }
          }
        }),
        
        deleteBudget: (id) => set((state) => {
          if (!state.currentRoom) return state
          return {
            currentRoom: {
              ...state.currentRoom,
              budgets: state.currentRoom.budgets.filter(budget => budget.id !== id),
              lastActivityAt: new Date().toISOString(),
            }
          }
        }),
        
        // UI 상태
        setLoading: (loading) => set({ isLoading: loading }),
        setError: (error) => set({ error }),
        setSelectedMonth: (month) => set({ selectedMonth: month }),
        setSelectedCategory: (category) => set({ selectedCategory: category }),
        
        // 모달 상태
        setAddExpenseModalOpen: (open) => set({ isAddExpenseModalOpen: open }),
        setSettlementModalOpen: (open) => set({ isSettlementModalOpen: open }),
        
        // 유틸리티
        clearRoom: () => set({ 
          currentRoom: null, 
          currentUser: null,
          selectedMonth: new Date().toISOString().slice(0, 7),
          selectedCategory: 'all',
        }),
        
        reset: () => set(initialState),
      }),
      {
        name: 'pairpay-storage',
        partialize: (state) => ({
          currentRoom: state.currentRoom,
          currentUser: state.currentUser,
          selectedMonth: state.selectedMonth,
          selectedCategory: state.selectedCategory,
        }),
      }
    ),
    {
      name: 'pairpay-store',
    }
  )
)