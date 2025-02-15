'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { toast } from 'sonner'

type ProfileFormData = {
  name: string
  email: string
  currentPassword?: string
  newPassword?: string
  confirmPassword?: string
}

export function ProfileForm({ user }: { user: any }) {
  const [isLoading, setIsLoading] = useState(false)
  const { register, handleSubmit, formState: { errors }, watch } = useForm<ProfileFormData>({
    defaultValues: {
      name: user.name,
      email: user.email
    }
  })

  const onSubmit = async (data: ProfileFormData) => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      if (!response.ok) throw new Error('Échec de la mise à jour')
      
      toast.success('Profil mis à jour avec succès')
    } catch (error) {
      toast.error('Erreur lors de la mise à jour du profil')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium">
            Nom
          </label>
          <Input
            id="name"
            {...register('name', { required: 'Le nom est requis' })}
          />
          {errors.name && (
            <p className="text-sm text-red-500">{errors.name.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium">
            Email
          </label>
          <Input
            id="email"
            type="email"
            {...register('email', { required: 'L\'email est requis' })}
          />
          {errors.email && (
            <p className="text-sm text-red-500">{errors.email.message}</p>
          )}
        </div>

        <div className="pt-4">
          <h3 className="text-lg font-medium">Changer le mot de passe</h3>
          <div className="mt-4 space-y-4">
            <div>
              <label htmlFor="currentPassword" className="block text-sm font-medium">
                Mot de passe actuel
              </label>
              <Input
                id="currentPassword"
                type="password"
                {...register('currentPassword')}
              />
            </div>

            <div>
              <label htmlFor="newPassword" className="block text-sm font-medium">
                Nouveau mot de passe
              </label>
              <Input
                id="newPassword"
                type="password"
                {...register('newPassword')}
              />
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium">
                Confirmer le mot de passe
              </label>
              <Input
                id="confirmPassword"
                type="password"
                {...register('confirmPassword', {
                  validate: (value) => 
                    !watch('newPassword') || value === watch('newPassword') || 
                    'Les mots de passe ne correspondent pas'
                })}
              />
              {errors.confirmPassword && (
                <p className="text-sm text-red-500">{errors.confirmPassword.message}</p>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Enregistrement...' : 'Enregistrer les modifications'}
        </Button>
      </div>
    </form>
  )
}
