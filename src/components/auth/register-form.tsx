'use client'

import { useState } from 'react'
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline'

export function RegisterForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    acceptTerms: false
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Une erreur est survenue')
      }

      // Rediriger vers la page de connexion
      window.location.href = '/login'
    } catch (error) {
      console.error('Erreur:', error)
      alert(error instanceof Error ? error.message : 'Une erreur est survenue')
    } finally {
      setIsLoading(false)
    }
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value
    setFormData({
      ...formData,
      [e.target.name]: value
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="name" className="block text-sm font-medium">
          Nom complet
        </label>
        <div className="mt-1">
          <input
            id="name"
            name="name"
            type="text"
            autoComplete="name"
            required
            value={formData.name}
            onChange={handleChange}
            className="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 shadow-sm placeholder-gray-400 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm transition-all"
            placeholder="John Doe"
          />
        </div>
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-medium">
          Adresse email
        </label>
        <div className="mt-1">
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            value={formData.email}
            onChange={handleChange}
            className="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 shadow-sm placeholder-gray-400 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm transition-all"
            placeholder="vous@exemple.com"
          />
        </div>
      </div>

      <div>
        <label htmlFor="password" className="block text-sm font-medium">
          Mot de passe
        </label>
        <div className="mt-1 relative">
          <input
            id="password"
            name="password"
            type={showPassword ? 'text' : 'password'}
            required
            value={formData.password}
            onChange={handleChange}
            className="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 shadow-sm placeholder-gray-400 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm pr-10 transition-all"
            placeholder="••••••••"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute inset-y-0 right-0 flex items-center pr-3"
          >
            {showPassword ? (
              <EyeSlashIcon className="h-5 w-5 text-gray-400" />
            ) : (
              <EyeIcon className="h-5 w-5 text-gray-400" />
            )}
          </button>
        </div>
      </div>

      <div>
        <label htmlFor="confirmPassword" className="block text-sm font-medium">
          Confirmer le mot de passe
        </label>
        <div className="mt-1 relative">
          <input
            id="confirmPassword"
            name="confirmPassword"
            type={showConfirmPassword ? 'text' : 'password'}
            required
            value={formData.confirmPassword}
            onChange={handleChange}
            className="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 shadow-sm placeholder-gray-400 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm pr-10 transition-all"
            placeholder="••••••••"
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute inset-y-0 right-0 flex items-center pr-3"
          >
            {showConfirmPassword ? (
              <EyeSlashIcon className="h-5 w-5 text-gray-400" />
            ) : (
              <EyeIcon className="h-5 w-5 text-gray-400" />
            )}
          </button>
        </div>
      </div>

      <div className="flex items-center">
        <input
          id="acceptTerms"
          name="acceptTerms"
          type="checkbox"
          required
          checked={formData.acceptTerms}
          onChange={handleChange}
          className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
        />
        <label htmlFor="acceptTerms" className="ml-2 block text-sm text-gray-900">
          J&apos;accepte les{' '}
          <a href="/terms" className="font-medium text-indigo-600 hover:text-indigo-500">
            conditions d&apos;utilisation
          </a>
        </label>
      </div>

      <div>
        <button
          type="submit"
          disabled={isLoading}
          className="flex w-full justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        >
          {isLoading ? (
            <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          ) : (
            'Créer un compte'
          )}
        </button>
      </div>
    </form>
  )
}
