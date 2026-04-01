
// import { useEffect, useState, useRef } from "react";
// import Navbar from "../components/Navbar";
// import CourseCard from "../components/CourseCard";
// import { useNavigate } from "react-router-dom";
// import "../App.css";
// import axios from "../api/axios";
// import socket from "../socket";

// export default function Dashboard() {
//   const [courses, setCourses] = useState([]);
//   const [quizzes, setQuizzes] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [showMyCourses, setShowMyCourses] = useState(false);
//   const [courseToDelete, setCourseToDelete] = useState(null); // ✅
//   const navigate = useNavigate();

//   const token = localStorage.getItem("token") || "";
//   const [user, setUser] = useState(() => JSON.parse(localStorage.getItem("user")));
//   const [requestStatus, setRequestStatus] = useState(
//     user?.instructorRequestStatus || "none"
//   );

//   const [showForm, setShowForm] = useState(false);
//   const [file, setFile] = useState(null);
//   const [fullName, setFullName] = useState("");
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const fileInputRef = useRef(null);
//   const [courseFilter, setCourseFilter] = useState("all");

//   const [toast, setToast] = useState({ show: false, message: "", type: "" });

//   const showToast = (message, type = "success") => {
//     setToast({ show: true, message, type });
//     setTimeout(() => {
//       setToast({ show: false, message: "", type: "" });
//     }, 2500);
//   };

//   // ================= FILE VALIDATION =================
//   const handleFileChange = (file) => {
//     if (!file) return;
//     if (!file.type.startsWith("image/")) {
//       showToast("Only image files are allowed", "error");
//       return;
//     }
//     const maxSize = 2 * 1024 * 1024;
//     if (file.size > maxSize) {
//       showToast("Image must be less than 2MB", "error");
//       return;
//     }
//     setFile(file);
//   };

//   // ================= FETCH COURSES =================
//   useEffect(() => {
//     if (!token) {
//       setLoading(false);
//       return;
//     }

//     const fetchCourses = async () => {
//       try {
//         setLoading(true);
//         const res = await axios.get("/courses");
//         setCourses(Array.isArray(res.data.data) ? res.data.data : []);
//       } catch (error) {
//         console.error("Fetch error:", error);
//         if (error.response?.status === 401) {
//           localStorage.removeItem("token");
//           localStorage.removeItem("user");
//           navigate("/login", { replace: true });
//           return;
//         }
//         setCourses([]);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchCourses();
//   }, [navigate, token]);

//   // ================= SOCKET =================
//   useEffect(() => {
//     if (!user?._id) return;

//     socket.emit("joinUserRoom", user._id);

//     socket.on("connect", () => {
//       socket.emit("joinUserRoom", user._id);
//     });

//     socket.on("courseUpdated", (updatedCourse) => {
//       setCourses((prev) =>
//         prev.map((c) => c._id === updatedCourse._id ? updatedCourse : c)
//       );
//     });

//     socket.on("course:deleted", ({ courseId }) => {
//       setCourses((prev) =>
//         prev.filter((c) => String(c._id) !== String(courseId))
//       );
//     });

//     socket.on("instructorRequestUpdated", (updatedUser) => {
//       if (updatedUser._id === user._id) {
//         const newUser = {
//           ...user,
//           instructorRequestStatus: updatedUser.instructorRequestStatus,
//           rejectionReason: updatedUser.rejectionReason,
//           ...(updatedUser.instructorRequestStatus === "approved" && { role: "instructor" }),
//         };
//         localStorage.setItem("user", JSON.stringify(newUser));
//         setRequestStatus(updatedUser.instructorRequestStatus);
//         setUser(newUser);
//       }
//     });

//     socket.on("paymentCompleted", ({ courseId }) => {
//       setCourses((prev) =>
//         prev.map((c) =>
//           String(c._id) === String(courseId)
//             ? { ...c, enrollment: { payment: { status: "completed" } }, hasAccess: true }
//             : c
//         )
//       );
//       showToast("Fawry Code Generated Successfully", "success");
//     });

//     socket.on("enrollmentUpdated", ({ courseId, status }) => {
//       if (status === "accepted") {
//         setCourses((prev) =>
//           prev.map((c) =>
//             String(c._id) === String(courseId)
//               ? { ...c, hasAccess: true }
//               : c
//           )
//         );
//         showToast("Your enrollment was accepted! 🎉", "success");
//       }
//     });

//     return () => {
//       socket.off("connect");
//       socket.off("courseUpdated");
//       socket.off("course:deleted");
//       socket.off("instructorRequestUpdated");
//       socket.off("paymentCompleted");
//       socket.off("enrollmentUpdated");
//     };
//   }, [user?._id]);

//   // ================= REQUEST =================
//   const handleSubmitRequest = async (e) => {
//     e.preventDefault();
//     if (!file) {
//       showToast("Please upload your ID image", "error");
//       return;
//     }

