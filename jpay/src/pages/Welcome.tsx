import React from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function Welcome() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-primary-50 to-white flex flex-col justify-center items-center p-4">
      <div className="w-full max-w-md space-y-8">
        {/* Logo & Title */}
        <div className="text-center">
          <div className="mx-auto w-16 h-16 bg-primary-500 rounded-full flex items-center justify-center mb-6">
            <span className="text-2xl">💰</span>
          </div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">
            PairPay
          </h1>
          <p className="text-slate-600">
            우리 둘만의 간편한 가계부
          </p>
        </div>

        {/* Features */}
        <Card>
          <CardHeader>
            <CardTitle className="text-center text-lg">
              이런 분들에게 완벽해요
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-start space-x-3">
              <span className="text-lg">💑</span>
              <div>
                <div className="font-medium">커플</div>
                <div className="text-sm text-slate-600">
                  데이트 비용을 투명하게 관리하고 싶은 커플
                </div>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <span className="text-lg">🏠</span>
              <div>
                <div className="font-medium">룸메이트</div>
                <div className="text-sm text-slate-600">
                  생활비와 공용품을 함께 쓰는 룸메이트
                </div>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <span className="text-lg">👫</span>
              <div>
                <div className="font-medium">친구</div>
                <div className="text-sm text-slate-600">
                  여행이나 모임 비용을 나누는 친구들
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="space-y-3">
          <Button className="w-full h-12 text-lg">
            새 페어룸 만들기
          </Button>
          <Button variant="outline" className="w-full h-12 text-lg">
            초대 코드로 참가하기
          </Button>
        </div>

        {/* Footer */}
        <div className="text-center text-sm text-slate-500">
          <p>로그인 없이 바로 시작할 수 있어요</p>
        </div>
      </div>
    </div>
  )
}