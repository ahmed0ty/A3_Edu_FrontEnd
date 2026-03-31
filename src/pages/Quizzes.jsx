// import { useEffect, useState } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import { jwtDecode } from "jwt-decode";
// import toast from "react-hot-toast";
// import api from "../api/axios"
// import socket from "../socket";
// export default function Quizzes() {
//   const { id: courseId } = useParams();
//   const navigate = useNavigate();

//   const [quizzes, setQuizzes] = useState([]);
//   const [course, setCourse] = useState(null);
//   const [quizStatuses, setQuizStatuses] = useState({});
//   const [showDeleteModal, setShowDeleteModal] = useState(false);
//   const [selectedQuizId, setSelectedQuizId] = useState(null);
// const [submitted, setSubmitted] = useState(false);
//  const user = JSON.parse(localStorage.getItem("user")); // ✅
// const isOwner =
//   user && course?.instructor &&
//   String(course.instructor._id) === String(user._id); // ✅ user._id

//   // 🔥 Fetch quizzes + course
//    const fetchQuizzes = async () => {
//     try {
//       // ✅ جلب الكويز والكورس في نفس الوقت
//       const [quizRes, courseRes] = await Promise.all([
//         api.get(`/quizzes/course/${courseId}`),
//         api.get(`/courses/${courseId}`),
//       ]);

//       // ✅ quizzes
//       const list = quizRes.data.data || [];
//       setQuizzes(list);

//       const statuses = {};

//       list.forEach((quiz) => {
//         const now = Date.now();
//         const start = new Date(quiz.startAt).getTime();
//         const end = new Date(quiz.endAt).getTime();

//        if (now < start) {
//   statuses[quiz._id] = "upcoming";
// } else if (now >= start && now <= end) {
//   statuses[quiz._id] = "open";
// } else {
//   statuses[quiz._id] = "closed"; // ✅ حتى لو completed هيبقى closed
// }
//       });

//       setQuizStatuses(statuses);

//       // ✅ course
//       setCourse(courseRes.data.data);

//     } catch (err) {
//       console.error("Error fetching quizzes:", err);
//     }
//   };

//   useEffect(() => {
//     fetchQuizzes();
//   }, [courseId]);

//   // 🔥 Auto refresh
//   useEffect(() => {
//     const interval = setInterval(fetchQuizzes, 30000);
//     return () => clearInterval(interval);
//   }, []);

//   // في useEffect زود:
// useEffect(() => {
//   socket.on("quiz:updated", ({ courseId: updatedCourseId }) => {
//     if (String(updatedCourseId) === String(courseId)) {
//       fetchQuizzes(); // ✅ يريفريش فوراً
//     }
//   });

//   return () => {
//     socket.off("quiz:updated");
//   };
// }, [courseId]);

//   // ✅ تحديث الـ statuses كل دقيقة
// useEffect(() => {
//   const interval = setInterval(() => {
//     setQuizStatuses((prevStatuses) => {
//       const updated = { ...prevStatuses };

//       quizzes.forEach((quiz) => {
//         const now = Date.now();
//         const start = new Date(quiz.startAt).getTime();
//         const end = new Date(quiz.endAt).getTime();

//         if (now < start) {
//           updated[quiz._id] = "upcoming";
//         } else if (now >= start && now <= end) {
//           updated[quiz._id] = "open";
//         } else {
//           updated[quiz._id] = "closed"; // ✅ هيتحدث لـ closed تلقائي
//         }
//       });

//       return updated;
//     });
//   }, 60000); // كل دقيقة

//   return () => clearInterval(interval);
// }, [quizzes]);

//   // 🔥 Start Quiz
// const startQuiz = async (quiz) => {
//   const status = quizStatuses[quiz._id];

//   // ❌ منع البدء لو مش open
//   if (status !== "open") return;

//   try {
//     // ✅ axios بدل fetch
//     const res = await api.post(`/quizzes/${quiz._id}/start`);
//     const data = res.data;

