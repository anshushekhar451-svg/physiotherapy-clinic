import { supabase } from '../lib/supabaseClient'; 

// 1. डेटाबेस से अटेंडेंस खींचने का रास्ता
export async function getPatientAttendance(patientId) {
  const { data, error } = await supabase
    .from('attendance')
    .select('*')
    .eq('patient_id', patientId);

  if (error) {
    console.error('अटेंडेंस लाने में एरर आया:', error);
    return [];
  }
  return data;
}

// 2. बटन दबाने पर डेटाबेस में प्रेजेंट/एब्सेंट सेव करने का रास्ता
export async function markAttendance(patientId, dateString, status) {
  const { data, error } = await supabase
    .from('attendance')
    .upsert({
      patient_id: patientId,
      date: dateString, 
      status: status    // यहाँ 'Present' या 'Absent' सेव होगा
    }, { onConflict: 'patient_id,date' });

  if (error) {
    console.error('अटेंडेंस सेव करने में एरर आया:', error);
    return false;
  }
  return true;
}