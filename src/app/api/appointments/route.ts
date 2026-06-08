import { NextRequest, NextResponse } from 'next/server'
import { appointmentService } from '@/services/appointments'

export async function GET(req: NextRequest) {
  try {
    const id = req.nextUrl.searchParams.get('id')
    const patientId = req.nextUrl.searchParams.get('patientId')
    const upcoming = req.nextUrl.searchParams.get('upcoming')

    if (id) {
      const appointment = await appointmentService.getById(id)
      return NextResponse.json(appointment)
    }

    if (patientId) {
      const appointments = await appointmentService.getByPatient(patientId)
      return NextResponse.json(appointments)
    }

    if (upcoming) {
      const appointments = await appointmentService.getUpcoming()
      return NextResponse.json(appointments)
    }

    const appointments = await appointmentService.getAll()
    return NextResponse.json(appointments)
  } catch (error) {
    console.error('GET /api/appointments error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to fetch appointments' },
      { status: 500 }
    )
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const appointment = await appointmentService.create(body)
    return NextResponse.json(appointment, { status: 201 })
  } catch (error) {
    console.error('POST /api/appointments error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to create appointment' },
      { status: 500 }
    )
  }
}

export async function PUT(req: NextRequest) {
  try {
    const id = req.nextUrl.searchParams.get('id')
    if (!id) {
      return NextResponse.json({ error: 'Missing appointment ID' }, { status: 400 })
    }

    const body = await req.json()
    const appointment = await appointmentService.update(id, body)
    return NextResponse.json(appointment)
  } catch (error) {
    console.error('PUT /api/appointments error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to update appointment' },
      { status: 500 }
    )
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const id = req.nextUrl.searchParams.get('id')
    if (!id) {
      return NextResponse.json({ error: 'Missing appointment ID' }, { status: 400 })
    }

    await appointmentService.delete(id)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('DELETE /api/appointments error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to delete appointment' },
      { status: 500 }
    )
  }
}
