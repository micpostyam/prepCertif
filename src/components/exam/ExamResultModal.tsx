'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'

interface ExamResultModalProps {
  examId: string
  onClose: () => void
}

export function ExamResultModal({ examId, onClose }: ExamResultModalProps) {
  const [exam, setExam] = useState<any>(null)
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    fetch(`/api/exams/${examId}/details`)
      .then(res => res.json())
      .then(data => setExam(data))
  }, [examId])

  if (!exam) return <div>Chargement...</div>

  const currentQuestion = exam.examQuestions[currentIndex]

  return (
    <div className="fixed inset-0 bg-white z-50 p-6 overflow-y-auto">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-xl font-semibold">
            Résultats - Question {currentIndex + 1} / {exam.examQuestions.length}
          </h2>
          <div className="text-lg">
            Score final: {exam.score.toFixed(1)}%
          </div>
        </div>

        {currentQuestion && (
          <div className="space-y-6">
            <div className="p-4 rounded-lg bg-gray-50">
              <div dangerouslySetInnerHTML={{ __html: currentQuestion.question.text }} />
            </div>

            <div className="space-y-3">
              {currentQuestion.question.options.map((option: any) => {
                const isSelected = currentQuestion.answers.includes(option.id)
                const isCorrect = option.isCorrect

                let bgColor = 'bg-white'
                if (isSelected && isCorrect) bgColor = 'bg-green-50'
                else if (isSelected && !isCorrect) bgColor = 'bg-red-50'
                else if (!isSelected && isCorrect) bgColor = 'bg-green-50 opacity-50'

                return (
                  <div
                    key={option.id}
                    className={`p-4 border rounded-lg ${bgColor}`}
                  >
                    <div className="flex items-center gap-3">
                      {isSelected && isCorrect && <span className="text-green-500">✓</span>}
                      {isSelected && !isCorrect && <span className="text-red-500">✗</span>}
                      {!isSelected && isCorrect && <span className="text-green-500 opacity-50">✓</span>}
                      {option.text}
                    </div>
                    {(isSelected || option.isCorrect) && option.details && (
                      <div className="mt-2 text-sm text-gray-600">
                        {option.details}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>

            <div className="flex justify-between pt-4">
              <Button
                onClick={() => setCurrentIndex(i => i - 1)}
                disabled={currentIndex === 0}
              >
                Précédent
              </Button>
              {currentIndex === exam.examQuestions.length - 1 ? (
                <Button onClick={onClose}>
                  Fermer
                </Button>
              ) : (
                <Button
                  onClick={() => setCurrentIndex(i => i + 1)}
                >
                  Suivant
                </Button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
