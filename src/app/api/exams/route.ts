import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getAuthUser } from '@/lib/auth'

export async function POST(request: Request) {
  const user = await getAuthUser()
  if (!user) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
  }

  try {
    const body = await request.json()
    const { certificationId } = body

    // Récupérer la certification avec ses questions
    const certification = await prisma.certification.findUnique({
      where: { id: certificationId },
      include: {
        questions: {
          include: {
            options: true
          }
        }
      }
    })

    if (!certification) {
      return NextResponse.json(
        { error: 'Certification non trouvée' },
        { status: 404 }
      )
    }

    // Mélanger toutes les questions et en prendre numberOfQuestions
    const shuffledQuestions = certification.questions
      .sort(() => Math.random() - 0.5)
      .slice(0, certification.numberOfQuestions)

    // Créer l'examen avec ses questions
    const exam = await prisma.exam.create({
      data: {
        userId: user.id, // Utiliser l'ID de l'utilisateur du token
        certificationId,
        status: 'in_progress',
        examQuestions: {
          create: shuffledQuestions.map(question => ({
            questionId: question.id
          }))
        }
      },
      include: {
        examQuestions: {
          include: {
            question: {
              include: {
                options: {
                  select: {
                    id: true,
                    text: true,
                    isCorrect: true
                  }
                }
              }
            }
          }
        }
      }
    })

    return NextResponse.json(exam)
  } catch (error) {
    console.error('Erreur lors de la création de l\'examen:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la création de l\'examen' },
      { status: 500 }
    )
  }
}

export async function GET(request: Request) {
  const user = await getAuthUser()
  if (!user) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
  }

  try {
    const { searchParams } = new URL(request.url)
    const certificationId = searchParams.get('certificationId')

    const where = certificationId 
      ? { userId: user.id, certificationId }
      : { userId: user.id }

    const exams = await prisma.exam.findMany({
      where,
      include: {
        certification: true
      },
      orderBy: { startedAt: 'desc' }
    })

    return NextResponse.json(exams)
  } catch (error) {
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des examens' },
      { status: 500 }
    )
  }
}
