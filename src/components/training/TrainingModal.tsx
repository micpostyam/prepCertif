/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Certification } from '@/types/certification'

interface TrainingModalProps {
  certification: Certification
  onClose: () => void
}

export function TrainingModal({ certification, onClose }: TrainingModalProps) {
  const [questions, setQuestions] = useState<any[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [selectedAnswers, setSelectedAnswers] = useState<string[]>([])
  const [showAnswer, setShowAnswer] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const questionsPerPage = 10

  useEffect(() => {
    fetch(`/api/certifications/${certification.id}/questions`)
      .then(res => res.json())
      .then(setQuestions)
  }, [certification.id])

  const handleAnswer = (optionId: string) => {
    const correctOptionsCount = questions[currentIndex].options.filter(
      (opt: any) => opt.isCorrect
    ).length

    if (correctOptionsCount > 1) {
      setSelectedAnswers(prev => 
        prev.includes(optionId) 
          ? prev.filter(id => id !== optionId)
          : [...prev, optionId]
      )
    } else {
      setSelectedAnswers([optionId])
    }
  }

  const currentQuestion = questions[currentIndex]

  if (!currentQuestion) return null

  const isCorrectAnswer = (optionId: string) => {
    if (!showAnswer) return false
    return currentQuestion.options.find((opt: any) => opt.id === optionId)?.isCorrect
  }

  return (
    <div className="fixed inset-0 bg-white z-50 flex flex-col">
      <div className="max-w-4xl w-full mx-auto p-6 flex flex-col h-full">
        <div className="flex justify-between items-center mb-8">
          <div className="flex gap-4 items-center">
            <h2 className="text-xl font-semibold">
              Question {currentIndex + 1} / {questions.length}
            </h2>
            <div className="flex gap-2 overflow-x-auto">
              {Array.from({ length: Math.min(questionsPerPage, questions.length - (currentPage - 1) * questionsPerPage) }, (_, idx) => {
                const questionNumber = (currentPage - 1) * questionsPerPage + idx;
                return (
                  <Button
                    key={questionNumber}
                    variant={questionNumber === currentIndex ? "default" : "outline"}
                    size="sm"
                    onClick={() => {
                      setCurrentIndex(questionNumber)
                      setShowAnswer(false)
                      setSelectedAnswers([])
                    }}
                  >
                    {questionNumber + 1}
                  </Button>
                );
              })}
              {questions.length > questionsPerPage && (
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                  >
                    ←
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(p => p + 1)}
                    disabled={currentPage * questionsPerPage >= questions.length}
                  >
                    →
                  </Button>
                </div>
              )}
            </div>
          </div>
          <Button variant="ghost" onClick={onClose}>
            Fermer
          </Button>
        </div>

        <div className="flex flex-col flex-grow overflow-hidden">
          <div className="overflow-y-auto flex-grow">
            <div className="space-y-6">
              <div>
                <div dangerouslySetInnerHTML={{ __html: currentQuestion.text }} />
                <div className="text-sm text-gray-500 mt-2">
                  {currentQuestion.options.filter((opt: any) => opt.isCorrect).length > 1
                    ? "Sélectionnez toutes les réponses correctes"
                    : "Sélectionnez une seule réponse"}
                </div>
              </div>
              
              <div className="space-y-3">
                {currentQuestion.options.map((option: any) => (
                  <button
                    key={option.id}
                    onClick={() => {
                      if (!showAnswer) {
                        handleAnswer(option.id);
                      }
                    }}
                    className={`w-full p-4 text-left border rounded-lg ${
                      selectedAnswers.includes(option.id)
                        ? 'border-blue-500 bg-blue-50'
                        : showAnswer && isCorrectAnswer(option.id)
                        ? 'border-green-500 bg-green-50'
                        : 'hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <div>{option.text}</div>
                      {showAnswer && isCorrectAnswer(option.id) && (
                        <div className="text-green-600">✓ Correcte</div>
                      )}
                    </div>
                  </button>
                ))}
              </div>

              {showAnswer && (
                <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                  <h3 className="font-semibold mb-2">Explication :</h3>
                  {currentQuestion.options
                    .filter((opt: any) => opt.isCorrect && opt.details)
                    .map((opt: any) => (
                      <div key={opt.id} className="mb-2">
                        <p className="font-medium">{opt.text}</p>
                        <p className="text-gray-600">{opt.details}</p>
                      </div>
                    ))}
                </div>
              )}
            </div>
          </div>

          <div className="flex justify-between pt-4 mt-4">
            <Button
              onClick={() => setCurrentIndex(i => i - 1)}
              disabled={currentIndex === 0}
            >
              Précédent
            </Button>
            <Button
              onClick={() => {
                if (showAnswer) {
                  setShowAnswer(false)
                  setSelectedAnswers([])
                  if (currentIndex < questions.length - 1) {
                    setCurrentIndex(i => i + 1)
                  }
                } else {
                  setShowAnswer(true)
                }
              }}
            >
              {showAnswer ? 'Question suivante' : 'Voir la réponse'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
