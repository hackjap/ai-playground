import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

interface PWAInstallPromptProps {
  onInstall?: () => void
  onDismiss?: () => void
}

export default function PWAInstallPrompt({ onInstall, onDismiss }: PWAInstallPromptProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [isInstalling, setIsInstalling] = useState(false)

  useEffect(() => {
    // PWA 설치 가능 상태 확인
    const checkInstallable = () => {
      const isInstalled = (window as any).isPWAInstalled?.()
      const canInstall = !isInstalled && 'installPWA' in window
      setIsVisible(canInstall)
    }

    // 설치 가능 이벤트 리스너
    const handleInstallable = () => {
      setTimeout(checkInstallable, 1000) // 1초 후 체크
    }

    window.addEventListener('pwa-installable', handleInstallable)
    checkInstallable()

    return () => {
      window.removeEventListener('pwa-installable', handleInstallable)
    }
  }, [])

  const handleInstall = async () => {
    setIsInstalling(true)
    
    try {
      const installed = await (window as any).installPWA?.()
      if (installed) {
        setIsVisible(false)
        onInstall?.()
      }
    } catch (error) {
      console.error('PWA 설치 실패:', error)
    } finally {
      setIsInstalling(false)
    }
  }

  const handleDismiss = () => {
    setIsVisible(false)
    onDismiss?.()
    // 7일 후 다시 표시하도록 설정
    localStorage.setItem('pwa-install-dismissed', Date.now().toString())
  }

  // 7일 이내에 dismiss했으면 표시하지 않음
  useEffect(() => {
    const dismissedTime = localStorage.getItem('pwa-install-dismissed')
    if (dismissedTime) {
      const daysSinceDismissed = (Date.now() - parseInt(dismissedTime)) / (1000 * 60 * 60 * 24)
      if (daysSinceDismissed < 7) {
        setIsVisible(false)
      }
    }
  }, [])

  if (!isVisible) {
    return null
  }

  return (
    <Card className="fixed bottom-20 left-4 right-4 z-50 shadow-lg border-primary">
      <CardContent className="p-4">
        <div className="flex items-center gap-3">
          <div className="flex-shrink-0 text-2xl">📱</div>
          <div className="flex-1 min-w-0">
            <div className="font-medium text-sm">앱으로 설치하기</div>
            <div className="text-xs text-muted-foreground">
              홈 화면에 추가해서 더 빠르게 사용하세요
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleDismiss}
              className="text-xs px-2"
            >
              나중에
            </Button>
            <Button
              size="sm"
              onClick={handleInstall}
              disabled={isInstalling}
              className="text-xs px-3"
            >
              {isInstalling ? '설치 중...' : '설치'}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}