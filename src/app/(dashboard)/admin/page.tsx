'use client'

import { useState } from 'react'
import { CertificationList } from '@/components/certifications/CertificationList'
import { AddCertificationModal } from '@/components/certifications/AddCertificationModal'
import { Button } from '@/components/ui/button'

export default function AdminPage() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [refreshKey, setRefreshKey] = useState(0)

  const handleCertificationAdded = () => {
    setRefreshKey(prev => prev + 1)
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Certifications</h1>
        <Button onClick={() => setIsModalOpen(true)}>
          Ajouter une certification
        </Button>
      </div>
      <CertificationList key={refreshKey} />
      <AddCertificationModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        onSuccess={handleCertificationAdded}
      />
    </div>
  )
}
