// // src/components/NoLessonsUI.jsx
// import LessonCreator from "../pages/LessonCreator";

// export default function NoLessonsUI({ courseId, addLesson }) {
//   return (
//     <div className="min-h-screen flex flex-col items-center justify-center bg-gray-950 p-6">

//       <div className="mb-8">
//         <svg
//           className="w-48 h-48 text-blue-600"
//           xmlns="http://www.w3.org/2000/svg"
//           fill="none"
//           viewBox="0 0 24 24"
//           stroke="currentColor"
//         >
//           <path
//             strokeLinecap="round"
//             strokeLinejoin="round"
//             strokeWidth={1.5}
//             d="M12 4v16m8-8H4"
//           />
//         </svg>
//       </div>

//       <h1 className="text-3xl font-bold text-white mb-2 text-center">
//         No Lessons Yet
//       </h1>

//       <p className="text-gray-400 mb-6 text-center max-w-sm">
//         It looks like there are no lessons in this course. Start by adding your first lesson!
//       </p>

//       {/* 🔥 هنا التعديل المهم */}
//       <LessonCreator courseId={courseId} onCreate={{ addLesson }} />

//     </div>
//   );
// }





























// src/components/NoLessonsUI.jsx
import LessonCreator from "../pages/LessonCreator";

export default function NoLessonsUI({ courseId, addLesson }) {
  return (
    <div
      className="
        min-h-[70vh] flex items-center justify-center px-6 py-12
        bg-gray-50 dark:bg-gray-950
        transition-colors duration-300
      "
    >
      <div
        className="
          w-full max-w-xl
          rounded-3xl
          border border-gray-200 dark:border-gray-800
          bg-white dark:bg-gray-900
          shadow-xl shadow-gray-200/40 dark:shadow-black/20
          p-8 md:p-10
          text-center
          animate-fadeIn
        "
      >
        {/* Icon */}
        <div className="flex justify-center mb-6">
          <div
            className="
              w-24 h-24 md:w-28 md:h-28
              rounded-3xl
              flex items-center justify-center
              bg-blue-50 dark:bg-blue-500/10
              border border-blue-100 dark:border-blue-500/20
              shadow-sm
            "
          >
            <svg
              className="w-12 h-12 md:w-14 md:h-14 text-blue-600 dark:text-blue-400"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.8}
                d="M12 4v16m8-8H4"
              />
            </svg>
          </div>
        </div>

        {/* Title */}
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-gray-100 tracking-tight">
          No Lessons Yet
        </h1>

        {/* Description */}
        <p className="mt-3 mb-8 text-sm md:text-base leading-relaxed text-gray-500 dark:text-gray-400 max-w-md mx-auto">
          It looks like this course does not have any lessons yet. Start building
          your content by adding the first lesson now.
        </p>

        {/* Action Area */}
        <div
          className="
            rounded-2xl
            bg-gray-50 dark:bg-gray-800/50
            border border-gray-200 dark:border-gray-700
            p-4 md:p-5
          "
        >
          <LessonCreator courseId={courseId} onCreate={{ addLesson }} />
        </div>
      </div>
    </div>
  );
}