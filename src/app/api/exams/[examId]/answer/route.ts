import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(
  request: Request,
  { params }: { params: { examId: string } }
) {
  const { examId } = params

  try {
    const { questionId, answers } = await request.json()

    // Récupérer la question pour vérifier les réponses
    const examQuestion = await prisma.examQuestion.findFirst({
      where: {
        examId,
        questionId,
      },
      include: {
        question: {
          include: {
            options: true
          }
        }
      }
    })

    if (!examQuestion) {
      return NextResponse.json({ error: 'Question non trouvée' }, { status: 404 })
    }

    // Vérifier si les réponses sont correctes
    const correctOptionIds = examQuestion.question.options
      .filter(opt => opt.isCorrect)
      .map(opt => opt.id)

    const isCorrect = correctOptionIds.length === answers.length &&
      correctOptionIds.every(id => answers.includes(id))

    // Mettre à jour la question d'examen
    const updatedExamQuestion = await prisma.examQuestion.update({
      where: {
        id: examQuestion.id
      },
      data: {
        answers: JSON.stringify(answers),
        isCorrect
      }
    })

    return NextResponse.json(updatedExamQuestion)
  } catch (error) {
    return NextResponse.json(
      { error: "Erreur lors de l'enregistrement de la réponse" },
      { status: 500 }
    )
  }
}
