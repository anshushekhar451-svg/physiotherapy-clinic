# Physiotherapy Clinic Management System - Supabase Integration

A modern Next.js application for managing physiotherapy clinics with complete Supabase integration, including patient management, appointments, attendance tracking, payments, and treatment history.

## 🎯 Features

### Complete CRUD Operations
- **Patients**: Create, read, update, delete patient records with medical history
- **Appointments**: Schedule, manage, and track appointments
- **Attendance**: Track patient attendance and check-in/check-out times
- **Payments**: Record and manage patient payments
- **Treatment History**: Document patient treatment records

### Modern Architecture
- ✅ **Type-Safe**: Full TypeScript support with Supabase types
- ✅ **Reusable Services**: Centralized business logic in service layer
- ✅ **Next.js 14**: App Router with client and server components
- ✅ **Modern UI**: Tailwind CSS with Lucide React icons
- ✅ **Error Handling**: Comprehensive error handling and validation
- ✅ **Environment Variables**: Secure credential management

### Ready-to-Use Components
- `PatientForm` - Add and edit patients
- `AppointmentForm` - Schedule appointments
- `AttendanceForm` - Mark attendance
- `PaymentForm` - Record payments
- `TreatmentHistoryForm` - Document treatments
- `DeleteConfirmModal` - Confirmation dialogs

## 📁 Project Structure

```
src/
├── app/
│   ├── api/
│   │   ├── patients/
│   │   ├── appointments/
│   │   ├── attendance/
│   │   ├── payments/
│   │   └── treatment-history/
│   └── (pages)
├── services/
│   ├── patients.ts
│   ├── appointments.ts
│   ├── attendance.ts
│   ├── payments.ts
│   └── treatmentHistory.ts
├── components/
│   ├── PatientForm.tsx
│   ├── AppointmentForm.tsx
│   ├── AttendanceForm.tsx
│   ├── PaymentForm.tsx
│   ├── TreatmentHistoryForm.tsx
│   └── DeleteConfirmModal.tsx
├── lib/
│   ├── supabase.ts
│   └── typeUtils.ts
└── types/
    └── database.ts
```

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Supabase
Add your Supabase credentials to `.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:3000/api
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

### 3. Create Database Tables
See [SUPABASE_SETUP.md](./SUPABASE_SETUP.md) for detailed SQL setup instructions.

### 4. Run Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## 📚 Services API

All services provide CRUD operations with error handling:

### patientService
```typescript
await patientService.getAll()
await patientService.getById(id)
await patientService.search(query)
await patientService.create(data)
await patientService.update(id, updates)
await patientService.delete(id)
```

### appointmentService
```typescript
await appointmentService.getAll()
await appointmentService.getById(id)
await appointmentService.getByPatient(patientId)
await appointmentService.getUpcoming()
await appointmentService.create(data)
await appointmentService.update(id, updates)
await appointmentService.delete(id)
```

### attendanceService
```typescript
await attendanceService.getAll()
await attendanceService.getById(id)
await attendanceService.getByAppointment(appointmentId)
await attendanceService.create(data)
await attendanceService.update(id, updates)
await attendanceService.delete(id)
await attendanceService.markAttended(appointmentId, attended)
```

### paymentService
```typescript
await paymentService.getAll()
await paymentService.getById(id)
await paymentService.getByPatient(patientId)
await paymentService.getTotalByPatient(patientId)
await paymentService.getPendingPayments()
await paymentService.create(data)
await paymentService.update(id, updates)
await paymentService.delete(id)
```

### treatmentHistoryService
```typescript
await treatmentHistoryService.getAll()
await treatmentHistoryService.getById(id)
await treatmentHistoryService.getByPatient(patientId)
await treatmentHistoryService.getByAppointment(appointmentId)
await treatmentHistoryService.create(data)
await treatmentHistoryService.update(id, updates)
await treatmentHistoryService.delete(id)
```

## 🔌 API Endpoints

All endpoints available at `/api/{entity}`:

### Request Format
```javascript
// Create
POST /api/patients
{ name, email, phone, dob, address, medical_history }

