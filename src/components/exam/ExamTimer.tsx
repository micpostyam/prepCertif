'use client'

import { useState, useEffect } from 'react'

interface ExamTimerProps {
  duration: number // en minutes
  onTimeUp: () => void
}

export function ExamTimer({ duration, onTimeUp }: ExamTimerProps) {
  const [remainingSeconds, setRemainingSeconds] = useState(duration * 60)

  useEffect(() => {
    const timer = setInterval(() => {
      setRemainingSeconds((prev) => {
        if (prev <= 1) {
          clearInterval(timer)
          onTimeUp()
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [onTimeUp])

  const minutes = Math.floor(remainingSeconds / 60)
  const seconds = remainingSeconds % 60

  const formattedTime = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`

  return (
    <div className={`text-lg font-mono font-semibold ${remainingSeconds < 300 ? 'text-red-600' : ''}`}>
      {formattedTime}
    </div>
  )
}
