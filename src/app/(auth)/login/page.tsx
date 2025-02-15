import { LoginForm } from '@/components/auth/login-form'
import Image from 'next/image'

export default function LoginPage() {
  return (
    <div className="flex min-h-screen w-2/3 justify-center">
      {/* Côté gauche - Image décorative */}
      <div className="w-1/2 hidden lg:flex relative">
        <Image
          src="/auth-background.svg"
          alt="Background"
          fill
          className=""
        />
      </div>

      {/* Côté droit - Formulaire */}
      <div className="lg:w-1/2 flex flex-col justify-center px-4 sm:px-6 lg:px-20 xl:px-24">
        <div className="mx-auto w-full max-w-sm lg:w-96">
          <div className="text-center mb-8">
          <Image
            src="/logo.svg"
            alt="Logo"
            width={48}
            height={48}
            className="mx-auto"
          />
          <h1 className="mt-6 text-3xl font-bold tracking-tight ">
            Connexion à votre compte
          </h1>
          <p className="mt-2 text-sm text-gray-600">
            Ou{' '}
            <a href="/register" className="font-medium text-indigo-600 hover:text-indigo-500">
            créer un nouveau compte
            </a>
          </p>
          </div>
          <LoginForm />
        </div>
      </div>
    </div>
  )
}