//     console.log("📦 START RESPONSE:", data);

//     // ❌ فشل من الباك
//     if (!data || data.success === false) {
//       toast.error(data?.message || "Failed to start quiz");
//       return;
//     }

//     const attemptId = data.attemptId;

//     // ❌ حماية
//     if (!attemptId) {
//       console.error("❌ Missing attemptId:", data);
//       toast.error("Something went wrong (missing attempt id)");
//       return;
//     }

//     // ✅ لو محلول قبل كده
//     if (data.completed) {
//       navigate(`/results/${attemptId}`);
//       return;
//     }

//     // 🚀 فتح الكويز
//     navigate(`/quiz/${attemptId}`);

//   } catch (err) {
//     console.error("❌ START QUIZ ERROR:", err);

//     // 💡 axios error handling أحسن
//     const message =
//       err.response?.data?.message || "Network error";

//     toast.error(message);
//   }
// };

//   // 🔥 Delete Quiz
//   const deleteQuiz = async () => {
//     try {
//       await api.delete(`/quizzes/${selectedQuizId}`);

//       setQuizzes((prev) =>
//         prev.filter((q) => q._id !== selectedQuizId)
//       );

//       setShowDeleteModal(false);
//       setSelectedQuizId(null);
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   // 🔥 Countdown Component (Fixed)
//   const Countdown = ({ startAt }) => {
//     const [time, setTime] = useState(null);
//     const [total, setTotal] = useState(null);

//     useEffect(() => {
//       const start = new Date(startAt).getTime();
//       const now = Date.now();

//       const initial = Math.max(0, Math.floor((start - now) / 1000));

//       setTime(initial);
//       setTotal(initial);

//       const interval = setInterval(() => {
//         setTime((prev) => {
//           if (prev <= 1) {
//             clearInterval(interval);
//             return 0;
//           }
//           return prev - 1;
//         });
//       }, 1000);

//       return () => clearInterval(interval);
//     }, [startAt]);

//     if (time === null || total === null) return null;

//     const m = Math.floor(time / 60);
//     const s = time % 60;
//     const percentage = total > 0 ? (time / total) * 100 : 0;

//     return (
//       <div className="mt-3">
//         <div className="w-full bg-gray-700 h-2 rounded overflow-hidden">
//           <div
//             className="bg-yellow-400 h-2 transition-all duration-1000 ease-linear"
//             style={{ width: `${percentage}%` }}
//           />
//         </div>

//         <p className="text-xs text-yellow-300 mt-1">
//           Starts in: {m}m {s}s
//         </p>
//       </div>
//     );
//   };

// const getStatusStyle = (status) => {
//   switch (status) {
//     case "open":
//       return "border-green-500 text-green-400";
//     case "upcoming":
//       return "border-yellow-500 text-yellow-400";
//     case "closed":
//       return "border-red-500 text-red-400";
//     case "completed":
//       return "border-gray-500 text-gray-400";
//     default:
//       return "border-gray-700 text-gray-400";
//   }
// };

//   return (
//     <>
//       <div className="p-8 bg-gradient-to-br from-gray-900 to-gray-800 min-h-screen text-white">
//         <h1 className="text-4xl font-bold mb-10 text-center">
//           🧠 Quizzes
//         </h1>

//         {isOwner && (
//           <div className="text-center mb-8">
//             <button
//               onClick={() => navigate(`/create-quiz/${courseId}`)}
//               className="bg-green-500 hover:bg-green-600 px-6 py-3 rounded-xl"
//             >
//               + Create Quiz
//             </button>
//           </div>
//         )}

//         {quizzes.length === 0 && (
//           <p className="text-center text-gray-400">No quizzes found</p>
//         )}

//         <div className="grid md:grid-cols-3 gap-8">
//           {quizzes.map((quiz) => {
//             const status = quizStatuses[quiz._id];

