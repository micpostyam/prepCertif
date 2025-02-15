import { NextResponse } from 'next/server'
import { hash, compare } from 'bcrypt'
import { prisma } from '@/lib/prisma'
import { getAuthUser } from '@/lib/auth'

export async function PUT(request: Request) {
  try {
    const user = await getAuthUser()
    const body = await request.json()
    const { name, email, currentPassword, newPassword } = body

    // Vérifier le mot de passe actuel si un nouveau mot de passe est fourni
    if (newPassword) {
      if (!currentPassword) {
        return NextResponse.json(
          { error: 'Le mot de passe actuel est requis' },
          { status: 400 }
        )
      }

      const validPassword = await compare(currentPassword, user.password)
      if (!validPassword) {
        return NextResponse.json(
          { error: 'Mot de passe actuel incorrect' },
          { status: 400 }
        )
      }
    }

    // Préparer les données de mise à jour
    const updateData: any = {
      name,
      email,
    }

    if (newPassword) {
      updateData.password = await hash(newPassword, 12)
    }

    // Mettre à jour l'utilisateur
    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: updateData,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
      },
    })

    return NextResponse.json(updatedUser)
  } catch (error) {
    console.error('Erreur lors de la mise à jour du profil:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la mise à jour du profil' },
      { status: 500 }
    )
  }
}
