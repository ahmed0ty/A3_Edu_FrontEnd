

// export default function NoLessonsUI({ courseId, onCreate }) {
//   return (
//     <div className="flex flex-col items-center justify-center text-center py-20 px-6">
//       {/* Icon */}
//       <div className="text-6xl mb-4 animate-bounce">📚</div>

//       {/* Title */}
//       <h2 className="text-2xl font-bold mb-2 text-gray-200">
//         No Lessons Yet
//       </h2>

//       {/* Description */}
//       <p className="text-gray-400 mb-6 max-w-md">
//         This course doesn’t have any lessons yet. Start adding your first lesson
//         to begin learning.
//       </p>

//       {/* Actions */}
//       <div className="flex gap-3">
//         {/* لو Instructor */}
//         <button
//           onClick={() => onCreate?.({ })}
//           className="bg-green-600 hover:bg-green-700 px-5 py-2 rounded-lg font-semibold transition"
//         >
//           ➕ Add First Lesson
//         </button>

//         {/* Optional: Back */}
//         <button
//           onClick={() => window.history.back()}
//           className="bg-gray-700 hover:bg-gray-600 px-5 py-2 rounded-lg transition"
//         >
//           ← Go Back
//         </button>
//       </div>
//     </div>
//   );
// }

























export default function NoLessonsUI({ courseId, onCreate }) {
  return (
    <div
      className="
        flex items-center justify-center
        px-6 py-16 md:py-24
        bg-transparent
        transition-colors duration-300
      "
    >
      <div
        className="
          w-full max-w-2xl
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
            "
          >
            <span className="text-5xl md:text-6xl animate-bounce">📚</span>
          </div>
        </div>

        {/* Title */}
        <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100">
          No Lessons Yet
        </h2>

        {/* Description */}
        <p className="mt-3 mb-8 max-w-md mx-auto text-sm md:text-base leading-relaxed text-gray-500 dark:text-gray-400">
          This course does not have any lessons yet. Start by adding your first
          lesson and begin building the learning experience.
        </p>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={() => onCreate?.({ courseId })}
            className="
              w-full sm:w-auto
              inline-flex items-center justify-center gap-2
              px-5 py-3 rounded-2xl
              bg-emerald-600 hover:bg-emerald-500
              text-white font-semibold text-sm
              shadow-md hover:shadow-emerald-500/25
              transition-all duration-200 hover:scale-[1.02]
            "
          >
            <span>➕</span>
            Add First Lesson
          </button>

          <button
            onClick={() => window.history.back()}
            className="
              w-full sm:w-auto
              inline-flex items-center justify-center gap-2
              px-5 py-3 rounded-2xl
              bg-gray-100 hover:bg-gray-200
              dark:bg-gray-800 dark:hover:bg-gray-700
              text-gray-700 dark:text-gray-200
              font-medium text-sm
              border border-gray-200 dark:border-gray-700
              transition-all duration-200
            "
          >
            <span>←</span>
            Go Back
          </button>
        </div>
      </div>
    </div>
  );
}