//     try {
//       setIsSubmitting(true);
//       const formData = new FormData();
//       formData.append("file", file);
//       formData.append("fullName", fullName);

//       await axios.post("/auth/request-instructor", formData);
//       socket.emit("instructorRequest:new");
//       showToast("Request sent successfully", "success");

//       const updatedUser = { ...user, instructorRequestStatus: "pending" };
//       localStorage.setItem("user", JSON.stringify(updatedUser));
//       setRequestStatus("pending");
//       setShowForm(false);
//       setFile(null);
//       setFullName("");
//     } catch (err) {
//       console.error(err);
//       showToast("Something went wrong", "error");
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   // ================= DELETE COURSE =================
//   const handleDeleteCourse = async () => {
//     try {
//       await axios.delete(`/courses/${courseToDelete}`);
//       setCourses((prev) => prev.filter((c) => c._id !== courseToDelete));
//       setCourseToDelete(null);
//       showToast("Course deleted successfully 🗑️", "success");
//     } catch (err) {
//       showToast(err.response?.data?.message || "Something went wrong", "error");
//     }
//   };

//   const filteredCourses = courses
//     .filter((course) => {
//       if (showMyCourses) {
//         return (
//           user?.role === "instructor" &&
//           course.instructor &&
//           String(user._id) === String(course.instructor._id)
//         );
//       }
//       return true;
//     })
//     .filter((course) => {
//       if (courseFilter === "free") return course.price === 0;
//       if (courseFilter === "paid") return course.price > 0;
//       return true;
//     });

//   return (
//     <div className="min-h-screen text-white bg-gradient-to-br from-gray-900 via-gray-950 to-black">
//       <Navbar />

//       {/* ================= TOAST ================= */}
//       {toast.show && (
//         <div className="fixed top-5 right-5 z-50">
//           <div
//             className={`min-w-[280px] px-4 py-3 rounded-xl shadow-lg text-sm font-medium ${
//               toast.type === "error" ? "bg-red-600/90" : "bg-green-600/90"
//             }`}
//           >
//             {toast.message}
//           </div>
//         </div>
//       )}

//       <div className="p-8">
//         <h2 className="text-4xl font-extrabold mb-8">
//           Welcome Back <span className="text-purple-400">{user?.name || ""}</span>{" "}
//           <span className="wave">👋</span>
//         </h2>

//         {user?.role === "instructor" && (
//           <div className="mb-6 flex gap-3">
//             <button
//               onClick={() => navigate("/create-course")}
//               className="bg-green-600 px-6 py-3 rounded-xl font-bold hover:scale-105 transition"
//             >
//               ➕ Create Course
//             </button>

//             <button
//               onClick={() => setShowMyCourses(!showMyCourses)}
//               className="bg-blue-600 px-6 py-3 rounded-xl font-bold hover:scale-105 transition"
//             >
//               {showMyCourses ? "🌍 Show All Courses" : "📚 My Courses Only"}
//             </button>
//           </div>
//         )}

//         {/* ================= UPGRADE ================= */}
//         {user?.role === "student" && (
//           <div className="mb-6">
//             {requestStatus === "none" && (
//               <button
//                 onClick={() => setShowForm(true)}
//                 disabled={isSubmitting}
//                 className="bg-gradient-to-r from-purple-600 to-pink-600 px-6 py-3 rounded-xl font-bold shadow-lg hover:scale-105 transition"
//               >
//                 🚀 Upgrade to Instructor
//               </button>
//             )}

//             {requestStatus === "pending" && (
//               <div className="flex items-center gap-2 text-yellow-400 animate-pulse">
//                 ⏳ <span>Request pending...</span>
//               </div>
//             )}

//             {requestStatus === "rejected" && (
//               <div className="bg-red-900/30 border border-red-500 p-4 rounded-xl mt-2 animate-fadeIn space-y-3">
//                 <div className="flex items-center gap-2 text-red-400 font-bold">
//                   ❌ <span>Your request was rejected</span>
//                 </div>

//                 {user?.rejectionReason && (
//                   <div className="bg-gray-800 p-3 rounded-lg text-sm text-gray-300">
//                     <span className="text-red-400 font-semibold">Reason:</span>{" "}
//                     {user.rejectionReason}
//                   </div>
//                 )}

//                 <button
//                   onClick={() => setShowForm(true)}
//                   className="bg-gradient-to-r from-red-600 to-orange-500 px-5 py-2 rounded-lg font-bold hover:scale-105 transition"
//                 >
//                   🔁 Request Again
//                 </button>