// Read
GET /api/patients?id=<id>
GET /api/patients (all)
GET /api/patients?search=<query>

// Update
PUT /api/patients?id=<id>
{ updated fields }

// Delete
DELETE /api/patients?id=<id>
```

## 🎨 Using Components

### PatientForm Example
```tsx
'use client'
import PatientForm from '@/components/PatientForm'
import { useState } from 'react'

export default function AddPatientPage() {
  const [success, setSuccess] = useState(false)

  return (
    <PatientForm
      onSuccess={(patient) => {
        console.log('Patient added:', patient)
        setSuccess(true)
      }}
      onCancel={() => setSuccess(false)}
    />
  )
}
```

### PaymentForm Example
```tsx
'use client'
import PaymentForm from '@/components/PaymentForm'

export default function AddPaymentPage({ patientId }) {
  return (
    <PaymentForm
      patientId={patientId}
      onSuccess={(payment) => {
        // Handle success
      }}
    />
  )
}
```

## 📋 Database Schema

### Patients
- id (UUID, primary key)
- name (text, required)
- email (text, unique, required)
- phone (text, required)
- dob (date, required)
- address (text, required)
- medical_history (text, optional)
- created_at (timestamp)
- updated_at (timestamp)

### Appointments
- id (UUID, primary key)
- patient_id (UUID, foreign key)
- date (date, required)
- time (time, required)
- duration (integer, required)
- type (text, required)
- notes (text, optional)
- status (enum: scheduled/completed/cancelled)
- created_at (timestamp)
- updated_at (timestamp)

### Attendance
- id (UUID, primary key)
- appointment_id (UUID, foreign key, unique)
- attended (boolean)
- check_in (timestamp, optional)
- check_out (timestamp, optional)
- created_at (timestamp)
- updated_at (timestamp)

### Payments
- id (UUID, primary key)
- patient_id (UUID, foreign key)
- amount (numeric, required)
- date (date, required)
- method (enum: cash/card/check/upi)
- status (enum: pending/completed/failed)
- notes (text, optional)
- created_at (timestamp)
- updated_at (timestamp)

### Treatment History
- id (UUID, primary key)
- patient_id (UUID, foreign key)
- appointment_id (UUID, foreign key, optional)
- treatment_type (text, required)
- description (text, required)
- result (text, optional)
- created_at (timestamp)
- updated_at (timestamp)

## 🛡️ Security Notes

### Development
- RLS is disabled for development ease
- All tables are accessible

### Production Checklist
- ✅ Enable Row Level Security (RLS)
- ✅ Set up proper authorization policies
- ✅ Only expose public endpoints
- ✅ Use service role key on backend only
- ✅ Implement rate limiting
- ✅ Add audit logging

## 🐛 Troubleshooting

### "Failed to fetch data"
- Check .env.local credentials
- Verify Supabase project is active
- Ensure tables are created

### Type Errors
- Tables use TypeScript-first approach
- Check database schema matches types/database.ts
- Rebuild with `npm run build`

### CORS Issues
- Verify Supabase CORS settings
- Check API route is accessible
- Ensure frontend URL is whitelisted

## 📦 Dependencies

- **next**: ^14.0.0
- **react**: ^18.2.0
- **@supabase/supabase-js**: ^2.43.0
- **tailwindcss**: ^3.3.0
- **lucide-react**: ^0.294.0
- **date-fns**: ^2.30.0

## 📖 Documentation

- [Supabase Setup Guide](./SUPABASE_SETUP.md) - Detailed database configuration
- [Next.js Documentation](https://nextjs.org)
- [Supabase Documentation](https://supabase.com/docs)

## 🤝 Contributing

To add new features:
1. Create a new service in `src/services/`
2. Add API route in `src/app/api/`
3. Create form component in `src/components/`
4. Update database types in `src/types/database.ts`

## 📄 License

Private - Physiotherapy Clinic Management System

---

**Ready to use!** Update `.env.local` with your Supabase credentials and start managing your clinic.
