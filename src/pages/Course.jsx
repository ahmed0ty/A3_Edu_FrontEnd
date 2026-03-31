// import { useState, useEffect } from "react";
// import { useParams } from "react-router-dom";
// import LessonCreator from "./LessonCreator";
// import NoLessonsUI from "../components/NoLessonsUI";
// import AddLessonModal from "../components/AddLessonModal";
// import LessonComments from "../components/LessonComments";
// import api from "../api/axios"
// // ================= PDF FIX =================
// const convertPdfUrl = (url) => {
//   if (!url) return "";

//   let fixedUrl = url;

//   if (url.includes("/image/upload/")) {
//     fixedUrl = url.replace("/image/upload/", "/raw/upload/");
//   }

//   return fixedUrl.includes("?")
//     ? `${fixedUrl}&fl_attachment=false`
//     : `${fixedUrl}?fl_attachment=false`;
// };

// export default function Course() {
//   const { id } = useParams();
//   console.log("Opening course ID:", id);

//   const [course, setCourse] = useState(null);
//   const [lessons, setLessons] = useState([]);
//   const [selected, setSelected] = useState(0);
//   const [loading, setLoading] = useState(true);
//   const [enrolled, setEnrolled] = useState(course?.enrollment?.status === "enrolled");
//   const [enrollLoading, setEnrollLoading] = useState(false);
// const [lessonDeletedId, setLessonDeletedId] = useState(null);




// const user = JSON.parse(localStorage.getItem("user"));

  
//   const isOwner =
//   user &&
//   course?.instructor &&
//   String(
//     typeof course.instructor === "object"
//       ? course.instructor._id
//       : course.instructor
//   ) === String(user._id);
// console.log("COURSE:", course);
//   console.log("IS OWNER:", isOwner);
//   // console.log("USER:", user);

// // {isOwner ? (
// //   <LessonCreator
// //     courseId={course._id}
// //     onCreate={{
// //       addLesson: (lesson) =>
// //         setLessons((prev) => [...prev, lesson]),
// //     }}
// //   />
// // ) : lessons.length > 0 ? (
// //   <div className="space-y-3">
// //     {lessons.map((lesson, i) => (
// //       <div key={lesson._id}>{lesson.title}</div>
// //     ))}
// //   </div>
// // ) : (
// //   <NoLessonsUI />
// // )}

//   // ================= FETCH DATA =================
//   useEffect(() => {
//   if (!id) return;

//   const fetchData = async () => {
//     try {
//       // ================= COURSE =================
//       const courseRes = await api.get(`/courses/${id}`);

//       console.log("Course Response:", courseRes.data);

//       setCourse(courseRes.data?.data);

//       // ================= LESSONS =================
//       const lessonsRes = await api.get(`/lessons/course/${id}`);

//       console.log("🔥 Lessons API Response:", lessonsRes.data);
//       console.log(
//         "🔥 Lessons Data Type:",
//         typeof lessonsRes.data?.data
//       );

//       setLessons(lessonsRes.data?.data || []);

//       console.log(
//         "📚 Lessons in state:",
//         lessonsRes.data?.data
//       );

//     } catch (err) {
//       console.error(err?.response?.data?.message || err.message);

//       setCourse(null);
//       setLessons([]);

//       if (err.response?.status === 401) {
//         // axios interceptor هيحاول يعمل refresh تلقائي
//         // لو فشل هيرجعك login
//         console.log("Unauthorized - trying refresh...");
//       }
//     } finally {
//       setLoading(false);
//     }
//   };

//   fetchData();
// }, [id]);
//   // ================= COMPLETE =================
// const completeLesson = async (lessonId) => {
//   try {
//     await api.patch(`/lessons/${lessonId}/complete`);

//     setLessons((prev) =>
//       prev.map((l) =>
//         l._id === lessonId ? { ...l, completed: true } : l
//       )
//     );
//   } catch (err) {
//     console.error(err?.response?.data?.message || err.message);
//   }
// };
//   // ================= DELETE =================
//  const deleteLesson = async (lessonId) => {
//   try {
//  await api.delete(`/lessons/${lessonId}`);
//  setLessonDeletedId(lessonId);


//     setLessons((prev) => {
//       const updatedLessons = prev.filter((l) => l._id !== lessonId);

//       // 👇 لو الدرس الحالي اتحذف
//       if (currentLesson?._id === lessonId) {
//         setSelected(0);
//       } else {
//         // 👇 لو السيليكت بقى خارج الرينج
//         if (selected >= updatedLessons.length) {
//           setSelected(Math.max(updatedLessons.length - 1, 0));
//         }
//       }