//                 <button
//                   onClick={async () => {
//                     try {
//                       await axios.patch("/users/instructor/cancel-request");
//                       const updatedUser = {
//                         ...user,
//                         instructorRequestStatus: "none",
//                         rejectionReason: null,
//                       };
//                       localStorage.setItem("user", JSON.stringify(updatedUser));
//                       setUser(updatedUser);
//                       setRequestStatus("none");
//                       showToast("Continuing as student", "success");
//                     } catch (err) {
//                       showToast(err.response?.data?.message || "Something went wrong", "error");
//                     }
//                   }}
//                   className="bg-gray-700 hover:bg-gray-600 px-5 py-2 rounded-lg font-bold transition ms-3"
//                 >
//                   👨‍🎓 Continue as Student
//                 </button>
//               </div>
//             )}
//           </div>
//         )}

//         {/* ================= FORM ================= */}
//         {showForm && (
//           <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-[10000]">
//             <form
//               onSubmit={handleSubmitRequest}
//               className="bg-gray-900 p-6 rounded-lg w-96"
//             >
//               <h2 className="text-xl mb-4">Instructor Request</h2>

//               <input
//                 type="text"
//                 placeholder="Full Name"
//                 className="w-full p-2 mb-3 bg-gray-800 rounded"
//                 value={fullName}
//                 onChange={(e) => setFullName(e.target.value)}
//               />

//               <div
//                 onClick={() => fileInputRef.current.click()}
//                 onDragOver={(e) => e.preventDefault()}
//                 onDrop={(e) => {
//                   e.preventDefault();
//                   handleFileChange(e.dataTransfer.files[0]);
//                 }}
//                 className="border-2 border-dashed border-gray-600 rounded-lg p-6 text-center cursor-pointer"
//               >
//                 <input
//                   ref={fileInputRef}
//                   type="file"
//                   accept="image/*"
//                   className="hidden"
//                   onChange={(e) => handleFileChange(e.target.files[0])}
//                 />

//                 <p className="text-gray-400 text-sm">
//                   Drag & drop or click to upload ID image
//                 </p>

//                 {file && (
//                   <>
//                     <p className="text-green-400 text-sm mt-2">{file.name}</p>
//                     <img
//                       src={URL.createObjectURL(file)}
//                       className="mt-2 h-32 w-full object-cover rounded"
//                     />
//                   </>
//                 )}
//               </div>

//               <div className="flex gap-2 mt-4">
//                 <button
//                   type="submit"
//                   disabled={isSubmitting}
//                   className="bg-green-600 px-4 py-2 rounded"
//                 >
//                   {isSubmitting ? "Submitting..." : "Submit"}
//                 </button>

//                 <button
//                   type="button"
//                   onClick={() => setShowForm(false)}
//                   className="bg-red-600 px-4 py-2 rounded"
//                 >
//                   Cancel
//                 </button>
//               </div>
//             </form>
//           </div>
//         )}

//         {/* ================= COURSES ================= */}
//         <h3 className="text-2xl font-bold mt-12 mb-6">
//           {user?.role === "student" && (
//             <div className="flex gap-2 mb-4">
//               <button
//                 onClick={() => setCourseFilter("all")}
//                 className={`px-3 py-1 text-sm rounded-md font-semibold transition ${
//                   courseFilter === "all" ? "bg-purple-600" : "bg-gray-700 hover:bg-gray-600"
//                 }`}
//               >
//                 🌍 All
//               </button>

//               <button
//                 onClick={() => setCourseFilter("free")}
//                 className={`px-3 py-1 text-sm rounded-md font-semibold transition ${
//                   courseFilter === "free" ? "bg-green-600" : "bg-gray-700 hover:bg-gray-600"
//                 }`}
//               >
//                 🆓 Free
//               </button>

//               <button
//                 onClick={() => setCourseFilter("paid")}
//                 className={`px-3 py-1 text-sm rounded-md font-semibold transition ${
//                   courseFilter === "paid" ? "bg-yellow-600" : "bg-gray-700 hover:bg-gray-600"
//                 }`}
//               >
//                 💰 Paid
//               </button>
//             </div>
//           )}
//         </h3>

//         {loading ? (
//   <div className="flex flex-col items-center justify-center h-60 gap-4">
//     <div className="relative w-16 h-16">
//       <div className="absolute inset-0 rounded-full border-4 border-gray-700"></div>
//       <div className="absolute inset-0 rounded-full border-4 border-t-blue-500 border-r-transparent border-b-transparent border-l-transparent animate-spin"></div>
//       <div
//         className="absolute inset-2 rounded-full border-4 border-t-purple-500 border-r-transparent border-b-transparent border-l-transparent animate-spin"
//         style={{ animationDirection: "reverse", animationDuration: "0.8s" }}
//       ></div>
//     </div>
//     <div className="flex flex-col items-center gap-1">
//       <p className="text-white font-semibold text-lg">Loading Courses</p>
//       <p className="text-gray-400 text-sm">Please wait...</p>
//     </div>
//     <div className="flex gap-1.5">
//       <div className="w-2 h-2 rounded-full bg-blue-500 animate-bounce" style={{ animationDelay: "0ms" }}></div>
//       <div className="w-2 h-2 rounded-full bg-purple-500 animate-bounce" style={{ animationDelay: "150ms" }}></div>
//       <div className="w-2 h-2 rounded-full bg-pink-500 animate-bounce" style={{ animationDelay: "300ms" }}></div>
//     </div>
//   </div>
// ) : (
//   <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
//     {filteredCourses.map((course) => {
//       const locked =
//         course.price > 0 &&
//         !(
//           course.enrollment?.payment?.status === "paid" ||
//           course.enrollment?.payment?.status === "completed"
//         );

