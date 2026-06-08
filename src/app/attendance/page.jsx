'use client';
import { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css'; // कैलेंडर का बेसिक लुक
import { getPatientAttendance, markAttendance } from '../../services/attendanceService';

export default function AttendancePage() {
  // यहाँ डेमो के लिए हम मान लेते हैं कि अभी हम पहले पेशेंट की अटेंडेंस देख रहे हैं
  // (बाद में आप इसे ड्रॉपडाउन से भी बदल सकते हैं)
  const patientId = "dummy-patient-id-123"; 
  
  const [attendanceData, setAttendanceData] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());

  // 1. पेज खुलते ही सुपबेस से पुराना डेटा लाना
  useEffect(() => {
    async function loadAttendance() {
      const data = await getPatientAttendance(patientId);
      setAttendanceData(data);
    }
    loadAttendance();
  }, []);

  // तारीख को 'YYYY-MM-DD' फॉर्मेट में बदलने का टूल
  const formatDate = (date) => {
    const offset = date.getTimezoneOffset();
    const localDate = new Date(date.getTime() - (offset * 60 * 1000));
    return localDate.toISOString().split('T')[0];
  };

  // 2. बटन दबाने पर अटेंडेंस मार्क करना
  const handleMark = async (status) => {
    const dateStr = formatDate(selectedDate);
    const success = await markAttendance(patientId, dateStr, status);
    
    if (success) {
      alert(`तारीख ${dateStr} को ${status} मार्क कर दिया गया है!`);
      // स्क्रीन पर तुरंत अपडेट दिखाने के लिए स्टेट बदलना
      setAttendanceData(prev => {
        const filtered = prev.filter(item => item.date !== dateStr);
        return [...filtered, { date: dateStr, status }];
      });
    } else {
      alert("अटेंडेंस सेव नहीं हो पाई, दोबारा कोशिश करें।");
    }
  };

  // 3. कैलेंडर के खानों को हरा या लाल रंग देना
  const tileClassName = ({ date, view }) => {
    if (view === 'month') {
      const dateStr = formatDate(date);
      const record = attendanceData.find(item => item.date === dateStr);
      if (record?.status === 'Present') return 'bg-green-500 text-white font-bold rounded-full';
      if (record?.status === 'Absent') return 'bg-red-500 text-white font-bold rounded-full';
    }
    return null;
  };

  // टोटल हाज़िरी और छुट्टी की गिनती
  const totalPresent = attendanceData.filter(item => item.status === 'Present').length;
  const totalAbsent = attendanceData.filter(item => item.status === 'Absent').length;

  return (
    <div className="p-8 max-w-4xl mx-auto bg-gray-50 min-h-screen rounded-xl shadow-md">
      <h1 className="text-3xl font-bold text-center text-blue-700 mb-8">🩺 पेशेंट अटेंडेंस ट्रैकर</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* बायाँ बॉक्स: कैलेंडर और बटन */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 flex flex-col items-center">
          <Calendar 
            onChange={setSelectedDate} 
            value={selectedDate} 
            tileClassName={tileClassName}
          />
          
          <div className="mt-6 flex gap-4 w-full justify-center">
            <button 
              onClick={() => handleMark('Present')}
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-2.5 rounded-lg font-bold shadow-md transition-all"
            >
              ✅ Present (हाज़िर)
            </button>
            <button 
              onClick={() => handleMark('Absent')}
              className="bg-red-600 hover:bg-red-700 text-white px-6 py-2.5 rounded-lg font-bold shadow-md transition-all"
            >
              ❌ Absent (गैरहाज़िर)
            </button>
          </div>
        </div>

        {/* दायाँ बॉक्स: लाइव स्कोरकार्ड */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 flex flex-col justify-between">
          <div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">📊 हाज़िरी का पूरा विवरण</h3>
            <p className="text-gray-500">चुनी हुई तारीख: <span className="font-semibold text-blue-600">{formatDate(selectedDate)}</span></p>
          </div>

          <div className="grid grid-cols-2 gap-4 my-6">
            <div className="bg-green-50 p-4 rounded-xl text-center border border-green-100">
              <p className="text-sm text-green-700 font-medium">कुल उपस्थित दिन</p>
              <p className="text-4xl font-extrabold text-green-600 mt-1">{totalPresent}</p>
            </div>
            <div className="bg-red-50 p-4 rounded-xl text-center border border-red-100">
              <p className="text-sm text-red-700 font-medium">कुल अनुपस्थित दिन</p>
              <p className="text-4xl font-extrabold text-red-600 mt-1">{totalAbsent}</p>
            </div>
          </div>

          <div className="bg-blue-50 p-4 rounded-lg text-sm text-blue-800">
            💡 **टिप:** कैलेंडर में किसी भी पुरानी या आज की तारीख पर क्लिक करके सीधे उसका स्टेटस बदल सकते हैं।
          </div>
        </div>
      </div>
    </div>
  );
}