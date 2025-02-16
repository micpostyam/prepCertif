import { NextResponse } from 'next/server'
import { hash } from 'bcrypt'
import { prisma } from '@/lib/prisma'
import { getAuthUser } from '@/lib/auth'

async function checkAdminRole() {
  const user = await getAuthUser()
  if (!user || user.role !== 'ADMIN') {
    return false
  }
  return true
}

export async function GET() {
  try {
    if (!await checkAdminRole()) {
      return new NextResponse(
        JSON.stringify({ error: 'Non autorisé' }), 
        { status: 401 }
      )
    }

    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
      },
      orderBy: { createdAt: 'desc' },
    })

    return new NextResponse(JSON.stringify(users))
  } catch (error) {
    console.error('Erreur GET users:', error)
    return new NextResponse(
      JSON.stringify({ error: 'Erreur serveur interne' }), 
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    if (!await checkAdminRole()) {
      return new NextResponse(
        JSON.stringify({ error: 'Non autorisé' }), 
        { status: 401 }
      )
    }

    const body = await request.json()
    const { email, name, password, role } = body

    if (!email || !password) {
      return new NextResponse(
        JSON.stringify({ error: 'Email et mot de passe requis' }), 
        { status: 400 }
      )
    }

    const hashedPassword = await hash(password, 10)

    const user = await prisma.user.create({
      data: {
        email,
        name,
        password: hashedPassword,
        role,
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
      }
    })

    return new NextResponse(
      JSON.stringify(user),
      { status: 201 }
    )

  } catch (error) {
    console.error('Erreur POST user:', error)
    return new NextResponse(
      JSON.stringify({ 
        error: 'Erreur lors de la création de l\'utilisateur',
        details: error instanceof Error ? error.message : 'Unknown error'
      }), 
      { status: 500 }
    )
  }
}
