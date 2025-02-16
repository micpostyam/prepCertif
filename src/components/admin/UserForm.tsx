'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

interface User {
  id: string
  name: string | null
  email: string
  role: string
}

interface UserFormProps {
  user?: User | null
  onClose: () => void
  onSuccess: () => void
}

export function UserForm({ user, onClose, onSuccess }: UserFormProps) {
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    password: '',
    role: user?.role || 'USER',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const url = user
      ? `/api/admin/users/${user.id}`
      : '/api/admin/users'
    
    const method = user ? 'PUT' : 'POST'

    const response = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    })

    if (response.ok) {
      onSuccess()
    }
  }

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent aria-describedby="user-form-description">
        <DialogHeader>
          <DialogTitle>
            {user ? 'Modifier' : 'Créer'} un utilisateur
          </DialogTitle>
          <p id="user-form-description" className="text-sm text-gray-500">
            {user 
              ? 'Modifiez les informations de l\'utilisateur ci-dessous.' 
              : 'Remplissez les informations pour créer un nouvel utilisateur.'}
          </p>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">
              Nom
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full border rounded-md p-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              Email
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full border rounded-md p-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              Mot de passe
            </label>
            <input
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="w-full border rounded-md p-2"
              placeholder={user ? '(Laisser vide pour ne pas modifier)' : ''}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              Rôle
            </label>
            <select
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              className="w-full border rounded-md p-2"
            >
              <option value="USER">Utilisateur</option>
              <option value="ADMIN">Administrateur</option>
            </select>
          </div>
          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Annuler
            </Button>
            <Button type="submit">
              {user ? 'Modifier' : 'Créer'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
