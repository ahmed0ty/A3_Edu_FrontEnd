// import { useState } from "react";
// import LessonCreator from "../pages/LessonCreator";

// export default function AddLessonModal({ courseId, addLesson }) {
//   const [open, setOpen] = useState(false);

//   return (
//     <>
//       {/* زر إنشاء درس */}
//       <button
//         onClick={() => setOpen(true)}
//         className="mb-4 px-4 py-2 rounded bg-blue-600 hover:bg-blue-700 transition text-white"
//       >
//         + Add Lesson
//       </button>

//       {/* Modal overlay */}
//       {open && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
//           <div className="bg-gray-950 p-6 rounded-xl shadow-xl w-full max-w-md relative">
//             {/* زر إغلاق */}
//             <button
//               onClick={() => setOpen(false)}
//               className="absolute top-3 right-3 text-gray-400 hover:text-white"
//             >
//               ✕
//             </button>

//             {/* Lesson Creator */}
//             <LessonCreator
//               courseId={courseId}
//               onCreate={{
//                 addLesson: (lesson) => {
//                   addLesson(lesson);
//                   setOpen(false); // تغلق الـ modal بعد الإنشاء
//                 },
//               }}
//             />
//           </div>
//         </div>
//       )}
//     </>
//   );
// }

import { useState } from "react";
import LessonCreator from "../pages/LessonCreator";

export default function AddLessonModal({ courseId, addLesson }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* زرار Add Lesson */}
      <button
        onClick={() => setOpen(true)}
        className="
          flex items-center gap-2 px-4 py-2 rounded-xl
          bg-blue-600 hover:bg-blue-500
          dark:bg-blue-600 dark:hover:bg-blue-500
          text-white text-sm font-medium
          transition-all duration-200 shadow-md hover:shadow-blue-500/30
        "
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
        Add Lesson
      </button>

      {/* Modal */}
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="
            bg-white dark:bg-gray-900
            border border-gray-200 dark:border-gray-700
            rounded-2xl shadow-2xl
            w-full max-w-md mx-4
            relative animate-fadeIn
          ">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-gray-800">
              <h2 className="text-base font-semibold text-gray-800 dark:text-gray-100">
                New Lesson
              </h2>
              <button
                onClick={() => setOpen(false)}
                className="
                  w-8 h-8 flex items-center justify-center rounded-lg
                  text-gray-400 hover:text-gray-600
                  dark:text-gray-500 dark:hover:text-gray-200
                  hover:bg-gray-100 dark:hover:bg-gray-800
                  transition-all duration-150
                "
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Content */}
            <div className="px-6 py-5">
              <LessonCreator
                courseId={courseId}
                onCreate={{
                  addLesson: (lesson) => {
                    addLesson(lesson);
                    setOpen(false);
                  },
                }}
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}