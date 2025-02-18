/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { useState, useEffect } from 'react'
import { ExamResultModal } from '@/components/exam/ExamResultModal'

export default function ResultsPage() {
  const [exams, setExams] = useState([])
  const [selectedExam, setSelectedExam] = useState<{id: string} | null>(null)

  useEffect(() => {
    fetch('/api/exams')
      .then(res => res.json())
      .then(data => setExams(data))
  }, [])

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Mes résultats</h2>
      <div className="grid gap-4">
        {exams.map((exam: any) => (
          <div
            key={exam.id}
            className="p-4 bg-white rounded-lg shadow hover:shadow-md cursor-pointer"
            onClick={() => setSelectedExam(exam)}
          >
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-semibold">{exam.certification.name}</h3>
                <p className="text-sm text-gray-600">
                  {new Date(exam.completedAt).toLocaleDateString()}
                </p>
              </div>
              <div className="text-lg font-bold">
                {exam.score}%
              </div>
            </div>
          </div>
        ))}
      </div>

      {selectedExam && (
        <ExamResultModal
          examId={selectedExam.id}
          onClose={() => setSelectedExam(null)}
        />
      )}
    </div>
  )
}
