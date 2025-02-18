/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from 'next/server'
import { hash } from 'bcrypt'
import { prisma } from '@/lib/prisma'
import { getAuthUser } from '@/lib/auth'

async function checkAdminRole() {
  const user = await getAuthUser()
  if (!user || user.role !== 'ADMIN') {
    return false
  }
  return true
}

export async function PUT(
  request: Request,
  context: any
) {
  if (!await checkAdminRole()) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
  }

  const { params } = context
  const body = await request.json()
  const { email, name, password, role } = body

  const updateData: any = {
    email,
    name,
    role,
  }

  if (password) {
    updateData.password = await hash(password, 12)
  }

  const user = await prisma.user.update({
    where: { id: params.userId },
    data: updateData,
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
    },
  })

  return NextResponse.json(user)
}

export async function DELETE(
  request: Request,
  context: any
) {
  if (!await checkAdminRole()) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
  }

  const { params } = context

  await prisma.user.delete({
    where: { id: params.userId },
  })

  return NextResponse.json({ success: true })
}
