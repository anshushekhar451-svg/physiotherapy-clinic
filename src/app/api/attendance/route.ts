import { NextRequest, NextResponse } from 'next/server'
import { attendanceService } from '@/services/attendance'

export async function GET(req: NextRequest) {
  try {
    const id = req.nextUrl.searchParams.get('id')
    const appointmentId = req.nextUrl.searchParams.get('appointmentId')

    if (id) {
      const attendance = await attendanceService.getById(id)
      return NextResponse.json(attendance)
    }

    if (appointmentId) {
      const attendance = await attendanceService.getByAppointment(appointmentId)
      return NextResponse.json(attendance)
    }

    const records = await attendanceService.getAll()
    return NextResponse.json(records)
  } catch (error) {
    console.error('GET /api/attendance error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to fetch attendance' },
      { status: 500 }
    )
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const attendance = await attendanceService.create(body)
    return NextResponse.json(attendance, { status: 201 })
  } catch (error) {
    console.error('POST /api/attendance error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to create attendance' },
      { status: 500 }
    )
  }
}

export async function PUT(req: NextRequest) {
  try {
    const id = req.nextUrl.searchParams.get('id')
    if (!id) {
      return NextResponse.json({ error: 'Missing attendance ID' }, { status: 400 })
    }

    const body = await req.json()
    const attendance = await attendanceService.update(id, body)
    return NextResponse.json(attendance)
  } catch (error) {
    console.error('PUT /api/attendance error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to update attendance' },
      { status: 500 }
    )
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const id = req.nextUrl.searchParams.get('id')
    if (!id) {
      return NextResponse.json({ error: 'Missing attendance ID' }, { status: 400 })
    }

    await attendanceService.delete(id)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('DELETE /api/attendance error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to delete attendance' },
      { status: 500 }
    )
  }
}
