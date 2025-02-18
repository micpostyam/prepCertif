'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Certification } from '@/types/certification'
import { TrashIcon } from '@heroicons/react/24/outline'

export function CertificationList() {
  const [certifications, setCertifications] = useState<Certification[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchCertifications = async () => {
    try {
      const response = await fetch('/api/certifications')
      if (!response.ok) throw new Error('Erreur lors du chargement')
      const data = await response.json()
      setCertifications(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchCertifications()
  }, [])

  const handleDelete = async (id: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette certification ?')) return

    try {
      const response = await fetch(`/api/certifications?id=${id}`, {
        method: 'DELETE',
      })
      
      if (!response.ok) throw new Error('Erreur lors de la suppression')
      
      await fetchCertifications() // Rafraîchir la liste
    } catch {
      alert('Erreur lors de la suppression')
    }
  }

  if (isLoading) return <div>Chargement...</div>
  if (error) return <div className="text-red-500">{error}</div>

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {certifications.map((cert) => (
        <Card key={cert.id} className="flex flex-col">
          <CardHeader>
            <div className="flex justify-between items-start">
              <h3 className="font-semibold text-lg">{cert.name}</h3>
              <Button 
                variant="ghost" 
                size="icon"
                className="text-red-600 hover:text-red-800 hover:bg-red-100"
                onClick={() => handleDelete(cert.id)}
              >
                <TrashIcon className="h-5 w-5" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="flex-grow">
            <p className="text-sm text-gray-500 mb-4">{cert.description}</p>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Questions:</span>
                <span className="font-medium">{cert.numberOfQuestions}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Durée:</span>
                <span className="font-medium">{cert.duration} minutes</span>
              </div>
            </div>
          </CardContent>
          <CardFooter className="text-xs text-gray-400">
            Créé le {new Date(cert.createdAt).toLocaleDateString()}
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}
