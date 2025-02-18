'use client'

import { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Certification } from '@/types/certification'
import { PlusIcon, MinusIcon } from '@heroicons/react/24/outline'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import RichTextEditor from '../editor/RichTextEditor'

interface AddQuestionModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess?: () => void
}

interface Option {
  text: string
  details?: string
  isCorrect: boolean
}

export function AddQuestionModal({ isOpen, onClose, onSuccess }: AddQuestionModalProps) {
  const [certifications, setCertifications] = useState<Certification[]>([])
  const [formData, setFormData] = useState({
    text: '',
    certificationId: '',
    options: [{ text: '', details: '', isCorrect: false }]
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    fetch('/api/certifications')
      .then(res => res.json())
      .then(setCertifications)
  }, [])

  const handleOptionChange = (index: number, field: keyof Option, value: string | boolean) => {
    setFormData(prev => {
      const newOptions = [...prev.options]
      newOptions[index] = { ...newOptions[index], [field]: value }
      return { ...prev, options: newOptions }
    })
  }

  const addOption = () => {
    setFormData(prev => ({
      ...prev,
      options: [...prev.options, { text: '', details: '', isCorrect: false }]
    }))
  }

  const removeOption = (index: number) => {
    if (formData.options.length <= 1) return // Garder au moins une option
    setFormData(prev => ({
      ...prev,
      options: prev.options.filter((_, i) => i !== index)
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validation : au moins une option doit être correcte
    if (!formData.options.some(opt => opt.isCorrect)) {
      alert('Au moins une option doit être marquée comme correcte')
      return
    }

    setIsSubmitting(true)

    console.log("formData", formData)
    

    try {
      const response = await fetch('/api/questions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      if (!response.ok) throw new Error('Erreur lors de l\'ajout')
      
      onSuccess?.()
      onClose()
      setFormData({
        text: '',
        certificationId: '',
        options: [{ text: '', details: '', isCorrect: false }]
      })
    } catch {
      alert('Erreur lors de l\'ajout de la question')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Ajouter une nouvelle question</DialogTitle>
          <DialogDescription>
            Créez une nouvelle question avec ses options de réponse.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="certification">Certification</Label>
            <Select
              value={formData.certificationId}
              onValueChange={(value) => setFormData(prev => ({ ...prev, certificationId: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner une certification" />
              </SelectTrigger>
              <SelectContent>
                {certifications.map((cert) => (
                  <SelectItem key={cert.id} value={cert.id}>
                    {cert.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="text">Question</Label>
            <RichTextEditor 
              initialValue={formData.text}
              onChange={(content: string) => {
                setFormData(prev => ({ 
                  ...prev, 
                  text: content
                }))
              }}
            />
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <Label>Options</Label>
              <Button
                type="button"
                onClick={addOption}
                variant="outline"
                size="sm"
                className="flex items-center gap-2"
              >
                <PlusIcon className="h-4 w-4" />
                Ajouter une option
              </Button>
            </div>
            
            {formData.options.map((option, index) => (
              <div key={index} className="space-y-2 p-4 border rounded relative">
                <div className="flex gap-2">
                  <Input
                    placeholder={`Option ${index + 1}`}
                    value={option.text}
                    onChange={(e) => handleOptionChange(index, 'text', e.target.value)}
                    required
                  />
                  <Button
                    type="button"
                    variant={option.isCorrect ? "default" : "outline"}
                    onClick={() => handleOptionChange(index, 'isCorrect', !option.isCorrect)}
                  >
                    {option.isCorrect ? 'Correcte' : 'Incorrecte'}
                  </Button>
                  {formData.options.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => removeOption(index)}
                      className="text-red-600 hover:text-red-800 hover:bg-red-100"
                    >
                      <MinusIcon className="h-4 w-4" />
                    </Button>
                  )}
                </div>
                <Input
                  placeholder="Détails (optionnel)"
                  value={option.details}
                  onChange={(e) => handleOptionChange(index, 'details', e.target.value)}
                />
              </div>
            ))}
          </div>

          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'En cours...' : 'Ajouter'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
