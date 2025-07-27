import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Layout from '@/components/layout/Layout'
import Welcome from '@/pages/Welcome'
import Dashboard from '@/pages/Dashboard'

function App() {
  return (
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
  )
}

export default App