'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'

interface ExamResultModalProps {
  examId: string
  onClose: () => void
}

function PaginationNumbers({ current, total, onChange }: { 
  current: number; 
  total: number; 
  onChange: (page: number) => void 
}) {
  const renderPageNumbers = () => {
    const pages = []
    
    // Toujours afficher la première page
    pages.push(
      <button
        key={0}
        onClick={() => onChange(0)}
        className={`w-8 h-8 rounded-lg ${
          current === 0 ? 'bg-blue-500 text-white' : 'bg-gray-200 hover:bg-gray-300'
        }`}
      >
        1
      </button>
    )

    let start = Math.max(1, current - 1)
    let end = Math.min(total - 2, current + 1)

    // Ajouter ellipsis après la première page si nécessaire
    if (start > 1) {
      pages.push(<span key="start-ellipsis">...</span>)
    }

    // Ajouter les pages autour de la page courante
    for (let i = start; i <= end; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => onChange(i)}
          className={`w-8 h-8 rounded-lg ${
            current === i ? 'bg-blue-500 text-white' : 'bg-gray-200 hover:bg-gray-300'
          }`}
        >
          {i + 1}
        </button>
      )
    }

    // Ajouter ellipsis avant la dernière page si nécessaire
    if (end < total - 2) {
      pages.push(<span key="end-ellipsis">...</span>)
    }

    // Toujours afficher la dernière page
    if (total > 1) {
      pages.push(
        <button
          key={total - 1}
          onClick={() => onChange(total - 1)}
          className={`w-8 h-8 rounded-lg ${
            current === total - 1 ? 'bg-blue-500 text-white' : 'bg-gray-200 hover:bg-gray-300'
          }`}
        >
          {total}
        </button>
      )
    }

    return pages
  }

  return (
    <div className="flex items-center gap-2">
      {renderPageNumbers()}
    </div>
  )
}

export function ExamResultModal({ examId, onClose }: ExamResultModalProps) {
  const [examDetails, setExamDetails] = useState<any>(null)
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)

  useEffect(() => {
    fetch(`/api/exams/${examId}/details`)
      .then(res => res.json())
      .then(data => setExamDetails(data))
  }, [examId])

  if (!examDetails) return null

  const currentQuestion = examDetails.examQuestions[currentQuestionIndex]
  const totalQuestions = examDetails.examQuestions.length

  return (
    <div className="fixed inset-0 bg-white z-50 p-6 overflow-y-auto">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-xl font-semibold">
              Résultats détaillés
            </h2>
            <p className="text-sm text-gray-600">
              Question {currentQuestionIndex + 1} sur {totalQuestions}
            </p>
          </div>
          <div className="space-x-4">
            <Button 
              variant="outline"
              onClick={onClose}
            >
              Fermer
            </Button>
          </div>
        </div>

        <div className="space-y-8">
          <div key={currentQuestion.id} className="border p-4 rounded-lg">
            <div dangerouslySetInnerHTML={{ __html: currentQuestion.question.text }} />
            
            <div className="mt-4 space-y-2">
              {currentQuestion.question.options.map((option: any) => (
                <div
                  key={option.id}
                  className={`p-3 rounded-lg ${
                    option.id === currentQuestion.answer
                      ? currentQuestion.isCorrect
                        ? 'bg-green-100'
                        : 'bg-red-100'
                      : option.isCorrect
                      ? 'bg-green-50'
                      : ''
                  }`}
                >
                  <div>{option.text}</div>
                  {option.isCorrect && option.details && (
                    <div className="text-sm text-gray-600 mt-2">
                      {option.details}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-between pt-4">
            <Button
              onClick={() => setCurrentQuestionIndex(i => i - 1)}
              disabled={currentQuestionIndex === 0}
            >
              Question précédente
            </Button>
            
            <PaginationNumbers
              current={currentQuestionIndex}
              total={totalQuestions}
              onChange={setCurrentQuestionIndex}
            />
            
            <Button
              onClick={() => setCurrentQuestionIndex(i => i + 1)}
              disabled={currentQuestionIndex === totalQuestions - 1}
            >
              Question suivante
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
