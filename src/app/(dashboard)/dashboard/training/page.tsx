'use client'

import { useState } from 'react'
import { CertificationList } from '@/components/exam/CertificationList'
import { CertificationPreview } from '@/components/exam/CertificationPreview'
import { TrainingModal } from '@/components/training/TrainingModal'

export default function TrainingPage() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [selectedCertification, setSelectedCertification] = useState<any>(null)
  const [trainingStarted, setTrainingStarted] = useState(false)

  return (
    <div className="p-6">
      {!selectedCertification && (
        <CertificationList onSelect={setSelectedCertification} />
      )}
      
      {selectedCertification && !trainingStarted && (
        <CertificationPreview
          certification={selectedCertification}
          onBack={() => setSelectedCertification(null)}
          onStart={() => setTrainingStarted(true)}
        />
      )}

      {trainingStarted && (
        <TrainingModal
          certification={selectedCertification}
          onClose={() => {
            setTrainingStarted(false)
            setSelectedCertification(null)
          }}
        />
      )}
    </div>
  )
}