//       return updatedLessons;
//     });

//   } catch (err) {
//      console.error(err?.response?.data?.message || err.message);
//      if (err.response?.status === 401) {
//       console.log("Unauthorized - trying refresh...");
//     }
//   }
// };
//   if (loading)
//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gray-950">
//       <div className="flex flex-col items-center gap-4">
        
//         {/* Spinner */}
//         <div className="w-14 h-14 border-4 border-gray-700 border-t-blue-500 rounded-full animate-spin"></div>

//         {/* Text */}
//         <p className="text-gray-400 text-sm tracking-wide">
//           Loading course...
//         </p>
//       </div>
//     </div>
//   );
//   if (!course)
//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gray-950 text-white p-6">
//       <div className="max-w-md w-full text-center bg-gray-900/60 backdrop-blur-md border border-gray-800 rounded-2xl p-10 shadow-xl">
        
//         {/* Icon */}
//         <div className="text-7xl mb-5">
//           ❌
//         </div>

//         {/* Title */}
//         <h2 className="text-2xl font-bold mb-3">
//           Course Not Found
//         </h2>

//         {/* Description */}
//         <p className="text-gray-400 mb-6 leading-relaxed">
//           The course you're looking for doesn't exist or may have been removed.
//         </p>

//         {/* Button (optional) */}
//         <button
//           onClick={() => window.history.back()}
//           className="px-5 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition"
//         >
//           Go Back
//         </button>

//         {/* Decorative Line */}
//         <div className="w-24 h-1 mx-auto mt-6 bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 rounded-full"></div>
//       </div>
//     </div>
//   );

// if (!lessons.length) {
//   return (
//     <div className="min-h-screen flex flex-col items-center justify-center bg-gray-950 text-white p-6 gap-6">

//       {/* 🔥 يظهر بس لصاحب الكورس */}
//       {isOwner && (
//         <NoLessonsUI
//           courseId={course._id}
//           addLesson={(lesson) => setLessons([lesson])}
//         />
//       )}

// {!isOwner && (
//   <div className="max-w-md w-full text-center bg-gray-900/60 backdrop-blur-md border border-gray-800 rounded-2xl p-10 shadow-xl">
    
//     {/* Icon */}
//     <div className="text-7xl mb-5 animate-bounce">
//       📚
//     </div>

//     {/* Title */}
//     <h2 className="text-2xl font-bold mb-3">
//       No Lessons Available
//     </h2>

//     {/* Description */}
//     <p className="text-gray-400 mb-6 leading-relaxed">
//       This course doesn’t have any lessons yet.
//     </p>

//     {/* Decorative Line */}
//     <div className="w-24 h-1 mx-auto bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 rounded-full"></div>

//   </div>
// )}
//     </div>
//   );
// }

//   const currentLesson = lessons[selected];
//  console.log("🎯 currentLesson:", currentLesson);
// console.log("🎬 video url:", currentLesson?.content);

//   // ================= RENDER CONTENT =================
//   const renderContent = () => {
//     if (!currentLesson) return null;

//     switch (currentLesson.type) {
//       case "video":
//         return (
//          <video
//   controls
//   crossOrigin="anonymous"
//   preload="metadata"
//   className="w-full h-full rounded-xl"
// >
//   <source src={currentLesson.content} type="video/mp4" />
// </video>
//         );

//       case "pdf":
//         return (
//           <iframe
//             src={`https://docs.google.com/gview?url=${currentLesson.content}&embedded=true`}
//             className="w-full h-full rounded-xl"
//           />
//         );

//       default:
//         return <div>No content</div>;
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gray-950 text-white p-6">
//       {/* 🎓 زر إضافة درس (للمدرسين فقط) */}
//       {isOwner && (
//         <AddLessonModal
//           courseId={course._id}
//           addLesson={(lesson) => setLessons([lesson, ...lessons])}
//         />
//       )}

//        {/* 🔥 Creator يظهر بس لصاحب الكورس */}
//     {/* {isOwner && (
//       <LessonCreator
//         courseId={course._id}
//         onCreate={{
//           addLesson: (lesson) =>
//             setLessons((prev) => [...prev, lesson]),
//         }}
//       />
//     )} */}

//       {/* 🎥 المحتوى */}
//       {lessons.length > 0 && (
//         <div className="aspect-video w-full mb-6">{renderContent()}</div>
//       )}


// {/* 💬 الكومنتات */}

// {currentLesson?._id && (
  
//   <LessonComments lessonId={currentLesson._id} lesson={currentLesson} lessonDeletedId={lessonDeletedId} />
// )}

