# Supabase Integration Guide

## Overview
This guide helps you set up Supabase for the Physiotherapy Clinic Management System with complete CRUD operations for all entities.

## Prerequisites
- Supabase account (https://supabase.com)
- Project created in Supabase
- Node.js 18+ installed

## Step 1: Install Dependencies

```bash
npm install
```

This installs `@supabase/supabase-js` and other required packages.

## Step 2: Get Supabase Credentials

1. Go to https://supabase.com and sign in
2. Select your project
3. Go to **Settings** → **API** to get:
   - **Project URL** (NEXT_PUBLIC_SUPABASE_URL)
   - **anon key** (NEXT_PUBLIC_SUPABASE_ANON_KEY)
   - **service_role key** (SUPABASE_SERVICE_ROLE_KEY)

## Step 3: Update Environment Variables

Edit `.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:3000/api
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

## Step 4: Create Database Tables

Go to Supabase Dashboard → **SQL Editor** and execute the following SQL:

### Patients Table

```sql
CREATE TABLE patients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  phone TEXT NOT NULL,
  dob DATE NOT NULL,
  address TEXT NOT NULL,
  medical_history TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE INDEX idx_patients_email ON patients(email);
CREATE INDEX idx_patients_phone ON patients(phone);
```

### Appointments Table

```sql
CREATE TABLE appointments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  time TIME NOT NULL,
  duration INTEGER NOT NULL,
  type TEXT NOT NULL,
  notes TEXT,
  status TEXT DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'completed', 'cancelled')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE INDEX idx_appointments_patient_id ON appointments(patient_id);
