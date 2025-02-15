import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const questions = await prisma.question.findMany({
      include: {
        options: true,
        certification: true,
      },
      orderBy: { createdAt: 'desc' },
    })
    return NextResponse.json(questions)
  } catch (error) {
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des questions' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()

    console.log("body", body)
    
    const question = await prisma.question.create({
      data: {
        text: body.text,
        certificationId: body.certificationId,
        options: {
          create: body.options.map((option: any) => ({
            text: option.text,
            details: option.details,
            isCorrect: option.isCorrect,
          }))
        }
      },
      include: {
        options: true,
      }
    })
    
    return NextResponse.json(question)
  } catch (error) {
    return NextResponse.json(
      { error: 'Erreur lors de la création de la question' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    
    if (!id) {
      return NextResponse.json(
        { error: 'ID manquant' },
        { status: 400 }
      )
    }

    // Supprimer d'abord les options associées
    await prisma.option.deleteMany({
      where: { questionId: id }
    })

    // Puis supprimer la question
    await prisma.question.delete({
      where: { id }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json(
      { error: 'Erreur lors de la suppression' },
      { status: 500 }
    )
  }
}
