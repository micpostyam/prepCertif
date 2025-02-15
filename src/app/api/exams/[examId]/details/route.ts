import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getAuthUser } from '@/lib/auth'

export const dynamic = 'force-dynamic'

export async function GET(
  request: Request,
  { params }: { params: { examId: string } }
) {
  try {
    const examId = (await params).examId
    const user = await getAuthUser()
    
    if (!user) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
    }

    const exam = await prisma.exam.findUnique({
      where: { 
        id: examId,
        userId: user.id 
      },
      include: {
        examQuestions: {
          include: {
            question: {
              include: {
                options: true
              }
            }
          }
        }
      }
    })

    if (!exam) {
      return NextResponse.json({ error: 'Examen non trouvé' }, { status: 404 })
    }

    return NextResponse.json(exam)
  } catch (error) {
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des détails' },
      { status: 500 }
    )
  }
}
