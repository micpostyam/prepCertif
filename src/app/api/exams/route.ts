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

    if (!certificationId) {
      return NextResponse.json(
        { error: 'certificationId est requis' },
        { status: 400 }
      )
    }

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

    return NextResponse.json({ certification }, { status: 200 })

  } catch (error) {
    console.error('Error fetching certification:', error)
    return NextResponse.json(
      { error: 'Erreur serveur interne' },
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
