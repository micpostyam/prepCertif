import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import * as jose from 'jose'

interface DecodedToken {
  userId: string
  role: 'ADMIN' | 'USER'
}

async function getDecodedToken(token: string): Promise<DecodedToken | null> {
  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET || 'secret')
    const { payload } = await jose.jwtVerify(token, secret)
    
    if (typeof payload.userId !== 'string' || !['ADMIN', 'USER'].includes(payload.role as string)) {
      console.log("Token missing required fields or invalid values");
      return null;
    }
    
    return {
      userId: payload.userId,
      role: payload.role as 'ADMIN' | 'USER'
    };
  } catch (error) {
    console.error("Token verification failed:", error);
    return null;
  }
}

export async function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value;
  const isAuthPage = request.nextUrl.pathname.startsWith('/login') || 
                    request.nextUrl.pathname.startsWith('/register')
  const isAdminPage = request.nextUrl.pathname.startsWith('/admin')
  
  if (token) {
    const decodedToken = await getDecodedToken(token)
    
    if (isAuthPage) {
      if (decodedToken?.role === 'ADMIN') {
        return NextResponse.redirect(new URL('/admin', request.url))
      }
      return NextResponse.redirect(new URL('/dashboard', request.url))
    }

    if (isAdminPage && decodedToken?.role !== 'ADMIN') {
      return NextResponse.redirect(new URL('/dashboard', request.url))
    }
  } else if (!isAuthPage) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/login',
    '/register',
    '/dashboard/:path*',
    '/admin/:path*'
  ]
}
