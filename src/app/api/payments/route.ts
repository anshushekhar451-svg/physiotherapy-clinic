import { NextRequest, NextResponse } from 'next/server'
import { paymentService } from '@/services/payments'

export async function GET(req: NextRequest) {
  try {
    const id = req.nextUrl.searchParams.get('id')
    const patientId = req.nextUrl.searchParams.get('patientId')
    const pending = req.nextUrl.searchParams.get('pending')
    const total = req.nextUrl.searchParams.get('total')

    if (id) {
      const payment = await paymentService.getById(id)
      return NextResponse.json(payment)
    }

    if (patientId && total) {
      const totalAmount = await paymentService.getTotalByPatient(patientId)
      return NextResponse.json({ total: totalAmount })
    }

    if (patientId) {
      const payments = await paymentService.getByPatient(patientId)
      return NextResponse.json(payments)
    }

    if (pending) {
      const payments = await paymentService.getPendingPayments()
      return NextResponse.json(payments)
    }

    const payments = await paymentService.getAll()
    return NextResponse.json(payments)
  } catch (error) {
    console.error('GET /api/payments error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to fetch payments' },
      { status: 500 }
    )
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const payment = await paymentService.create(body)
    return NextResponse.json(payment, { status: 201 })
  } catch (error) {
    console.error('POST /api/payments error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to create payment' },
      { status: 500 }
    )
  }
}

export async function PUT(req: NextRequest) {
  try {
    const id = req.nextUrl.searchParams.get('id')
    if (!id) {
      return NextResponse.json({ error: 'Missing payment ID' }, { status: 400 })
    }

    const body = await req.json()
    const payment = await paymentService.update(id, body)
    return NextResponse.json(payment)
  } catch (error) {
    console.error('PUT /api/payments error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to update payment' },
      { status: 500 }
    )
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const id = req.nextUrl.searchParams.get('id')
    if (!id) {
      return NextResponse.json({ error: 'Missing payment ID' }, { status: 400 })
    }

    await paymentService.delete(id)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('DELETE /api/payments error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to delete payment' },
      { status: 500 }
    )
  }
}
