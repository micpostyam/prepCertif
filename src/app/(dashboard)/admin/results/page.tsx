'use client'

import { useState, useEffect, useMemo } from 'react'
import { ExamResultModal } from '@/components/exam/ExamResultModal'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

const ITEMS_PER_PAGE = 10

export default function AdminResultsPage() {
  const [results, setResults] = useState([])
  const [selectedExam, setSelectedExam] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(1)

  useEffect(() => {
    fetch('/api/admin/results')
      .then(res => res.json())
      .then(data => setResults(data))
  }, [])

  // Filtrer les résultats en fonction du terme de recherche
  const filteredResults = useMemo(() => {
    return results.filter((result: any) => {
      const searchString = searchTerm.toLowerCase()
      return (
        result.user.name.toLowerCase().includes(searchString) ||
        result.user.email.toLowerCase().includes(searchString) ||
        result.certification.name.toLowerCase().includes(searchString)
      )
    })
  }, [results, searchTerm])

  // Calculer la pagination
  const totalPages = Math.ceil(filteredResults.length / ITEMS_PER_PAGE)
  const paginatedResults = filteredResults.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  )

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Résultats des examens</h2>
        <div className="w-72">
          <Input
            type="search"
            placeholder="Rechercher un utilisateur..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value)
              setCurrentPage(1) // Reset to first page on search
            }}
          />
        </div>
      </div>
      
      <div className="bg-white shadow-sm rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Utilisateur
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Certification
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Score
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {paginatedResults.map((result: any) => (
              <tr key={result.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div>
                    <div className="font-medium text-gray-900">{result.user.name}</div>
                    <div className="text-sm text-gray-500">{result.user.email}</div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {result.certification.name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap font-medium">
                  {result.score}%
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(result.completedAt).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <button
                    onClick={() => setSelectedExam(result)}
                    className="text-indigo-600 hover:text-indigo-900"
                  >
                    Voir détails
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination controls */}
      <div className="flex justify-between items-center mt-4">
        <div className="text-sm text-gray-700">
          Affichage de {Math.min(filteredResults.length, (currentPage - 1) * ITEMS_PER_PAGE + 1)} à{' '}
          {Math.min(currentPage * ITEMS_PER_PAGE, filteredResults.length)} sur{' '}
          {filteredResults.length} résultats
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={currentPage === 1}
          >
            Précédent
          </Button>
          {[...Array(totalPages)].map((_, i) => (
            <Button
              key={i + 1}
              variant={currentPage === i + 1 ? "default" : "outline"}
              onClick={() => setCurrentPage(i + 1)}
            >
              {i + 1}
            </Button>
          ))}
          <Button
            variant="outline"
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
          >
            Suivant
          </Button>
        </div>
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
