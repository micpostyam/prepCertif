'use client'

import { useState } from 'react'
import { CertificationList } from '@/components/exam/CertificationList'
import { ExamModal } from '@/components/exam/ExamModal'
import { CertificationPreview } from '@/components/exam/CertificationPreview'


export default function DashboardPage() {
  const [selectedCertification, setSelectedCertification] = useState<any>(null)
  const [examStarted, setExamStarted] = useState(false)

  const handleStartExam = () => {
    setExamStarted(true)
  }

  return (
    <div className="p-6">
      {!selectedCertification && (
        <CertificationList onSelect={setSelectedCertification} />
      )}
      
      {selectedCertification && !examStarted && (
        <CertificationPreview
          certification={selectedCertification}
          onBack={() => setSelectedCertification(null)}
          onStart={handleStartExam}
        />
      )}

      {examStarted && (
        <ExamModal
          certification={selectedCertification}
          onClose={() => setExamStarted(false)}
        />
      )}
    </div>
  )
}