//       const isCourseOwner =
//         user?.role === "instructor" &&
//         course.instructor &&
//         String(user._id) === String(course.instructor._id);

//       return (
//         <div key={course._id} className="relative group">
//           <CourseCard course={course} hasAccess={!locked} user={user} />

//           {isCourseOwner && (
//             <div className="absolute top-2 right-2 flex flex-col gap-1.5 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-2 group-hover:translate-x-0">

//               {/* ✏️ Edit */}
//               <button
//                 onClick={(e) => {
//                   e.stopPropagation();
//                   navigate(`/edit-course/${course._id}`);
//                 }}
//                 title="Edit Course"
//                 className="w-9 h-9 flex items-center justify-center rounded-full bg-blue-600/80 hover:bg-blue-600 backdrop-blur-sm shadow-lg hover:scale-110 transition-all duration-200"
//               >
//                 ✏️
//               </button>

//               {/* 👥 Enrollments */}
//               <button
//                 onClick={(e) => {
//                   e.stopPropagation();
//                   navigate(`/enrollments/course/${course._id}/enrollments`);
//                 }}
//                 title="View Enrollments"
//                 className="w-9 h-9 flex items-center justify-center rounded-full bg-purple-600/80 hover:bg-purple-600 backdrop-blur-sm shadow-lg hover:scale-110 transition-all duration-200"
//               >
//                 👥
//               </button>

//               {/* 🗑️ Delete */}
//               <button
//                 onClick={(e) => {
//                   e.stopPropagation();
//                   setCourseToDelete(course._id);
//                 }}
//                 title="Delete Course"
//                 className="w-9 h-9 flex items-center justify-center rounded-full bg-red-600/80 hover:bg-red-600 backdrop-blur-sm shadow-lg hover:scale-110 transition-all duration-200"
//               >
//                 🗑️
//               </button>

//             </div>
//           )}
//         </div>
//       );
//     })}
//   </div>
// )}
//       </div>

//       {/* ================= DELETE MODAL ================= */}
//       {courseToDelete && (
//         <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-[10000]">
//           <div className="bg-gray-900 p-6 rounded-xl w-96 text-center">
//             <div className="text-5xl mb-4">🗑️</div>
//             <h2 className="text-xl font-bold mb-2 text-red-400">Delete Course</h2>
//             <p className="text-gray-400 mb-6">
//               Are you sure? This will delete the course and all its lessons, quizzes, and enrollments.
//             </p>

//             <div className="flex gap-3">
//               <button
//                 onClick={() => setCourseToDelete(null)}
//                 className="flex-1 bg-gray-700 hover:bg-gray-600 py-2 rounded-lg transition"
//               >
//                 Cancel
//               </button>

//               <button
//                 onClick={handleDeleteCourse}
//                 className="flex-1 bg-red-600 hover:bg-red-700 py-2 rounded-lg font-bold transition"
//               >
//                 Delete 🗑️
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }







