//       {/* 📚 قائمة الدروس */}
//       {lessons.length > 0 ? (
//         <div className="space-y-3">
//           {lessons.map((lesson, i) => (
//             <div
//               key={lesson._id}
//               className={`p-3 rounded-lg flex justify-between items-center cursor-pointer ${
//                 selected === i ? "bg-blue-600" : "bg-gray-800"
//               }`}
//               onClick={() => setSelected(i)}
//             >
//               <span>{lesson.title}</span>

//               <div className="flex gap-2">
//                 {/* DONE */}
//                 <button
//                   onClick={(e) => {
//                     e.stopPropagation();
//                     completeLesson(lesson._id);
//                   }}
//                   className={`px-3 py-1 rounded cursor-pointer transition ${
//                     lesson.completed
//                       ? "bg-gray-500"
//                       : "bg-green-600 hover:bg-green-700"
//                   }`}
//                 >
//                   {lesson.completed ? "Done ✅" : "Mark as Done"}
//                 </button>

//                 {/* DELETE */}
//                 {isOwner && (
//                   <button
//                     onClick={(e) => {
//                       e.stopPropagation();
//                       deleteLesson(lesson._id);
//                       setLessonDeletedId(lesson._id); // 🔥 مهم
//                     }}
//                     className="bg-red-600 px-3 py-1 rounded cursor-pointer hover:bg-red-700 transition"
//                   >
//                     Delete
//                   </button>
//                 )}
//               </div>
//             </div>
//           ))}
//         </div>
//       ) : (
//   <NoLessonsUI
//     courseId={course._id}
//     addLesson={(lesson) => {
//       // 🔥 إضافة الدرس الجديد بشكل صحيح
//       setLessons((prev) => [...prev, lesson]);
//     }}
//   />
//       )}
//     </div>
//   );
// }


































import { useState, useEffect, useMemo } from "react";
import { useParams } from "react-router-dom";
import NoLessonsUI from "../components/NoLessonsUI";
import AddLessonModal from "../components/AddLessonModal";
import LessonComments from "../components/LessonComments";
import { Spinner } from "../components/Spinner";
import api from "../api/axios";

// ================= PDF FIX =================
const convertPdfUrl = (url) => {
  if (!url) return "";

  let fixedUrl = url;

  if (url.includes("/image/upload/")) {
    fixedUrl = url.replace("/image/upload/", "/raw/upload/");
  }

  return fixedUrl.includes("?")
    ? `${fixedUrl}&fl_attachment=false`
    : `${fixedUrl}?fl_attachment=false`;
};

