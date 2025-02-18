/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Certification } from '@/types/certification'
import { ExamTimer } from './ExamTimer'


interface ExamModalProps {
  certification: Certification
  onClose: () => void
}

export function ExamModal({ certification }: ExamModalProps) {
  const router = useRouter()
  const [questions, setQuestions] = useState<any[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [answers, setAnswers] = useState<Record<string, string[]>>({})
  const [examId, setExamId] = useState<string>('')

  useEffect(() => {
    // Créer un nouvel examen
    fetch('/api/exams', {
      method: 'POST',
      body: JSON.stringify({ certificationId: certification.id }),
      headers: { 'Content-Type': 'application/json' },
    })
      .then(res => res.json())
      .then(exam => {
        setExamId(exam.id)
        setQuestions(exam.examQuestions)
        // Initialiser les réponses depuis les données existantes
        const initialAnswers: Record<string, string[]> = {}
        exam.examQuestions.forEach((q: any) => {
          if (q.answers) {
            initialAnswers[q.id] = JSON.parse(q.answers)
          }
        })
        setAnswers(initialAnswers)
      })
  }, [certification.id])

  const handleAnswer = async (optionId: string) => {
    const currentAnswers = answers[questions[currentIndex].id] || []
    let newAnswers: string[]
    
    // Détermine si c'est une question à choix multiple
    const correctOptionsCount = questions[currentIndex].question.options.filter(
      (opt: any) => opt.isCorrect
    ).length
    
    if (correctOptionsCount > 1) {
      // Pour les questions à choix multiples
      if (currentAnswers.includes(optionId)) {
        newAnswers = currentAnswers.filter(id => id !== optionId)
      } else {
        newAnswers = [...currentAnswers, optionId]
      }
    } else {
      // Pour les questions à choix unique
      newAnswers = [optionId]
    }

    setAnswers(prev => ({
      ...prev,
      [questions[currentIndex].id]: newAnswers
    }))

    // Sauvegarder la réponse
    try {
      await fetch(`/api/exams/${examId}/answer`, {
        method: 'POST',
        body: JSON.stringify({
          questionId: questions[currentIndex].question.id,
          answers: newAnswers
        }),
        headers: { 'Content-Type': 'application/json' },
      })
    } catch (error) {
      console.error('Erreur lors de la sauvegarde de la réponse:', error)
    }
  }

  const handleFinishExam = async () => {
    const response = await fetch(`/api/exams/${examId}/finish`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    })
    
    if (response.ok) {
      router.push('/dashboard/results')
    }
  }

  const currentQuestion = questions[currentIndex]

  return (
    <div className="fixed inset-0 bg-white z-50 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-xl font-semibold">
            Question {currentIndex + 1} / {questions.length}
          </h2>
          <ExamTimer 
            duration={certification.duration} 
            onTimeUp={handleFinishExam}
          />
        </div>

        {currentQuestion && (
          <div className="space-y-6">
            <div>
              <div dangerouslySetInnerHTML={{ __html: currentQuestion.question.text }} />
              <div className="text-sm text-gray-500 mt-2">
                {currentQuestion.question.options.filter((opt: any) => opt.isCorrect).length > 1
                  ? "Sélectionnez toutes les réponses correctes"
                  : "Sélectionnez une seule réponse"}
              </div>
            </div>
            
            <div className="space-y-3">
              {currentQuestion.question.options.map((option: any) => (
                <button
                  key={option.id}
                  onClick={() => handleAnswer(option.id)}
                  className={`w-full p-4 text-left border rounded-lg ${
                    answers[currentQuestion.id]?.includes(option.id)
                      ? 'border-blue-500 bg-blue-50'
                      : 'hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-5 h-5 border rounded-${currentQuestion.question.options.filter((opt: any) => opt.isCorrect).length > 1 ? 'md' : 'full'} flex items-center justify-center ${
                      answers[currentQuestion.id]?.includes(option.id)
                        ? 'bg-blue-500 border-blue-500'
                        : 'border-gray-300'
                    }`}>
                      {answers[currentQuestion.id]?.includes(option.id) && (
                        <span className="text-white text-sm">✓</span>
                      )}
                    </div>
                    {option.text}
                  </div>
                </button>
              ))}
            </div>

            <div className="flex justify-between pt-4">
              <Button
                onClick={() => setCurrentIndex(i => i - 1)}
                disabled={currentIndex === 0}
              >
                Précédent
              </Button>
              {currentIndex === questions.length - 1 ? (
                <Button onClick={handleFinishExam} variant="default">
                  Terminer
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
