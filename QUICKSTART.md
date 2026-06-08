# Quick Start Guide - Physiotherapy Clinic Management System

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation Steps

1. **Navigate to Project Directory**
   ```bash
   cd "C:\Users\Angik\Downloads\attendene status"
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```
   This will install:
   - Next.js 14
   - React 18
   - Tailwind CSS
   - Recharts (for charts)
   - Lucide React (for icons)

3. **Start Development Server**
   ```bash
   npm run dev
   ```
   The application will start at `http://localhost:3000`

4. **Build for Production**
   ```bash
   npm run build
   npm start
   ```

## 🔐 Login

- **URL**: http://localhost:3000
- **Email**: Use any email address (demo mode)
- **Password**: Use any password (demo mode)
- **Click**: "Sign In" button

## 📋 Available Modules

### 1. Dashboard
- Real-time statistics
- Patient trends chart
- Revenue analytics
- Performance metrics
- Recent appointments

### 2. Patient Management
- ➕ Add new patients
- ✏️ Edit patient details
- 🗑️ Delete patient records
- 🔍 Search patients
- Fields: Name, Email, Phone, Age, Gender, Condition, Address, Join Date

### 3. Appointment Tracking
- 📅 Schedule appointments
- 👥 Assign therapists
- 📝 Add appointment notes
- 🔄 Update appointment status
- Types: Initial, Follow-up, Assessment, Treatment
- Statuses: Scheduled, Completed, Cancelled, No Show

### 4. Attendance Management
- ✅ Mark attendance (Present, Absent, Late, Excused)
- 📊 View attendance statistics
- 📈 Calculate attendance rate
- 📝 Add remarks

### 5. Billing System
- 💳 Create invoices
- 💰 Track payment status
- 📊 View billing statistics
- 📋 Manage invoice history
- Statuses: Pending, Paid, Overdue, Cancelled

## 🎨 Features

✅ **Responsive Design** - Works on desktop, tablet, and mobile
✅ **Modern UI** - Clean, professional interface with Tailwind CSS
✅ **Interactive Charts** - Recharts for data visualization
✅ **Form Validation** - Client-side validation
✅ **Local Storage** - Data persists in browser
✅ **Navigation Sidebar** - Easy module access
✅ **Color-Coded Status** - Quick visual identification
✅ **Search & Filter** - Find data quickly

## 📱 Responsive Breakpoints

- **Mobile**: Works on all screen sizes
- **Tablet**: Optimized for tablets (768px+)
- **Desktop**: Full-featured at 1024px+

## 🗂️ File Structure

```
project/
├── src/
│   ├── app/
│   │   ├── page.jsx              # Login page
│   │   ├── layout.jsx            # Root layout
│   │   ├── globals.css           # Global styles
│   │   ├── dashboard/
│   │   │   ├── page.jsx
│   │   │   └── layout.jsx
│   │   ├── patients/
│   │   │   ├── page.jsx
│   │   │   └── layout.jsx
│   │   ├── appointments/
│   │   │   ├── page.jsx
│   │   │   └── layout.jsx
│   │   ├── attendance/
│   │   │   ├── page.jsx
│   │   │   └── layout.jsx
│   │   └── billing/
│   │       ├── page.jsx
│   │       └── layout.jsx
│   ├── components/
│   │   ├── Sidebar.jsx           # Navigation menu
│   │   └── Header.jsx            # Page header
│   └── lib/
│       └── api.js                # API utilities
├── public/                        # Static files
├── package.json
├── tailwind.config.js
├── postcss.config.js
├── next.config.js
├── tsconfig.json
├── .eslintrc.json
├── .gitignore
├── README.md
└── PLAN.md
```

## 🎯 Demo Data

The system comes with sample data:
- 3 sample patients
- 2 sample appointments
- 3 sample attendance records
- 2 sample invoices

All data is stored in browser localStorage and can be deleted via browser dev tools.

## 🛠️ Development

### Available Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm start        # Start production server
npm run lint     # Run ESLint
```

### Technologies Used

- **Framework**: Next.js 14 (App Router)
- **UI Library**: React 18
- **Styling**: Tailwind CSS 3.3
- **Charts**: Recharts 2.10
- **Icons**: Lucide React 0.294
- **HTTP**: Axios 1.6
- **Utilities**: date-fns 2.30

## 🔧 Customization

### Change Primary Color

Edit `tailwind.config.js`:
```javascript
colors: {
  primary: {
    50: '#f0f9ff',
    500: '#YOUR_COLOR_HEX',
    600: '#DARKER_SHADE',
    700: '#DARKEST_SHADE',
  },
}
```

### Clinic Name

Change in any page by editing:
```javascript
localStorage.setItem('clinicName', 'Your Clinic Name')
```

## 💾 Data Persistence

All data is stored in browser localStorage:
- `patients` - Patient records
- `appointments` - Scheduled appointments
- `attendance` - Attendance records
- `invoices` - Invoice data

## 🔒 Security Notes

Current implementation:
- Demo authentication (no server validation)
- Client-side validation only
- No encrypted data storage

For production:
- Implement JWT authentication
- Add server-side validation
- Use secure database
- Enable HTTPS
- Add role-based access control

## 📞 Support

For issues or questions:
1. Check the README.md
2. Review the PLAN.md for architecture details
3. Inspect browser console for errors

## 🚀 Next Steps for Production

1. Replace localStorage with database
2. Implement real authentication
3. Add backend API endpoints
4. Implement payment gateway
5. Add email/SMS notifications
6. Generate PDF invoices
7. Add user roles and permissions
8. Set up automated backups
9. Add audit logging
10. Implement data encryption

Enjoy using PhysioClinic! 🎉