import { useEffect, useState, useRef, useMemo } from "react";
import Navbar from "../components/Navbar";
import CourseCard from "../components/CourseCard";
import { useNavigate } from "react-router-dom";
import axios from "../api/axios";
import socket from "../socket";
import { Spinner } from "../components/Spinner";
import { useAuth } from "../context/AuthContext";
export default function Dashboard() {
  const [courses, setCourses] = useState([]);
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showMyCourses, setShowMyCourses] = useState(false);
  const [courseToDelete, setCourseToDelete] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [file, setFile] = useState(null);
  const [fullName, setFullName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [courseFilter, setCourseFilter] = useState("all");
  const [toast, setToast] = useState({ show: false, message: "", type: "" });

  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const token = localStorage.getItem("token") || "";
  useEffect(() => {
  axios.get("/").catch(() => {});
}, []);

const { user, setUser } = useAuth();

  const [requestStatus, setRequestStatus] = useState(
    user?.instructorRequestStatus || "none"
  );

  const showToast = (message, type = "success") => {
    setToast({ show: true, message, type });
    setTimeout(() => {
      setToast({ show: false, message: "", type: "" });
    }, 2500);
  };

  // ================= FILE VALIDATION =================
  const handleFileChange = (selectedFile) => {
    if (!selectedFile) return;

    if (!selectedFile.type.startsWith("image/")) {
      showToast("Only image files are allowed", "error");
      return;
    }

    const maxSize = 2 * 1024 * 1024;
    if (selectedFile.size > maxSize) {
      showToast("Image must be less than 2MB", "error");
      return;
    }

    setFile(selectedFile);
  };

  // ================= FETCH COURSES =================
  useEffect(() => {
    if (!token) {
      setLoading(false);
      return;
    }

    const fetchCourses = async () => {
      try {
        setLoading(true);
        const res = await axios.get("/courses");
        setCourses(Array.isArray(res.data?.data) ? res.data.data : []);
      } catch (error) {
        console.error("Fetch error:", error);

        if (error.response?.status === 401) {
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          navigate("/login", { replace: true });
          return;
        }

        setCourses([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, [navigate, token]);

  // ================= SOCKET =================
  useEffect(() => {
    if (!user?._id) return;

    socket.emit("joinUserRoom", user._id);

    const handleConnect = () => {
      socket.emit("joinUserRoom", user._id);
    };

    const handleCourseUpdated = (updatedCourse) => {
      setCourses((prev) =>
        prev.map((c) => (c._id === updatedCourse._id ? updatedCourse : c))
      );
    };

    const handleCourseDeleted = ({ courseId }) => {
      setCourses((prev) =>
        prev.filter((c) => String(c._id) !== String(courseId))
      );
    };

    const handleInstructorRequestUpdated = (updatedUser) => {
      if (updatedUser._id === user._id) {
        const newUser = {
          ...user,
          instructorRequestStatus: updatedUser.instructorRequestStatus,
          rejectionReason: updatedUser.rejectionReason,
          ...(updatedUser.instructorRequestStatus === "approved" && {
            role: "instructor",
          }),
        };

        localStorage.setItem("user", JSON.stringify(newUser));
        setRequestStatus(updatedUser.instructorRequestStatus);
        setUser(newUser);
      }
    };

    const handlePaymentCompleted = ({ courseId }) => {
      setCourses((prev) =>
        prev.map((c) =>
          String(c._id) === String(courseId)
            ? {
                ...c,
                enrollment: { payment: { status: "completed" } },
                hasAccess: true,
              }
            : c
        )
      );
      showToast("Fawry code generated successfully", "success");
    };

    const handleEnrollmentUpdated = ({ courseId, status }) => {
      if (status === "accepted") {
        setCourses((prev) =>
          prev.map((c) =>
            String(c._id) === String(courseId)
              ? { ...c, hasAccess: true }
              : c
          )
        );
        showToast("Your enrollment was accepted! 🎉", "success");
      }
    };

    socket.on("connect", handleConnect);
    socket.on("courseUpdated", handleCourseUpdated);
    socket.on("course:deleted", handleCourseDeleted);
    socket.on("instructorRequestUpdated", handleInstructorRequestUpdated);
    socket.on("paymentCompleted", handlePaymentCompleted);
    socket.on("enrollmentUpdated", handleEnrollmentUpdated);

    return () => {
      socket.off("connect", handleConnect);
      socket.off("courseUpdated", handleCourseUpdated);
      socket.off("course:deleted", handleCourseDeleted);
      socket.off("instructorRequestUpdated", handleInstructorRequestUpdated);
      socket.off("paymentCompleted", handlePaymentCompleted);
      socket.off("enrollmentUpdated", handleEnrollmentUpdated);
    };
  }, [user?._id]);

  // ================= REQUEST =================
  const handleSubmitRequest = async (e) => {
    e.preventDefault();

    if (!fullName.trim()) {
      showToast("Please enter your full name", "error");
      return;
    }

    if (!file) {
      showToast("Please upload your ID image", "error");
      return;
    }

    try {
  setIsSubmitting(true);

  const formData = new FormData();
  formData.append("file", file);
  formData.append("fullName", fullName.trim());

  await axios.post("/auth/request-instructor", formData);

  showToast("Request sent successfully", "success");

  setUser({ ...user, instructorRequestStatus: "pending" });
  setRequestStatus("pending");
  setShowForm(false);
  setFile(null);
  setFullName("");
} catch (err) {
  console.error(err);
  showToast(err.response?.data?.message || "Something went wrong", "error");
} finally {
  setIsSubmitting(false);
}
  };

  // ================= DELETE COURSE =================
  const handleDeleteCourse = async () => {
    try {
      await axios.delete(`/courses/${courseToDelete}`);
      setCourses((prev) => prev.filter((c) => c._id !== courseToDelete));
      setCourseToDelete(null);
      showToast("Course deleted successfully 🗑️", "success");
    } catch (err) {
      showToast(
        err.response?.data?.message || "Something went wrong",
        "error"
      );
    }
  };

  const filteredCourses = useMemo(() => {
    return courses
      .filter((course) => {
        if (showMyCourses) {
          return (
            user?.role === "instructor" &&
            course.instructor &&
            String(user?._id) ===
              String(course.instructor?._id || course.instructor)
          );
        }
        return true;
      })
      .filter((course) => {
        if (courseFilter === "free") return Number(course.price) === 0;
        if (courseFilter === "paid") return Number(course.price) > 0;
        return true;
      });
  }, [courses, showMyCourses, courseFilter, user]);

  const myCoursesCount = courses.filter(
    (course) =>
      user?.role === "instructor" &&
      course.instructor &&
      String(user?._id) === String(course.instructor?._id || course.instructor)
  ).length;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors duration-300">
      <Navbar />

      {/* Toast */}
      {toast.show && (
        <div className="fixed top-5 right-5 z-[10000]">
          <div
            className={`
              min-w-[280px] px-4 py-3 rounded-2xl shadow-xl text-sm font-medium
              border
              ${
                toast.type === "error"
                  ? "bg-red-600 text-white border-red-500"
                  : "bg-emerald-600 text-white border-emerald-500"
              }
            `}
          >
            {toast.message}
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 md:px-6 py-8">
        {/* Welcome Section */}
        <div
          className="
            rounded-3xl border border-gray-200 dark:border-gray-800
            bg-white dark:bg-gray-900
            shadow-sm
            p-6 md:p-8 mb-8
          "
        >
          <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-6">
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
                Dashboard
              </div>

              <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-gray-900 dark:text-gray-100">
                Welcome Back{" "}
                <span className="text-purple-600 dark:text-purple-400">
                  {user?.name || "User"}
                </span>{" "}
                <span className="inline-block animate-bounce">👋</span>
              </h2>

              <p className="mt-3 text-sm md:text-base text-gray-500 dark:text-gray-400 max-w-2xl">
                Browse courses, manage your learning, and access everything from
                one place.
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 min-w-fit">
              <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50 p-4">
                <p className="text-xs text-gray-400 dark:text-gray-500">
                  Total Courses
                </p>
                <p className="mt-2 text-2xl font-bold text-gray-900 dark:text-gray-100">
                  {courses.length}
                </p>
              </div>

              <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50 p-4">
                <p className="text-xs text-gray-400 dark:text-gray-500">
                  My Courses
                </p>
                <p className="mt-2 text-2xl font-bold text-blue-600 dark:text-blue-400">
                  {myCoursesCount}
                </p>
              </div>

              <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50 p-4 col-span-2 md:col-span-1">
                <p className="text-xs text-gray-400 dark:text-gray-500">
                  Role
                </p>
                <p className="mt-2 text-lg font-bold capitalize text-emerald-600 dark:text-emerald-400">
                  {user?.role || "student"}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Instructor Actions */}
        {user?.role === "instructor" && (
          <div className="mb-8 flex flex-wrap gap-3">
            <button
              onClick={() => navigate("/create-course")}
              className="
                inline-flex items-center gap-2
                px-5 py-3 rounded-2xl
                bg-emerald-600 hover:bg-emerald-500
                text-white font-semibold
                shadow-md hover:shadow-emerald-500/25
                transition-all duration-200 hover:scale-[1.02]
              "
            >
              <span>➕</span>
              Create Course
            </button>

            <button
              onClick={() => setShowMyCourses(!showMyCourses)}
              className="
                inline-flex items-center gap-2
                px-5 py-3 rounded-2xl
                bg-blue-600 hover:bg-blue-500
                text-white font-semibold
                shadow-md hover:shadow-blue-500/25
                transition-all duration-200 hover:scale-[1.02]
              "
            >
              {showMyCourses ? "🌍 Show All Courses" : "📚 My Courses Only"}
            </button>
          </div>
        )}

        {/* Student Upgrade Section */}
        {user?.role === "student" && (
          <div className="mb-8">
            {requestStatus === "none" && (
              <button
                onClick={() => setShowForm(true)}
                disabled={isSubmitting}
                className="
                  inline-flex items-center gap-2
                  px-6 py-3 rounded-2xl
                  bg-gradient-to-r from-purple-600 to-pink-600
                  text-white font-bold
                  shadow-lg hover:scale-[1.02]
                  transition-all duration-200
                "
              >
                🚀 Upgrade to Instructor
              </button>
            )}

            {requestStatus === "pending" && (
              <div
                className="
                  inline-flex items-center gap-2
                  px-4 py-3 rounded-2xl
                  bg-amber-50 dark:bg-amber-500/10
                  border border-amber-100 dark:border-amber-500/20
                  text-amber-600 dark:text-amber-400
                  font-medium animate-pulse
                "
              >
                ⏳ <span>Request pending...</span>
              </div>
            )}

            {requestStatus === "rejected" && (
              <div
                className="
                  rounded-3xl border border-red-200 dark:border-red-500/20
                  bg-red-50 dark:bg-red-500/10
                  p-5 animate-fadeIn space-y-4
                "
              >
                <div className="flex items-center gap-2 text-red-600 dark:text-red-400 font-bold">
                  ❌ <span>Your request was rejected</span>
                </div>

                {user?.rejectionReason && (
                  <div className="rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-4 text-sm text-gray-700 dark:text-gray-300">
                    <span className="text-red-500 font-semibold">Reason:</span>{" "}
                    {user.rejectionReason}
                  </div>
                )}

                <div className="flex flex-wrap gap-3">
                  <button
                    onClick={() => setShowForm(true)}
                    className="
                      px-5 py-2.5 rounded-2xl
                      bg-gradient-to-r from-red-600 to-orange-500
                      text-white font-bold
                      hover:scale-[1.02] transition-all duration-200
                    "
                  >
                    🔁 Request Again
                  </button>

                  <button
                    onClick={async () => {
                      try {
                        await axios.patch("/users/instructor/cancel-request");

                        const updatedUser = {
                          ...user,
                          instructorRequestStatus: "none",
                          rejectionReason: null,
                        };

                       localStorage.setItem("user", JSON.stringify(newUser));
setUser(newUser);
                        setRequestStatus("none");
                        showToast("Continuing as student", "success");
                      } catch (err) {
                        showToast(
                          err.response?.data?.message || "Something went wrong",
                          "error"
                        );
                      }
                    }}
                    className="
                      px-5 py-2.5 rounded-2xl
                      bg-gray-100 hover:bg-gray-200
                      dark:bg-gray-800 dark:hover:bg-gray-700
                      text-gray-700 dark:text-gray-200
                      border border-gray-200 dark:border-gray-700
                      font-semibold transition-all duration-200
                    "
                  >
                    👨‍🎓 Continue as Student
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Courses Header / Filters */}
        <div className="mb-6 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              {showMyCourses ? "My Courses" : "Available Courses"}
            </h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              {filteredCourses.length} course
              {filteredCourses.length !== 1 ? "s" : ""} found
            </p>
          </div>

          {user?.role === "student" && (
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setCourseFilter("all")}
                className={`px-4 py-2 text-sm rounded-2xl font-semibold transition-all duration-200 ${
                  courseFilter === "all"
                    ? "bg-purple-600 text-white shadow-md shadow-purple-500/20"
                    : "bg-white hover:bg-gray-100 dark:bg-gray-900 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-gray-800"
                }`}
              >
                🌍 All
              </button>

              <button
                onClick={() => setCourseFilter("free")}
                className={`px-4 py-2 text-sm rounded-2xl font-semibold transition-all duration-200 ${
                  courseFilter === "free"
                    ? "bg-emerald-600 text-white shadow-md shadow-emerald-500/20"
                    : "bg-white hover:bg-gray-100 dark:bg-gray-900 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-gray-800"
                }`}
              >
                🆓 Free
              </button>

              <button
                onClick={() => setCourseFilter("paid")}
                className={`px-4 py-2 text-sm rounded-2xl font-semibold transition-all duration-200 ${
                  courseFilter === "paid"
                    ? "bg-amber-600 text-white shadow-md shadow-amber-500/20"
                    : "bg-white hover:bg-gray-100 dark:bg-gray-900 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-gray-800"
                }`}
              >
                💰 Paid
              </button>
            </div>
          )}
        </div>

        {/* Courses Content */}
        {loading ? (
          <div
            className="
              rounded-3xl border border-gray-200 dark:border-gray-800
              bg-white dark:bg-gray-900
              p-12 shadow-sm
            "
          >
            <div className="flex flex-col items-center justify-center gap-4 min-h-[280px]">
              <Spinner size="lg" variant="primary" />
              <div className="flex flex-col items-center gap-1">
                <p className="font-semibold text-lg text-gray-900 dark:text-gray-100">
                  Loading Courses
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Please wait...
                </p>
              </div>
            </div>
          </div>
        ) : filteredCourses.length === 0 ? (
          <div
            className="
              rounded-3xl border border-dashed border-gray-300 dark:border-gray-700
              bg-white dark:bg-gray-900
              p-12 text-center shadow-sm
            "
          >
            <div className="text-5xl mb-4">📚</div>
            <h4 className="text-xl font-bold text-gray-900 dark:text-gray-100">
              No courses found
            </h4>
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
              Try changing your filters or create a new course.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-5">
            {filteredCourses.map((course) => {
              const locked =
                Number(course.price) > 0 &&
                !(
                  course.enrollment?.payment?.status === "paid" ||
                  course.enrollment?.payment?.status === "completed"
                );

              const isCourseOwner =
                user?.role === "instructor" &&
                course.instructor &&
                String(user?._id) ===
                  String(course.instructor?._id || course.instructor);

              return (
                <div key={course._id} className="relative group">
                  <CourseCard course={course} hasAccess={!locked} user={user} />

                  {isCourseOwner && (
                    <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-2 group-hover:translate-x-0">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/edit-course/${course._id}`);
                        }}
                        title="Edit Course"
                        className="
                          w-10 h-10 flex items-center justify-center rounded-2xl
                          bg-blue-600/90 hover:bg-blue-600 text-white
                          backdrop-blur-sm shadow-lg hover:scale-110
                          transition-all duration-200
                        "
                      >
                        ✏️
                      </button>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/enrollments/course/${course._id}/enrollments`);
                        }}
                        title="View Enrollments"
                        className="
                          w-10 h-10 flex items-center justify-center rounded-2xl
                          bg-purple-600/90 hover:bg-purple-600 text-white
                          backdrop-blur-sm shadow-lg hover:scale-110
                          transition-all duration-200
                        "
                      >
                        👥
                      </button>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setCourseToDelete(course._id);
                        }}
                        title="Delete Course"
                        className="
                          w-10 h-10 flex items-center justify-center rounded-2xl
                          bg-red-600/90 hover:bg-red-600 text-white
                          backdrop-blur-sm shadow-lg hover:scale-110
                          transition-all duration-200
                        "
                      >
                        🗑️
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Instructor Request Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[10000] px-4">
          <form
            onSubmit={handleSubmitRequest}
            className="
              w-full max-w-md
              rounded-3xl border border-gray-200 dark:border-gray-800
              bg-white dark:bg-gray-900
              shadow-2xl
              overflow-hidden
              animate-fadeIn
            "
          >
            <div className="px-6 py-5 border-b border-gray-200 dark:border-gray-800">
              <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                Instructor Request
              </h2>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Submit your full name and ID image for review.
              </p>
            </div>

            <div className="p-6">
              <input
                type="text"
                placeholder="Full Name"
                className="
                  w-full h-12 px-4 mb-4 rounded-2xl
                  border border-gray-200 dark:border-gray-700
                  bg-gray-50 dark:bg-gray-800
                  text-gray-900 dark:text-gray-100
                  placeholder:text-gray-400 dark:placeholder:text-gray-500
                  focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500
                "
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
              />

              <div
                onClick={() => fileInputRef.current?.click()}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  e.preventDefault();
                  handleFileChange(e.dataTransfer.files[0]);
                }}
                className="
                  border-2 border-dashed border-gray-300 dark:border-gray-700
                  rounded-3xl p-6 text-center cursor-pointer
                  bg-gray-50 dark:bg-gray-800/50
                  hover:bg-gray-100 dark:hover:bg-gray-800
                  transition-all duration-200
                "
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => handleFileChange(e.target.files[0])}
                />

                {!file ? (
                  <div>
                    <div className="text-4xl mb-3">🪪</div>
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-200">
                      Drag & drop or click to upload ID image
                    </p>
                    <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                      Max size 2MB
                    </p>
                  </div>
                ) : (
                  <>
                    <p className="text-emerald-600 dark:text-emerald-400 text-sm font-medium">
                      {file.name}
                    </p>
                    <img
                      src={URL.createObjectURL(file)}
                      alt="Preview"
                      className="mt-4 h-40 w-full object-cover rounded-2xl border border-gray-200 dark:border-gray-700"
                    />
                  </>
                )}
              </div>

              <div className="flex gap-3 mt-5">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`
                    flex-1 h-11 rounded-2xl font-semibold text-white transition-all duration-200
                    ${
                      isSubmitting
                        ? "bg-gray-400 dark:bg-gray-700 cursor-not-allowed"
                        : "bg-emerald-600 hover:bg-emerald-500"
                    }
                  `}
                >
                  {isSubmitting ? "Submitting..." : "Submit"}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    setFile(null);
                    setFullName("");
                  }}
                  className="
                    flex-1 h-11 rounded-2xl font-semibold
                    bg-gray-100 hover:bg-gray-200
                    dark:bg-gray-800 dark:hover:bg-gray-700
                    text-gray-700 dark:text-gray-200
                    border border-gray-200 dark:border-gray-700
                    transition-all duration-200
                  "
                >
                  Cancel
                </button>
              </div>
            </div>
          </form>
        </div>
      )}

      {/* Delete Modal */}
      {courseToDelete && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[10000] px-4">
          <div
            className="
              w-full max-w-md
              rounded-3xl border border-gray-200 dark:border-gray-800
              bg-white dark:bg-gray-900
              shadow-2xl
              p-6 text-center animate-fadeIn
            "
          >
            <div className="text-5xl mb-4">🗑️</div>

            <h2 className="text-xl font-bold mb-2 text-red-600 dark:text-red-400">
              Delete Course
            </h2>

            <p className="text-gray-500 dark:text-gray-400 mb-6 leading-relaxed">
              Are you sure? This will delete the course and all its lessons,
              quizzes, and enrollments.
            </p>

            <div className="flex gap-3">
              <button
                onClick={() => setCourseToDelete(null)}
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
                onClick={handleDeleteCourse}
                className="
                  flex-1 h-11 rounded-2xl
                  bg-red-600 hover:bg-red-500
                  text-white font-bold transition-all duration-200
                "
              >
                Delete 🗑️
              </button>
              
            </div>
          </div>
        </div>
      )}

      
    </div>

    
  );
}