CREATE INDEX idx_appointments_date ON appointments(date);
```

### Attendance Table

```sql
CREATE TABLE attendance (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  appointment_id UUID NOT NULL REFERENCES appointments(id) ON DELETE CASCADE UNIQUE,
  attended BOOLEAN DEFAULT FALSE,
  check_in TIMESTAMP WITH TIME ZONE,
  check_out TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE INDEX idx_attendance_appointment_id ON attendance(appointment_id);
```

### Payments Table

```sql
CREATE TABLE payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
  amount NUMERIC(10, 2) NOT NULL,
  date DATE NOT NULL,
  method TEXT NOT NULL CHECK (method IN ('cash', 'card', 'check', 'upi')),
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed')),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE INDEX idx_payments_patient_id ON payments(patient_id);
CREATE INDEX idx_payments_date ON payments(date);
CREATE INDEX idx_payments_status ON payments(status);
```

### Treatment History Table

```sql
CREATE TABLE treatment_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
  appointment_id UUID REFERENCES appointments(id) ON DELETE SET NULL,
  treatment_type TEXT NOT NULL,
  description TEXT NOT NULL,
  result TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE INDEX idx_treatment_history_patient_id ON treatment_history(patient_id);
CREATE INDEX idx_treatment_history_appointment_id ON treatment_history(appointment_id);
```

## Step 5: Enable Row Level Security (RLS)

For development, disable RLS on all tables or set up proper policies. To disable RLS:

1. Go to **Authentication** → **Policies**
2. For each table, disable RLS (or configure policies for production)

## Step 6: Verify Setup

1. Start the development server:
   ```bash
   npm run dev
   ```

2. Open `http://localhost:3000`

3. Navigate to the patients page and try:
   - Add a new patient
   - View patients list
   - Update a patient
   - Delete a patient

## API Endpoints

All endpoints use `/api/{entity}` with query parameters:

### Patients
- `GET /api/patients` - List all
- `GET /api/patients?id=<id>` - Get by ID
- `GET /api/patients?search=<query>` - Search
- `POST /api/patients` - Create
- `PUT /api/patients?id=<id>` - Update
- `DELETE /api/patients?id=<id>` - Delete

### Appointments
- `GET /api/appointments` - List all
- `GET /api/appointments?id=<id>` - Get by ID
- `GET /api/appointments?patientId=<id>` - Get by patient
- `GET /api/appointments?upcoming=true` - Get upcoming
- `POST /api/appointments` - Create
- `PUT /api/appointments?id=<id>` - Update
- `DELETE /api/appointments?id=<id>` - Delete

### Attendance
- `GET /api/attendance` - List all
- `GET /api/attendance?id=<id>` - Get by ID
- `GET /api/attendance?appointmentId=<id>` - Get by appointment
- `POST /api/attendance` - Create
- `PUT /api/attendance?id=<id>` - Update
- `DELETE /api/attendance?id=<id>` - Delete

### Payments
- `GET /api/payments` - List all
- `GET /api/payments?id=<id>` - Get by ID
- `GET /api/payments?patientId=<id>` - Get by patient
- `GET /api/payments?patientId=<id>&total=true` - Get total amount
- `GET /api/payments?pending=true` - Get pending payments
- `POST /api/payments` - Create
- `PUT /api/payments?id=<id>` - Update
- `DELETE /api/payments?id=<id>` - Delete

### Treatment History
- `GET /api/treatment-history` - List all
- `GET /api/treatment-history?id=<id>` - Get by ID
- `GET /api/treatment-history?patientId=<id>` - Get by patient
- `GET /api/treatment-history?appointmentId=<id>` - Get by appointment
- `POST /api/treatment-history` - Create
- `PUT /api/treatment-history?id=<id>` - Update
- `DELETE /api/treatment-history?id=<id>` - Delete

## Services

Reusable TypeScript services in `src/services/`:

- `patientService` - CRUD + search
- `appointmentService` - CRUD + patient appointments + upcoming
- `attendanceService` - CRUD + mark attended
- `paymentService` - CRUD + patient payments + pending payments
- `treatmentHistoryService` - CRUD + patient/appointment history

### Example Usage

```typescript
import { patientService } from '@/services/patients'

// Get all patients
const patients = await patientService.getAll()

// Get by ID
const patient = await patientService.getById('patient-id')

// Search
const results = await patientService.search('John')

// Create
const newPatient = await patientService.create({
  name: 'John Doe',
  email: 'john@example.com',
  phone: '+91-9999999999',
  dob: '1990-01-01',
  address: '123 Main St',
})

// Update
const updated = await patientService.update('patient-id', {
  name: 'Jane Doe',
})

// Delete
await patientService.delete('patient-id')
```

## Form Components

Ready-to-use components in `src/components/`:

- `PatientForm` - Add/Update patients
- `AppointmentForm` - Add/Update appointments
- `AttendanceForm` - Mark attendance
- `PaymentForm` - Add/Update payments
- `TreatmentHistoryForm` - Add/Update treatments
- `DeleteConfirmModal` - Confirmation dialogs

### Example Usage

```tsx
'use client'

import PatientForm from '@/components/PatientForm'
import { useState } from 'react'

export default function AddPatientPage() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div>
      {isOpen && (
        <PatientForm
          onSuccess={(patient) => {
            console.log('Patient added:', patient)
            setIsOpen(false)
          }}
          onCancel={() => setIsOpen(false)}
        />
      )}
    </div>
  )
}
```

## Testing

Try these test cases:

1. **Add Patient**: Create a new patient record
2. **List Patients**: Verify all patients appear
3. **Update Patient**: Edit a patient's information
4. **Delete Patient**: Remove a patient (cascade deletes appointments)
5. **Add Appointment**: Create an appointment for a patient
6. **Mark Attendance**: Mark a patient as attended
7. **Add Payment**: Record a payment for a patient
8. **Add Treatment**: Document treatment provided

## Troubleshooting

### "Missing Supabase environment variables"
- Verify `.env.local` has `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- Restart the dev server after updating `.env.local`

### "Permission denied" errors
- Check RLS policies or disable RLS for development
- Verify the anon key has appropriate permissions

### CORS errors
- Ensure Supabase project settings allow localhost
- Check API route implementations

### Data not showing
- Verify tables were created successfully
- Check browser console for errors
- Review API responses in Network tab

## Next Steps

1. Set up authentication using Supabase Auth
2. Configure Row Level Security (RLS) policies
3. Add backup and recovery procedures
4. Set up automated reports
5. Deploy to production

## Production Checklist

- [ ] Enable RLS with proper policies
- [ ] Use environment variables for all secrets
- [ ] Set up database backups
- [ ] Enable API rate limiting
- [ ] Configure CORS properly
- [ ] Set up monitoring and logging
- [ ] Test disaster recovery
- [ ] Use service role key only on backend
