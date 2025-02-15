import { NextResponse } from 'next/server'
import { compare } from 'bcrypt'
import { prisma } from '@/lib/prisma'
import * as jose from 'jose'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { email, password } = body

    // Rechercher l'utilisateur avec son rôle
    const user = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        password: true,
        role: true,
        name: true
      }
    })

    if (!user) {
      return NextResponse.json(
        { error: 'Email ou mot de passe incorrect' },
        { status: 401 }
      )
    }

    // Vérifier le mot de passe
    const passwordValid = await compare(password, user.password)

    if (!passwordValid) {
      return NextResponse.json(
        { error: 'Email ou mot de passe incorrect' },
        { status: 401 }
      )
    }

    // Créer le token JWT avec le rôle
    const payload = {
      userId: user.id,
      role: user.role
    };
    
    const secret = new TextEncoder().encode(process.env.JWT_SECRET || 'secret')
    const token = await new jose.SignJWT(payload)
      .setProtectedHeader({ alg: 'HS256' })
      .setExpirationTime('24h')
      .sign(secret)

    // Ne pas renvoyer le mot de passe
    const { password: _, ...userWithoutPassword } = user
    
    const response = NextResponse.json({
      user: userWithoutPassword,
      token
    })

    // Ajouter le token dans un cookie httpOnly
    response.cookies.set({
      name: 'token',
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 86400 // 24 heures
    })

    return response
  } catch (error) {
    console.error('Erreur lors de la connexion:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la connexion' },
      { status: 500 }
    )
  }
}
