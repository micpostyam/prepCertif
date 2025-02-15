import { NextResponse } from 'next/server'

export async function POST() {
  const response = NextResponse.json(
    { success: true },
    { status: 200 }
  )

  response.cookies.set({
    name: 'token',
    value: '',
    httpOnly: true,
    expires: new Date(0),
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/'
  })

  return response
}
