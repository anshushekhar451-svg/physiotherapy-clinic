import { NextRequest, NextResponse } from 'next/server'
import { patientService } from '@/services/patients'

export async function GET(req: NextRequest) {
  try {
    const id = req.nextUrl.searchParams.get('id')
    const search = req.nextUrl.searchParams.get('search')

    if (id) {
      const patient = await patientService.getById(id)
      return NextResponse.json(patient)
    }

    if (search) {
      const results = await patientService.search(search)
      return NextResponse.json(results)
    }

    const patients = await patientService.getAll()
    return NextResponse.json(patients)
  } catch (error) {
    console.error('GET /api/patients error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to fetch patients' },
      { status: 500 }
    )
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const patient = await patientService.create(body)
    return NextResponse.json(patient, { status: 201 })
  } catch (error) {
    console.error('POST /api/patients error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to create patient' },
      { status: 500 }
    )
  }
}

export async function PUT(req: NextRequest) {
  try {
    const id = req.nextUrl.searchParams.get('id')
    if (!id) {
      return NextResponse.json({ error: 'Missing patient ID' }, { status: 400 })
    }

    const body = await req.json()
    const patient = await patientService.update(id, body)
    return NextResponse.json(patient)
  } catch (error) {
    console.error('PUT /api/patients error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to update patient' },
      { status: 500 }
    )
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const id = req.nextUrl.searchParams.get('id')
    if (!id) {
      return NextResponse.json({ error: 'Missing patient ID' }, { status: 400 })
    }

    await patientService.delete(id)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('DELETE /api/patients error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to delete patient' },
      { status: 500 }
    )
  }
}
