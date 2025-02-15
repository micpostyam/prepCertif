'use client'

import { useEffect, useState } from 'react'
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Certification } from '@/types/certification'

interface CertificationListProps {
  onSelect: (certification: Certification) => void
}

export function CertificationList({ onSelect }: CertificationListProps) {
  const [certifications, setCertifications] = useState<Certification[]>([])

  useEffect(() => {
    fetch('/api/certifications')
      .then(res => res.json())
      .then(setCertifications)
  }, [])

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Examens disponibles</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {certifications.map((cert) => (
          <Card 
            key={cert.id}
            className="cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => onSelect(cert)}
          >
            <CardHeader>
              <CardTitle>{cert.name}</CardTitle>
              <CardDescription>
                {cert.numberOfQuestions} questions · {cert.duration} minutes
              </CardDescription>
            </CardHeader>
          </Card>
        ))}
      </div>
    </div>
  )
}
