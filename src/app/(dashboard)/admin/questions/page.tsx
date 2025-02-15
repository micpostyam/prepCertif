'use client'

import { useState } from 'react'
import { QuestionList } from '@/components/questions/QuestionList'
import { AddQuestionModal } from '@/components/questions/AddQuestionModal'
import { Button } from '@/components/ui/button'

export default function QuestionsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [refreshKey, setRefreshKey] = useState(0)

  const handleQuestionAdded = () => {
    setRefreshKey(prev => prev + 1)
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Questions</h1>
        <Button onClick={() => setIsModalOpen(true)}>
          Ajouter une question
        </Button>
      </div>
      <QuestionList key={refreshKey} />
      <AddQuestionModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={handleQuestionAdded}
      />
    </div>
  )
}
