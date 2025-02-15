'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'

interface AddCertificationModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess?: () => void
}

export function AddCertificationModal({ isOpen, onClose, onSuccess }: AddCertificationModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    numberOfQuestions: '',
    duration: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData(prev => ({
      ...prev,
      [e.target.id]: e.target.value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    console.error("formData", formData)
    try {
      const response = await fetch('/api/certifications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      if (!response.ok) throw new Error('Erreur lors de l\'ajout')
      
      onSuccess?.()
      onClose()
      setFormData({
        name: '',
        description: '',
        numberOfQuestions: '',
        duration: ''
      })
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Une erreur est survenue')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Ajouter une nouvelle certification</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">Titre</Label>
            <Input 
              id="name" 
              value={formData.name}
              onChange={handleChange}
              required 
            />
          </div>
          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea 
              id="description"
              value={formData.description}
              onChange={handleChange}
            />
          </div>
          <div>
            <Label htmlFor="numberOfQuestions">Nombre de questions</Label>
            <Input 
              id="numberOfQuestions"
              type="number"
              value={formData.numberOfQuestions}
              onChange={handleChange}
              required 
            />
          </div>
          <div>
            <Label htmlFor="duration">Durée (minutes)</Label>
            <Input 
              id="duration"
              type="number"
              value={formData.duration}
              onChange={handleChange}
              required 
            />
          </div>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'En cours...' : 'Ajouter'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
