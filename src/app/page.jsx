import Link from 'next/link';

// आपके रिटर्न (return) के अंदर जहाँ बाकी बटन हैं, वहाँ इसे पेस्ट कर दें:
<div className="text-center mt-8">
  <Link href="/attendance">
    <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg shadow-lg transition-all">
      📅 पेशेंट अटेंडेंस कैलेंडर खोलें
    </button>
  </Link>
</div>