import { cookies } from 'next/headers'
import * as jose from 'jose'

export type User = {
  id: string
  email: string
  name: string
  role: 'USER' | 'ADMIN'
}

export async function getAuthUser() {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get('token')

    if (!token) {
      return null
    }

    const secret = new TextEncoder().encode(process.env.JWT_SECRET || 'secret')
    const { payload } = await jose.jwtVerify(token.value, secret)

    return {
      id: payload.userId as string,
      role: payload.role as string
    }
  } catch (error) {
    console.error('Erreur d\'authentification:', error)
    return null
  }
}
