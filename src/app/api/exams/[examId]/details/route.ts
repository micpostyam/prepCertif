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
    const examId = await context.params.examId
    const user = await getAuthUser()
    
    if (!user) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
    }

    const exam = await prisma.exam.findUnique({
      where: { 
        id: examId,
        // userId: user.id 
      },
      include: {
        certification: true,
        examQuestions: {
          include: {
            question: {
              include: {
                options: {
                  select: {
                    id: true,
                    text: true,
                    isCorrect: true,
                    details: true
                  }
                }
              }
            }
          },
          orderBy: {
            createdAt: 'asc'
          }
        }
      }
    })

    if (!exam) {
      return NextResponse.json({ error: 'Examen non trouvé' }, { status: 404 })
    }

    // Transformer les réponses JSON en tableaux JavaScript
    const formattedExam = {
      ...exam,
      examQuestions: exam.examQuestions.map((eq: { answers: string }) => ({
        ...eq,
        answers: JSON.parse(eq.answers || '[]')
      }))
    }

    return NextResponse.json(formattedExam)
  } catch (error) {
    console.error('Error in exam details:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des détails' },
      { status: 500 }
    )
  }
}
