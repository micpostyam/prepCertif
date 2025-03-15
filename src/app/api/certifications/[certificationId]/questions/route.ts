/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getAuthUser } from '@/lib/auth'

export const dynamic = 'force-dynamic'

export async function GET(
  request: Request,
  context: any
) {
  try {
    const certificationId = await context.params.certificationId
    const user = await getAuthUser()
    
    if (!user) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
    }

    const questions = await prisma.question.findMany({
      where: {
        certificationId: certificationId
      },
      include: {
        options: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return NextResponse.json(questions)
  } catch (error) {
    console.error('Error in questions details:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des questions'},
      { status: 500 }
    )
  }
}