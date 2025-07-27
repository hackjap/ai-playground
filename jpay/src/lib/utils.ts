import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// 금액 포맷팅 유틸리티
export function formatCurrency(amount: number): string {
  return `₩${amount.toLocaleString('ko-KR')}`
}

// 날짜 포맷팅 유틸리티
export function formatDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date
  return d.toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).replace(/\./g, '.').replace(/\. /g, '.')
}

// 퍼센트 계산 유틸리티
export function calculatePercentage(used: number, total: number): number {
  if (total === 0) return 0
  return Math.round((used / total) * 100)
}