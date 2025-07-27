import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import Layout from '@/components/layout/Layout'
import Welcome from '@/pages/Welcome'
import Dashboard from '@/pages/Dashboard'

// React Query 클라이언트 설정
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000, // 1초
      gcTime: 5 * 60 * 1000, // 5분 (구 cacheTime)
      retry: 1,
    },
  },
})

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Welcome />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="budget" element={<div className="p-4 text-center">예산 관리 페이지 (준비중)</div>} />
            <Route path="expenses" element={<div className="p-4 text-center">지출 내역 페이지 (준비중)</div>} />
            <Route path="settings" element={<div className="p-4 text-center">설정 페이지 (준비중)</div>} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  )
}

export default App