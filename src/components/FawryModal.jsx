
import { useState } from "react";

export default function FawryModal({ isOpen, onClose, referenceNumber }) {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(referenceNumber);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
      <div className="bg-gray-900 p-6 rounded-2xl w-[90%] max-w-md text-center shadow-xl">
        
        <h2 className="text-xl font-bold text-yellow-400 mb-3">
          💳 Fawry Payment
        </h2>

        <p className="text-gray-300 mb-4">
          استخدم الكود ده للدفع من أي ماكينة فوري:
        </p>

        <div className="bg-gray-800 p-4 rounded-lg text-2xl font-bold text-green-400 tracking-widest">
          {referenceNumber}
        </div>

        <button
          onClick={handleCopy}
          className="mt-3 bg-blue-600 px-4 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          {copied ? "Copied ✅" : "Copy Code"}
        </button>

        <p className="text-gray-400 text-sm mt-4">
          بعد الدفع، الكورس هيتفتح تلقائي ✅
        </p>

        <button
          onClick={onClose}
          className="mt-4 text-red-400 hover:underline"
        >
          Close
        </button>
      </div>
    </div>
  );
}
