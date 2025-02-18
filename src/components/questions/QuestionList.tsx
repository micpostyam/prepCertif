'use client'

import { useState, useEffect } from 'react'
import { Question } from '@/types/question'
import { Certification } from '@/types/certification'
import { Card, CardContent, CardHeader, CardFooter } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { TrashIcon, ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline'
import RichTextEditor from '../editor/RichTextEditor'

export function QuestionList() {
  const [questions, setQuestions] = useState<Question[]>([])
  const [certifications, setCertifications] = useState<Certification[]>([])
  const [selectedCertification, setSelectedCertification] = useState<string>('all')
  const [isLoading, setIsLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const questionsPerPage = 6 // Nombre de questions par page

  useEffect(() => {
    Promise.all([
      fetch('/api/questions').then(res => res.json()),
      fetch('/api/certifications').then(res => res.json())
    ]).then(([questionsData, certificationsData]) => {
      setQuestions(questionsData)
      setCertifications(certificationsData)
      setIsLoading(false)
    })
  }, [])

  const handleDelete = async (id: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette question ?')) return

    try {
      const response = await fetch(`/api/questions?id=${id}`, {
        method: 'DELETE',
      })
      
      if (!response.ok) throw new Error('Erreur lors de la suppression')
      
      setQuestions(questions.filter(q => q.id !== id))
    } catch {
      alert('Erreur lors de la suppression')
    }
  }

  const filteredQuestions = selectedCertification === 'all'
    ? questions
    : questions.filter(q => q.certificationId === selectedCertification)

  // Calcul pour la pagination
  const indexOfLastQuestion = currentPage * questionsPerPage
  const indexOfFirstQuestion = indexOfLastQuestion - questionsPerPage
  const currentQuestions = filteredQuestions.slice(indexOfFirstQuestion, indexOfLastQuestion)
  const totalPages = Math.ceil(filteredQuestions.length / questionsPerPage)

  const goToNextPage = () => {
    setCurrentPage(page => Math.min(page + 1, totalPages))
  }

  const goToPreviousPage = () => {
    setCurrentPage(page => Math.max(page - 1, 1))
  }

  if (isLoading) return <div>Chargement...</div>

  return (
    <div className="space-y-4">
      <div className="w-[250px]">
        <Select
          value={selectedCertification}
          onValueChange={setSelectedCertification}
        >
          <SelectTrigger>
            <SelectValue placeholder="Filtrer par certification" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Toutes les certifications</SelectItem>
            {certifications.map((cert) => (
              <SelectItem key={cert.id} value={cert.id}>
                {cert.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {currentQuestions.map((question) => (
          <Card key={question.id}>
            <CardHeader className="flex flex-row justify-between items-start">
              <div className="flex-1">
                <RichTextEditor initialValue={question.text} readOnly={true} />
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="text-red-600 hover:text-red-800 hover:bg-red-100 ml-2"
                onClick={() => handleDelete(question.id)}
              >
                <TrashIcon className="h-5 w-5" />
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {question.options.map((option) => (
                  <div
                    key={option.id}
                    className={`p-2 rounded ${
                      option.isCorrect ? 'bg-green-100' : 'bg-gray-100'
                    }`}
                  >
                    {option.text}
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter className="text-xs text-gray-500">
              Certification: {certifications.find(c => c.id === question.certificationId)?.name}
            </CardFooter>
          </Card>
        ))}
      </div>

      {/* Contrôles de pagination */}
      {filteredQuestions.length > questionsPerPage && (
        <div className="flex justify-center items-center gap-4 mt-6">
          <Button
            variant="outline"
            size="sm"
            onClick={goToPreviousPage}
            disabled={currentPage === 1}
          >
            <ChevronLeftIcon className="h-4 w-4" />
            Précédent
          </Button>
          
          <span className="text-sm">
            Page {currentPage} sur {totalPages}
          </span>

          <Button
            variant="outline"
            size="sm"
            onClick={goToNextPage}
            disabled={currentPage === totalPages}
          >
            Suivant
            <ChevronRightIcon className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  )
}