//             return (
//               <div
//                 key={quiz._id}
//                 className={`p-6 rounded-2xl border-2 ${getStatusStyle(
//                   status
//                 )}`}
//               >
//                 <h3 className="text-xl font-bold">{quiz.title}</h3>

//                 <p className="text-sm mt-2">
//                   {status === "open" && "🟢 Open"}
//                   {status === "upcoming" && "🟡 Upcoming"}
//                   {status === "closed" && "🔴 Closed"}
//                 </p>

//                 {status === "upcoming" && (
//                   <Countdown startAt={quiz.startAt} />
//                 )}

//                 {/* <p className="text-gray-400 mt-3">
//                   {quiz.description || "No description"}
//                 </p> */}

//                 {isOwner ? (
//                   <div className="mt-5 flex gap-3">
//                     <button
//                       onClick={() => navigate(`/quiz/${quiz._id}/edit`)}
//                       className="w-1/2 bg-yellow-500 py-2 rounded-lg"
//                     >
//                       Edit
//                     </button>

//                     <button
//                       onClick={() => {
//                         setSelectedQuizId(quiz._id);
//                         setShowDeleteModal(true);
//                       }}
//                       className="w-1/2 bg-red-600 py-2 rounded-lg"
//                     >
//                       Delete
//                     </button>
//                   </div>
//                 ) : (
//                   <button
//                     onClick={() => startQuiz(quiz)}
//                     disabled={status !== "open"}
//                     className={`mt-5 w-full py-2 rounded-lg ${
//                       status === "open"
//                         ? "bg-blue-600"
//                         : "bg-gray-600 cursor-not-allowed"
//                     }`}
//                   >
//                     {status === "open"
//                       ? "🚀 Start Quiz"
//                       : status === "upcoming"
//                       ? "⏳ Waiting..."
//                       : "❌ Closed"}
//                   </button>
//                 )}
//               </div>
//             );
//           })}
//         </div>
//       </div>

//       {/* Delete Modal */}
//       {showDeleteModal && (
//         <div className="fixed inset-0 bg-black/60 flex items-center justify-center">
//           <div className="bg-gray-800 p-6 rounded-xl w-96 text-center">
//             <h2 className="text-xl text-red-400 mb-4">
//               ⚠️ Confirm Delete
//             </h2>

//             <p className="mb-6">
//               Are you sure you want to delete this quiz?
//             </p>

//             <div className="flex gap-4">
//               <button
//                 onClick={() => setShowDeleteModal(false)}
//                 className="w-1/2 bg-gray-600 py-2 rounded-lg"
//               >
//                 Cancel
//               </button>

//               <button
//                 onClick={deleteQuiz}
//                 className="w-1/2 bg-red-600 py-2 rounded-lg"
//               >
//                 Delete
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </>
//   );
// }




































