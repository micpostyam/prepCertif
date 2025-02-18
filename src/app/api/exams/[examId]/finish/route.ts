/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export async function POST(
  request: Request,
  context: any
) {
  const { examId } = context.params

  try {
    // Récupérer toutes les questions de l'examen
    const exam = await prisma.exam.findUnique({
      where: { id: examId },
      include: {
        examQuestions: true
      }
    })

    if (!exam) {
      return NextResponse.json({ error: 'Examen non trouvé' }, { status: 404 })
    }

    // Calculer le score
    const totalQuestions = exam.examQuestions.length
    const correctAnswers = exam.examQuestions.filter(q => q.isCorrect).length
    const score = (correctAnswers / totalQuestions) * 100

    // Mettre à jour l'examen
    const updatedExam = await prisma.exam.update({
      where: { id: examId },
      data: {
        status: 'completed',
        score,
        completedAt: new Date()
      }
    })

    return NextResponse.json(updatedExam)
  } catch {
    return NextResponse.json(
      { error: "Erreur lors de la finalisation de l'examen" },
      { status: 500 }
    )
  }
}
