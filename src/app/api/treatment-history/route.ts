import { NextRequest, NextResponse } from 'next/server'
import { treatmentHistoryService } from '@/services/treatmentHistory'

export async function GET(req: NextRequest) {
  try {
    const id = req.nextUrl.searchParams.get('id')
    const patientId = req.nextUrl.searchParams.get('patientId')
    const appointmentId = req.nextUrl.searchParams.get('appointmentId')

    if (id) {
      const treatment = await treatmentHistoryService.getById(id)
      return NextResponse.json(treatment)
    }

    if (patientId) {
      const treatments = await treatmentHistoryService.getByPatient(patientId)
      return NextResponse.json(treatments)
    }

    if (appointmentId) {
      const treatments = await treatmentHistoryService.getByAppointment(appointmentId)
      return NextResponse.json(treatments)
    }

    const treatments = await treatmentHistoryService.getAll()
    return NextResponse.json(treatments)
  } catch (error) {
    console.error('GET /api/treatment-history error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to fetch treatment history' },
      { status: 500 }
    )
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const treatment = await treatmentHistoryService.create(body)
    return NextResponse.json(treatment, { status: 201 })
  } catch (error) {
    console.error('POST /api/treatment-history error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to create treatment' },
      { status: 500 }
    )
  }
}

export async function PUT(req: NextRequest) {
  try {
    const id = req.nextUrl.searchParams.get('id')
    if (!id) {
      return NextResponse.json({ error: 'Missing treatment ID' }, { status: 400 })
    }

    const body = await req.json()
    const treatment = await treatmentHistoryService.update(id, body)
    return NextResponse.json(treatment)
  } catch (error) {
    console.error('PUT /api/treatment-history error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to update treatment' },
      { status: 500 }
    )
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const id = req.nextUrl.searchParams.get('id')
    if (!id) {
      return NextResponse.json({ error: 'Missing treatment ID' }, { status: 400 })
    }

    await treatmentHistoryService.delete(id)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('DELETE /api/treatment-history error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to delete treatment' },
      { status: 500 }
    )
  }
}
