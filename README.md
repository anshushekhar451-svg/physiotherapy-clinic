# Physiotherapy Clinic Management System

A professional, responsive web application for managing physiotherapy clinic operations.

## Features

✅ **Authentication** - Secure login system
✅ **Patient Management** - Complete patient records and profiles
✅ **Appointment Tracking** - Schedule and manage appointments
✅ **Attendance Management** - Track patient attendance with statistics
✅ **Billing System** - Invoice generation and payment tracking
✅ **Modern Dashboard** - Real-time analytics and charts
✅ **Responsive Design** - Works on desktop, tablet, and mobile

## Tech Stack

- **Frontend**: Next.js 14, React 18, Tailwind CSS
- **Charts**: Recharts
- **Icons**: Lucide React
- **Storage**: Browser LocalStorage

## Installation

```bash
npm install
```

## Running the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Building for Production

```bash
npm run build
npm start
```

## Login Credentials

- **Email**: Any email (demo mode)
- **Password**: Any password (demo mode)

## Project Structure

```
src/
├── app/
│   ├── page.jsx              # Login page
│   ├── layout.jsx            # Root layout
│   ├── globals.css           # Global styles
│   ├── dashboard/
│   │   └── page.jsx          # Dashboard with analytics
│   ├── patients/
│   │   └── page.jsx          # Patient management
│   ├── appointments/
│   │   └── page.jsx          # Appointment scheduling
│   ├── attendance/
│   │   └── page.jsx          # Attendance tracking
│   └── billing/
│       └── page.jsx          # Billing system
├── components/
│   ├── Sidebar.jsx           # Navigation sidebar
│   └── Header.jsx            # Page header
└── lib/
    └── api.js                # API utilities
```

## Features In Detail

### Dashboard
- Patient statistics and trends
- Appointment overview
- Revenue tracking
- Performance metrics

### Patient Management
- Add/edit/delete patient records
- Store medical conditions
- Contact information
- Join date tracking

### Appointment Scheduling
- Schedule new appointments
- Set appointment type (Initial, Follow-up, Assessment, Treatment)
- Track appointment status
- Search and filter appointments

### Attendance Management
- Mark patient attendance
- Track attendance statistics
- Attendance rate calculation
- Attendance history

### Billing System
- Create invoices
- Track payment status
- View pending and overdue invoices
- Revenue analytics

## Data Storage

All data is stored in the browser's LocalStorage, making it suitable for:
- Prototyping and testing
- Demo environments
- Development

For production use, integrate with a backend database.

## Customization

The color scheme uses a primary blue color (#0ea5e9). To change it:

1. Edit `tailwind.config.js` - Update the primary color values
2. The colors will automatically apply throughout the application

## License

MIT License - Free to use and modify
