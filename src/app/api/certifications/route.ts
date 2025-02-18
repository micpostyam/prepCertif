import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const certifications = await prisma.certification.findMany({
      orderBy: { createdAt: 'desc' }
    })
    return NextResponse.json(certifications)
  } catch {
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des certifications' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const certification = await prisma.certification.create({
      data: {
        name: body.name,
        description: body.description,
        numberOfQuestions: parseInt(body.numberOfQuestions),
        duration: parseInt(body.duration),
      }
    })
    return NextResponse.json(certification)
  } catch {
    return NextResponse.json(
      { error: 'Erreur lors de la création de la certification' },
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

    await prisma.certification.delete({
      where: { id }
    })

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json(
      { error: 'Erreur lors de la suppression' },
      { status: 500 }
    )
  }
}