import { useEffect, useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../api/axios";
import socket from "../socket";
import { Spinner } from "../components/Spinner";

export default function Quizzes() {
  const { id: courseId } = useParams();
  const navigate = useNavigate();

  const [quizzes, setQuizzes] = useState([]);
  const [course, setCourse] = useState(null);
  const [quizStatuses, setQuizStatuses] = useState({});
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedQuizId, setSelectedQuizId] = useState(null);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [loading, setLoading] = useState(true);

  const user = JSON.parse(localStorage.getItem("user"));

  const isOwner =
    user &&
    course?.instructor &&
    String(course.instructor._id) === String(user._id);

  const fetchQuizzes = async () => {
    try {
      setLoading(true);

      const [quizRes, courseRes] = await Promise.all([
        api.get(`/quizzes/course/${courseId}`),
        api.get(`/courses/${courseId}`),
      ]);

      const list = quizRes.data?.data || [];
      setQuizzes(list);

      const statuses = {};

      list.forEach((quiz) => {
        const now = Date.now();
        const start = new Date(quiz.startAt).getTime();
        const end = new Date(quiz.endAt).getTime();

        if (now < start) {
          statuses[quiz._id] = "upcoming";
        } else if (now >= start && now <= end) {
          statuses[quiz._id] = "open";
        } else {
          statuses[quiz._id] = "closed";
        }
      });

      setQuizStatuses(statuses);
      setCourse(courseRes.data?.data || null);
    } catch (err) {
      console.error("Error fetching quizzes:", err);
      toast.error(err.response?.data?.message || "Failed to load quizzes");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuizzes();
  }, [courseId]);

  useEffect(() => {
    const interval = setInterval(fetchQuizzes, 30000);
    return () => clearInterval(interval);
  }, [courseId]);

  useEffect(() => {
    const handleQuizUpdated = ({ courseId: updatedCourseId }) => {
      if (String(updatedCourseId) === String(courseId)) {
        fetchQuizzes();
      }
    };

    socket.on("quiz:updated", handleQuizUpdated);

    return () => {
      socket.off("quiz:updated", handleQuizUpdated);
    };
  }, [courseId]);

  useEffect(() => {
    const interval = setInterval(() => {
      setQuizStatuses((prevStatuses) => {
        const updated = { ...prevStatuses };

        quizzes.forEach((quiz) => {
          const now = Date.now();
          const start = new Date(quiz.startAt).getTime();
          const end = new Date(quiz.endAt).getTime();

          if (now < start) {
            updated[quiz._id] = "upcoming";
          } else if (now >= start && now <= end) {
            updated[quiz._id] = "open";
          } else {
            updated[quiz._id] = "closed";
          }
        });

        return updated;
      });
    }, 60000);

    return () => clearInterval(interval);
  }, [quizzes]);

  const startQuiz = async (quiz) => {
    const status = quizStatuses[quiz._id];
    if (status !== "open") return;

    try {
      const res = await api.post(`/quizzes/${quiz._id}/start`);
      const data = res.data;

      if (!data || data.success === false) {
        toast.error(data?.message || "Failed to start quiz");
        return;
      }

      const attemptId = data.attemptId;

      if (!attemptId) {
        toast.error("Something went wrong (missing attempt id)");
        return;
      }

      if (data.completed) {
        navigate(`/results/${attemptId}`);
        return;
      }

      navigate(`/quiz/${attemptId}`);
    } catch (err) {
      console.error("START QUIZ ERROR:", err);
      const message = err.response?.data?.message || "Network error";
      toast.error(message);
    }
  };

  const deleteQuiz = async () => {
    try {
      await api.delete(`/quizzes/${selectedQuizId}`);

      setQuizzes((prev) => prev.filter((q) => q._id !== selectedQuizId));
      setShowDeleteModal(false);
      setSelectedQuizId(null);

      toast.success("Quiz deleted successfully");
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to delete quiz");
    }
  };

  const Countdown = ({ startAt }) => {
    const [time, setTime] = useState(null);
    const [total, setTotal] = useState(null);

    useEffect(() => {
      const start = new Date(startAt).getTime();
      const now = Date.now();

      const initial = Math.max(0, Math.floor((start - now) / 1000));

      setTime(initial);
      setTotal(initial);

      const interval = setInterval(() => {
        setTime((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(interval);
    }, [startAt]);

    if (time === null || total === null) return null;

    const m = Math.floor(time / 60);
    const s = time % 60;
    const percentage = total > 0 ? (time / total) * 100 : 0;

    return (
      <div className="mt-4">
        <div className="w-full bg-gray-200 dark:bg-gray-800 h-2 rounded-full overflow-hidden">
          <div
            className="bg-yellow-500 h-2 transition-all duration-1000 ease-linear"
            style={{ width: `${percentage}%` }}
          />
        </div>

        <p className="text-xs text-yellow-600 dark:text-yellow-400 mt-2 font-medium">
          Starts in: {m}m {s}s
        </p>
      </div>
    );
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case "open":
        return "border-green-200 dark:border-green-500/20 bg-green-50 dark:bg-green-500/10 text-green-600 dark:text-green-400";
      case "upcoming":
        return "border-yellow-200 dark:border-yellow-500/20 bg-yellow-50 dark:bg-yellow-500/10 text-yellow-600 dark:text-yellow-400";
      case "closed":
        return "border-red-200 dark:border-red-500/20 bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400";
      default:
        return "border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-500 dark:text-gray-400";
    }
  };

  const filteredQuizzes = useMemo(() => {
    return quizzes.filter((quiz) => {
      const matchesSearch = quiz.title
        .toLowerCase()
        .includes(search.toLowerCase());

      const matchesStatus =
        statusFilter === "all" || quizStatuses[quiz._id] === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [quizzes, search, statusFilter, quizStatuses]);

  return (
    <>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-white px-4 py-8 md:px-6 transition-colors duration-300">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div
            className="
              rounded-3xl border border-gray-200 dark:border-gray-800
              bg-white dark:bg-gray-900
              shadow-sm p-6 md:p-8 mb-8
            "
          >
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
              <div>
                <div
                  className="
                    inline-flex items-center gap-2
                    px-3 py-1.5 rounded-full mb-4
                    bg-purple-50 dark:bg-purple-500/10
                    text-purple-600 dark:text-purple-400
                    text-xs font-semibold
                    border border-purple-100 dark:border-purple-500/20
                  "
                >
                  Course Quizzes
                </div>

                <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
                  🧠 Quizzes
                </h1>

                <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                  Browse, filter, and manage course quizzes.
                </p>
              </div>

              {isOwner && (
                <button
                  onClick={() => navigate(`/create-quiz/${courseId}`)}
                  className="
                    inline-flex items-center justify-center gap-2
                    px-5 py-3 rounded-2xl
                    bg-emerald-600 hover:bg-emerald-500
                    text-white font-semibold
                    shadow-md hover:shadow-emerald-500/25
                    transition-all duration-200
                  "
                >
                  + Create Quiz
                </button>
              )}
            </div>
          </div>

          {/* Filters */}
          <div
            className="
              rounded-3xl border border-gray-200 dark:border-gray-800
              bg-white dark:bg-gray-900
              shadow-sm p-5 md:p-6 mb-8
            "
          >
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <label className="block mb-2 text-sm font-semibold text-gray-700 dark:text-gray-200">
                  Search
                </label>
                <input
                  type="text"
                  placeholder="Search quizzes..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="
                    w-full h-12 px-4 rounded-2xl
                    border border-gray-200 dark:border-gray-700
                    bg-gray-50 dark:bg-gray-800
                    text-gray-900 dark:text-gray-100
                    placeholder:text-gray-400 dark:placeholder:text-gray-500
                    focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500
                  "
                />
              </div>

              <div className="md:w-64">
                <label className="block mb-2 text-sm font-semibold text-gray-700 dark:text-gray-200">
                  Status
                </label>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="
                    w-full h-12 px-4 rounded-2xl
                    border border-gray-200 dark:border-gray-700
                    bg-gray-50 dark:bg-gray-800
                    text-gray-900 dark:text-gray-100
                    focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500
                  "
                >
                  <option value="all">All</option>
                  <option value="open">Open</option>
                  <option value="upcoming">Upcoming</option>
                  <option value="closed">Closed</option>
                </select>
              </div>
            </div>
          </div>

          {/* Content */}
          {loading ? (
            <div
              className="
                rounded-3xl border border-gray-200 dark:border-gray-800
                bg-white dark:bg-gray-900
                p-12 shadow-sm
              "
            >
              <div className="flex flex-col items-center justify-center gap-4 min-h-[260px]">
                <Spinner size="lg" variant="primary" />
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Loading quizzes...
                </p>
              </div>
            </div>
          ) : filteredQuizzes.length === 0 ? (
            <div
              className="
                rounded-3xl border border-dashed border-gray-300 dark:border-gray-700
                bg-white dark:bg-gray-900
                p-12 text-center shadow-sm
              "
            >
              <div className="text-5xl mb-4">📝</div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                No quizzes found
              </h3>
              <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                Try changing the search text or filter.
              </p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredQuizzes.map((quiz) => {
                const status = quizStatuses[quiz._id];

                return (
                  <div
                    key={quiz._id}
                    className="
                      rounded-3xl border border-gray-200 dark:border-gray-800
                      bg-white dark:bg-gray-900
                      shadow-sm p-6
                      transition-all duration-200 hover:shadow-lg
                    "
                  >
                    <div className="flex items-start justify-between gap-3">
                      <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                        {quiz.title}
                      </h3>

                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusStyle(
                          status
                        )}`}
                      >
                        {status === "open" && "Open"}
                        {status === "upcoming" && "Upcoming"}
                        {status === "closed" && "Closed"}
                      </span>
                    </div>

                    <div className="mt-4 space-y-2 text-sm text-gray-500 dark:text-gray-400">
                      <p>
                        <span className="font-medium text-gray-700 dark:text-gray-300">
                          Start:
                        </span>{" "}
                        {new Date(quiz.startAt).toLocaleString()}
                      </p>
                      <p>
                        <span className="font-medium text-gray-700 dark:text-gray-300">
                          End:
                        </span>{" "}
                        {new Date(quiz.endAt).toLocaleString()}
                      </p>
                    </div>

                    {status === "upcoming" && <Countdown startAt={quiz.startAt} />}

                    {isOwner ? (
                      <div className="mt-6 flex gap-3">
                        <button
                          onClick={() => navigate(`/quiz/${quiz._id}/edit`)}
                          className="
                            w-1/2 py-2.5 rounded-2xl
                            bg-amber-500 hover:bg-amber-400
                            text-white font-semibold
                            transition-all duration-200
                          "
                        >
                          Edit
                        </button>

                        <button
                          onClick={() => {
                            setSelectedQuizId(quiz._id);
                            setShowDeleteModal(true);
                          }}
                          className="
                            w-1/2 py-2.5 rounded-2xl
                            bg-red-600 hover:bg-red-500
                            text-white font-semibold
                            transition-all duration-200
                          "
                        >
                          Delete
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => startQuiz(quiz)}
                        disabled={status !== "open"}
                        className={`
                          mt-6 w-full py-2.5 rounded-2xl font-semibold transition-all duration-200
                          ${
                            status === "open"
                              ? "bg-blue-600 hover:bg-blue-500 text-white shadow-md hover:shadow-blue-500/25"
                              : "bg-gray-200 dark:bg-gray-800 text-gray-500 dark:text-gray-400 cursor-not-allowed"
                          }
                        `}
                      >
                        {status === "open"
                          ? "🚀 Start Quiz"
                          : status === "upcoming"
                          ? "⏳ Waiting..."
                          : "❌ Closed"}
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Delete Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[10000] px-4">
          <div
            className="
              w-full max-w-md
              rounded-3xl border border-gray-200 dark:border-gray-800
              bg-white dark:bg-gray-900
              shadow-2xl p-6 text-center
            "
          >
            <div className="text-5xl mb-4">⚠️</div>

            <h2 className="text-xl font-bold text-red-600 dark:text-red-400 mb-2">
              Confirm Delete
            </h2>

            <p className="text-gray-500 dark:text-gray-400 mb-6">
              Are you sure you want to delete this quiz?
            </p>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setSelectedQuizId(null);
                }}
                className="
                  flex-1 h-11 rounded-2xl
                  bg-gray-100 hover:bg-gray-200
                  dark:bg-gray-800 dark:hover:bg-gray-700
                  text-gray-700 dark:text-gray-200
                  border border-gray-200 dark:border-gray-700
                  font-semibold transition-all duration-200
                "
              >
                Cancel
              </button>

              <button
                onClick={deleteQuiz}
                className="
                  flex-1 h-11 rounded-2xl
                  bg-red-600 hover:bg-red-500
                  text-white font-semibold transition-all duration-200
                "
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}