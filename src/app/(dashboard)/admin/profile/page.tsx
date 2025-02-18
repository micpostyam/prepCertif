export const dynamic = "force-dynamic"; 

import { getAuthUser } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { ProfileForm } from '@/components/profile/ProfileForm'

export default async function ProfilePage() {
  const auth = await getAuthUser()
  
  if (!auth) {
    throw new Error("Not authenticated")
  }

  const user = await prisma.user.findUnique({
    where: { id: auth.id },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
    },
  })

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Mon profil</h2>
        <p className="text-gray-500">Gérez vos informations personnelles</p>
      </div>
      
      <div className="bg-white shadow rounded-lg p-6">
        <ProfileForm user={user} />
      </div>
    </div>
  )
}
