'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'
import {
  AcademicCapIcon,
  DocumentCheckIcon,
  UserGroupIcon,
  UserIcon,
  DocumentTextIcon,
  ClipboardDocumentCheckIcon,
} from '@heroicons/react/24/outline'

const userNavigation = [
  { name: 'Examens', href: '/dashboard', icon: ClipboardDocumentCheckIcon },
  { name: 'Résultats', href: '/dashboard/results', icon: DocumentCheckIcon },
  { name: 'Profil', href: '/dashboard/profile', icon: UserIcon },
]

const adminNavigation = [
  { name: 'Certifications', href: '/admin', icon: AcademicCapIcon },
  { name: 'Questions', href: '/admin/questions', icon: DocumentTextIcon },
  { name: 'Résultats', href: '/admin/results', icon: DocumentCheckIcon },
  { name: 'Utilisateurs', href: '/admin/users', icon: UserGroupIcon },
  { name: 'Profil', href: '/admin/profile', icon: UserIcon },
]

export function Sidebar() {
  const pathname = usePathname()
  const isAdmin = pathname.startsWith('/admin')
  const navigation = isAdmin ? adminNavigation : userNavigation

  return (
    <div className="fixed inset-y-0 left-0 z-50 w-72 bg-white border-r">
      <div className="flex flex-col h-full">
        <div className="flex h-16 items-center px-6">
          <Link href="/" className="text-xl font-bold">
            PrepCertif
          </Link>
        </div>
        <nav className="flex-1 space-y-1 px-4 py-4">
          {navigation.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                  isActive
                    ? 'bg-indigo-50 text-indigo-600'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <item.icon className="mr-3 h-6 w-6" />
                {item.name}
              </Link>
            )
          })}
        </nav>
      </div>
    </div>
  )
}
