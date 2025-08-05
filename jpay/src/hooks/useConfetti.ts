import { useCallback } from 'react'
import confetti from 'canvas-confetti'

export const useConfetti = () => {
  const triggerConfetti = useCallback(() => {
    const count = 200
    const defaults = {
      origin: { y: 0.7 }
    }

    function fire(particleRatio: number, opts: confetti.Options) {
      confetti({
        ...defaults,
        ...opts,
        particleCount: Math.floor(count * particleRatio)
      })
    }

    fire(0.25, {
      spread: 26,
      startVelocity: 55,
    })

    fire(0.2, {
      spread: 60,
    })

    fire(0.35, {
      spread: 100,
      decay: 0.91,
      scalar: 0.8
    })

    fire(0.1, {
      spread: 120,
      startVelocity: 25,
      decay: 0.92,
      scalar: 1.2
    })

    fire(0.1, {
      spread: 120,
      startVelocity: 45,
    })
  }, [])

  const triggerHeartConfetti = useCallback(() => {
    const heart = confetti.shapeFromText({ text: '💰', scalar: 2 })
    
    confetti({
      shapes: [heart],
      particleCount: 50,
      spread: 100,
      startVelocity: 30,
      origin: { y: 0.6 },
      colors: ['#10b981', '#059669', '#047857']
    })
  }, [])

  const triggerGoalAchievementCelebration = useCallback(() => {
    // 첫 번째 폭죽
    triggerConfetti()
    
    // 0.5초 후 하트 이모지 폭죽
    setTimeout(() => {
      triggerHeartConfetti()
    }, 500)
    
    // 1초 후 추가 폭죽
    setTimeout(() => {
      triggerConfetti()
    }, 1000)
  }, [triggerConfetti, triggerHeartConfetti])

  return {
    triggerConfetti,
    triggerHeartConfetti,
    triggerGoalAchievementCelebration
  }
}