export default function Course() {
  const { id } = useParams();

  const [course, setCourse] = useState(null);
  const [lessons, setLessons] = useState([]);
  const [selected, setSelected] = useState(0);
  const [loading, setLoading] = useState(true);
  const [lessonDeletedId, setLessonDeletedId] = useState(null);

  const user = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem("user"));
    } catch {
      return null;
    }
  }, []);

  const isOwner =
    user &&
    course?.instructor &&
    String(
      typeof course.instructor === "object"
        ? course.instructor._id
        : course.instructor
    ) === String(user._id);

  const currentLesson = lessons[selected] || null;

  // ================= FETCH DATA =================
  useEffect(() => {
    if (!id) return;

    const fetchData = async () => {
      try {
        setLoading(true);

        const [courseRes, lessonsRes] = await Promise.all([
          api.get(`/courses/${id}`),
          api.get(`/lessons/course/${id}`),
        ]);

        setCourse(courseRes.data?.data || null);
        setLessons(lessonsRes.data?.data || []);
        setSelected(0);
      } catch (err) {
        console.error(err?.response?.data?.message || err.message);
        setCourse(null);
        setLessons([]);

        if (err.response?.status === 401) {
          console.log("Unauthorized - trying refresh...");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  // ================= COMPLETE =================
  const completeLesson = async (lessonId) => {
    try {
      await api.patch(`/lessons/${lessonId}/complete`);

      setLessons((prev) =>
        prev.map((lesson) =>
          lesson._id === lessonId ? { ...lesson, completed: true } : lesson
        )
      );
    } catch (err) {
      console.error(err?.response?.data?.message || err.message);
    }
  };

  // ================= DELETE =================
  const deleteLesson = async (lessonId) => {
    try {
      await api.delete(`/lessons/${lessonId}`);
      setLessonDeletedId(lessonId);

      setLessons((prev) => {
        const deletedIndex = prev.findIndex((lesson) => lesson._id === lessonId);
        const updatedLessons = prev.filter((lesson) => lesson._id !== lessonId);

        setSelected((prevSelected) => {
          if (updatedLessons.length === 0) return 0;
          if (prevSelected === deletedIndex) {
            return Math.min(prevSelected, updatedLessons.length - 1);
          }
          if (prevSelected > deletedIndex) {
            return prevSelected - 1;
          }
          return prevSelected;
        });

        return updatedLessons;
      });
    } catch (err) {
      console.error(err?.response?.data?.message || err.message);

      if (err.response?.status === 401) {
        console.log("Unauthorized - trying refresh...");
      }
    }
  };

  // ================= RENDER CONTENT =================
  const renderContent = () => {
    if (!currentLesson) return null;

    switch (currentLesson.type) {
      case "video":
        return (
          <video
            controls
            crossOrigin="anonymous"
            preload="metadata"
            className="w-full h-full rounded-3xl bg-black"
          >
            <source src={currentLesson.content} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        );

      case "pdf":
        return (
          <iframe
            title={currentLesson.title || "Lesson PDF"}
            src={`https://docs.google.com/gview?url=${encodeURIComponent(
              convertPdfUrl(currentLesson.content)
            )}&embedded=true`}
            className="w-full h-full rounded-3xl bg-white dark:bg-gray-900"
          />
        );

      default:
        return (
          <div
            className="
              h-full min-h-[300px]
              flex items-center justify-center
              rounded-3xl
              border border-gray-200 dark:border-gray-800
              bg-white dark:bg-gray-900
              text-gray-500 dark:text-gray-400
            "
          >
            No content available for this lesson.
          </div>
        );
    }
  };

  // ================= LOADING =================
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950 transition-colors duration-300">
        <div className="flex flex-col items-center gap-4">
          <Spinner size="lg" variant="primary" />
          <p className="text-sm tracking-wide text-gray-500 dark:text-gray-400">
            Loading course...
          </p>
        </div>
      </div>
    );
  }

  // ================= NOT FOUND =================
  if (!course) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950 px-6 transition-colors duration-300">
        <div
          className="
            max-w-md w-full text-center
            rounded-3xl
            border border-gray-200 dark:border-gray-800
            bg-white dark:bg-gray-900
            shadow-xl shadow-gray-200/40 dark:shadow-black/20
            p-10
          "
        >
          <div className="text-6xl mb-5">❌</div>

          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-3">
            Course Not Found
          </h2>

          <p className="text-gray-500 dark:text-gray-400 mb-6 leading-relaxed">
            The course you are looking for does not exist or may have been removed.
          </p>

          <button
            onClick={() => window.history.back()}
            className="
              px-5 py-3 rounded-2xl
              bg-blue-600 hover:bg-blue-500
              text-white font-semibold
              transition-all duration-200
              shadow-md hover:shadow-blue-500/25
            "
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  // ================= EMPTY STATE =================
  if (!lessons.length) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 px-6 py-10 transition-colors duration-300">
        <div className="max-w-5xl mx-auto">
          {isOwner ? (
            <NoLessonsUI
              courseId={course._id}
              onCreate={(lesson) => {
                if (lesson?._id) {
                  setLessons([lesson]);
                }
              }}
            />
          ) : (
            <div className="flex items-center justify-center min-h-[70vh]">
              <div
                className="
                  max-w-md w-full text-center
                  rounded-3xl
                  border border-gray-200 dark:border-gray-800
                  bg-white dark:bg-gray-900
                  shadow-xl shadow-gray-200/40 dark:shadow-black/20
                  p-10
                "
              >
                <div className="text-6xl mb-5 animate-bounce">📚</div>

                <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-3">
                  No Lessons Available
                </h2>

                <p className="text-gray-500 dark:text-gray-400 leading-relaxed">
                  This course does not have any lessons yet.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 px-4 md:px-6 py-6 transition-colors duration-300">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div
          className="
            rounded-3xl border border-gray-200 dark:border-gray-800
            bg-white dark:bg-gray-900
            shadow-sm
            p-5 md:p-6
          "
        >
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <p className="text-sm font-medium text-blue-600 dark:text-blue-400 mb-2">
                Course Viewer
              </p>
              <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100">
                {course.title}
              </h1>
              <p className="mt-2 text-sm text-gray-500 dark:text-gray-400 max-w-2xl">
                {course.description || "Explore lessons and continue learning."}
              </p>
            </div>

            {isOwner && (
              <div className="flex justify-start lg:justify-end">
                <AddLessonModal
                  courseId={course._id}
                  addLesson={(lesson) =>
                    setLessons((prev) => [lesson, ...prev])
                  }
                />
              </div>
            )}
          </div>
        </div>

        {/* Viewer + Sidebar */}
        <div className="grid grid-cols-1 xl:grid-cols-[1.6fr_0.9fr] gap-6">
          {/* Main Content */}
          <div className="space-y-6">
            {/* Lesson Viewer */}
            <div
              className="
                rounded-3xl border border-gray-200 dark:border-gray-800
                bg-white dark:bg-gray-900
                shadow-sm overflow-hidden
              "
            >
              <div className="p-4 md:p-5 border-b border-gray-200 dark:border-gray-800">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="text-xs uppercase tracking-wider text-gray-400 dark:text-gray-500">
                      Current Lesson
                    </p>
                    <h2 className="text-lg md:text-xl font-bold text-gray-900 dark:text-gray-100 mt-1">
                      {currentLesson?.title || "Lesson"}
                    </h2>
                  </div>

                  <span
                    className="
                      px-3 py-1 rounded-full text-xs font-semibold
                      bg-blue-50 dark:bg-blue-500/10
                      text-blue-600 dark:text-blue-400
                      border border-blue-100 dark:border-blue-500/20
                      capitalize
                    "
                  >
                    {currentLesson?.type || "content"}
                  </span>
                </div>
              </div>

              <div className="p-4 md:p-5">
                <div className="aspect-video w-full rounded-3xl overflow-hidden bg-gray-100 dark:bg-gray-950">
                  {renderContent()}
                </div>
              </div>
            </div>

            {/* Comments */}
            {currentLesson?._id && (
              <div
                className="
                  rounded-3xl border border-gray-200 dark:border-gray-800
                  bg-white dark:bg-gray-900
                  shadow-sm
                  p-4 md:p-5
                "
              >
                <LessonComments
                  lessonId={currentLesson._id}
                  lesson={currentLesson}
                  lessonDeletedId={lessonDeletedId}
                />
              </div>
            )}
          </div>

          {/* Lessons Sidebar */}
          <div
            className="
              rounded-3xl border border-gray-200 dark:border-gray-800
              bg-white dark:bg-gray-900
              shadow-sm
              overflow-hidden h-fit
            "
          >
            <div className="px-5 py-4 border-b border-gray-200 dark:border-gray-800">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">
                    Lessons
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {lessons.length} lesson{lessons.length > 1 ? "s" : ""}
                  </p>
                </div>
              </div>
            </div>

            <div className="p-4 space-y-3">
              {lessons.map((lesson, i) => {
                const isSelected = selected === i;

                return (
                  <div
                    key={lesson._id}
                    onClick={() => setSelected(i)}
                    className={`
                      rounded-2xl border p-4 cursor-pointer transition-all duration-200
                      ${
                        isSelected
                          ? "bg-blue-600 border-blue-600 text-white shadow-md shadow-blue-500/20"
                          : "bg-gray-50 hover:bg-gray-100 dark:bg-gray-800/70 dark:hover:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-gray-100"
                      }
                    `}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p
                          className={`text-sm font-semibold truncate ${
                            isSelected
                              ? "text-white"
                              : "text-gray-900 dark:text-gray-100"
                          }`}
                        >
                          {lesson.title}
                        </p>

                        <p
                          className={`text-xs mt-1 capitalize ${
                            isSelected
                              ? "text-blue-100"
                              : "text-gray-500 dark:text-gray-400"
                          }`}
                        >
                          {lesson.type}
                        </p>
                      </div>

                      {lesson.completed && (
                        <span
                          className={`
                            px-2 py-1 rounded-full text-[10px] font-bold whitespace-nowrap
                            ${
                              isSelected
                                ? "bg-white/15 text-white border border-white/20"
                                : "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-500/20"
                            }
                          `}
                        >
                          Done
                        </span>
                      )}
                    </div>

                    <div className="flex flex-wrap gap-2 mt-4">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          completeLesson(lesson._id);
                        }}
                        className={`
                          px-3 py-2 rounded-xl text-xs font-semibold transition-all
                          ${
                            lesson.completed
                              ? isSelected
                                ? "bg-white/15 text-white"
                                : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200"
                              : "bg-emerald-600 hover:bg-emerald-500 text-white"
                          }
                        `}
                      >
                        {lesson.completed ? "Done ✅" : "Mark as Done"}
                      </button>

                      {isOwner && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteLesson(lesson._id);
                          }}
                          className="
                            px-3 py-2 rounded-xl text-xs font-semibold
                            bg-red-600 hover:bg-red-500 text-white
                            transition-all
                          "
                        >
                          Delete
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}