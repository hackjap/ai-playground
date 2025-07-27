import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { formatCurrency } from '@/lib/utils'

interface SettlementModalProps {
  balance: number // 현재 주고받을 금액
  currentUserId: string
  onConfirm: () => Promise<void>
  onClose: () => void
}

export default function SettlementModal({
  balance,
  currentUserId,
  onConfirm,
  onClose
}: SettlementModalProps) {
  const [isLoading, setIsLoading] = useState(false)
  
  const isOwed = balance >= 0 // 내가 받을 돈이 있는지
  const absoluteBalance = Math.abs(balance)

  const handleConfirm = async () => {
    setIsLoading(true)
    
    try {
      await onConfirm()
    } catch (error) {
      console.error('정산 처리 실패:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center">정산하기</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* 현재 잔액 표시 */}
          <div className="text-center space-y-2">
            <div className="text-sm text-muted-foreground">현재 상황</div>
            <div className="p-4 bg-gray-50 rounded-lg">
              {absoluteBalance === 0 ? (
                <div className="text-lg font-medium text-green-600">
                  🎉 정산할 금액이 없습니다
                </div>
              ) : (
                <>
                  <div className="text-sm text-muted-foreground">
                    {isOwed ? '상대방이 나에게' : '내가 상대방에게'}
                  </div>
                  <div className="text-2xl font-bold text-primary">
                    {formatCurrency(absoluteBalance)}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {isOwed ? '받을 금액' : '줄 금액'}
                  </div>
                </>
              )}
            </div>
          </div>

          {/* 정산 설명 */}
          <div className="space-y-3">
            <div className="text-sm font-medium">정산 후 변경사항:</div>
            <ul className="text-sm text-muted-foreground space-y-1 pl-4">
              <li>• 현재 지출 내역이 '정산 완료'로 표시됩니다</li>
              <li>• 주고받을 금액이 0원으로 리셋됩니다</li>
              <li>• 새로운 지출부터 다시 계산됩니다</li>
            </ul>
          </div>

          {/* 액션 버튼 */}
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={onClose}
              disabled={isLoading}
              className="flex-1"
            >
              취소
            </Button>
            <Button
              onClick={handleConfirm}
              disabled={isLoading}
              className="flex-1"
            >
              {isLoading ? '처리중...' : '정산하기'}
            </Button>
          </div>

          {/* 안내 메시지 */}
          {absoluteBalance > 0 && (
            <div className="text-xs text-muted-foreground text-center p-3 bg-blue-50 rounded-lg">
              💡 실제 송금은 별도로 진행해주세요. 이 기능은 기록용입니다.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}