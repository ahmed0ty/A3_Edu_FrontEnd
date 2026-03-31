// import { useNavigate } from "react-router-dom";
// import { useState } from "react";
// import toast from "react-hot-toast";
// import FawryModal from "../components/FawryModal";

// export default function CourseCard({ course, user }) {
//   const navigate = useNavigate();

//   const [loading, setLoading] = useState(false);
//   const [showModal, setShowModal] = useState(false);
//   const [referenceNumber, setReferenceNumber] = useState("");

//   // ================= INSTRUCTOR =================
//   const isInstructor =
//     user &&
//     course.instructor &&
//     String(course.instructor._id) === String(user._id);

//   // ================= LOCK (FIXED RULE) =================
//   const locked = Number(course.price) > 0 && !isInstructor;

//   // ================= PAYMENT =================
//   const handlePayNow = async (e) => {
//     e.stopPropagation();

//     if (!user) return toast.error("Please login first.");

//     try {
//       setLoading(true);

//       const res = await fetch(
//         "http://localhost:3000/enrollments/pay-with-fawry",
//         {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${localStorage.getItem("token")}`,
//           },
//           body: JSON.stringify({
//             courseId: course._id,
//           }),
//         }
//       );

//       const data = await res.json();

//       if (!res.ok) {
//         throw new Error(data.message || "Payment failed");
//       }

//       setReferenceNumber(data.referenceNumber);
//       setShowModal(true);

//       toast.success("Fawry code generated ✅");

//     } catch (err) {
//       console.error(err);
//       toast.error(err.message || "Payment failed ❌");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <>
//       {/* ================= MODAL ================= */}
//       <FawryModal
//         isOpen={showModal}
//         onClose={() => setShowModal(false)}
//         referenceNumber={referenceNumber}
//       />

//       {/* ================= CARD ================= */}
//       <div
//         onClick={() => {
//           if (locked) return;
//           navigate(`/course/${course._id}`);
//         }}
//         className="relative bg-gray-800 rounded-2xl overflow-hidden shadow-lg hover:scale-105 hover:shadow-blue-500/30 transition duration-300 cursor-pointer group"
//       >
//         {/* 🔒 LOCK */}
//         {locked && (
//           <div className="absolute top-3 right-3 bg-black/60 p-2 rounded-full z-10 shadow-lg">
//             <span className="text-yellow-400 text-lg font-bold">🔒</span>
//           </div>
//         )}

//         {/* IMAGE */}
//         <div className="h-44 bg-gray-700 overflow-hidden rounded-t-2xl">
//           <img
//             src={course.thumbnail || "https://picsum.photos/300"}
//             alt={course?.title}
//             className="w-full h-full object-cover group-hover:scale-110 transition duration-500"
//           />
//         </div>

//         {/* CONTENT */}
//         <div className="p-5">
//           <h3 className="text-lg font-bold group-hover:text-blue-400 transition">
//             {course?.title}
//           </h3>

//           <p className="text-gray-400 text-sm mt-2 line-clamp-2">
//             {course?.description}
//           </p>

//           {/* 💰 PRICE */}
//           <p className="text-green-400 font-bold mt-2">
//             {Number(course?.price) > 0
//               ? `Price: ${course.price} EGP`
//               : "Free"}
//           </p>

//           <p className="text-blue-300 font-semibold mt-1">
//             Instructor: {course.instructor?.name || "Not provided"}
//           </p>

//           {/* ACTIONS */}
//           <div className="flex gap-2 mt-4 flex-col">
//             {!locked ? (
//               <>
//                 <button
//                   onClick={(e) => {
//                     e.stopPropagation();
//                     navigate(`/course/${course._id}`);
//                   }}
//                   className="w-full bg-blue-600 py-2 rounded-lg hover:bg-blue-700 transition"
//                 >
//                   Open 🚀
//                 </button>

//                 <button
//                   onClick={(e) => {
//                     e.stopPropagation();
//                     navigate(`/course/${course._id}/quizzes`);
//                   }}
//                   className="w-full bg-purple-600 py-2 rounded-lg hover:bg-purple-700 transition"
//                 >
//                   Quizzes 🧠
//                 </button>
//               </>
//             ) : (
//               <button
//                 onClick={handlePayNow}
//                 disabled={loading}
//                 className="w-full bg-yellow-500 py-2 rounded-lg font-bold hover:bg-yellow-600 transition disabled:opacity-50"
//               >
//                 {loading ? "Processing..." : "Pay Now 💳"}
//               </button>
//             )}
//           </div>
//         </div>
//       </div>
//     </>
//   );
// }








// import { useNavigate } from "react-router-dom";
// import { useState } from "react";
// import toast from "react-hot-toast";
// import FawryModal from "../components/FawryModal";
// import api from "../api/axios"; // ✅

// export default function CourseCard({ course, user }) {
//   const navigate = useNavigate();
//   const [loading, setLoading] = useState(false);
//   const [showModal, setShowModal] = useState(false);
//   const [referenceNumber, setReferenceNumber] = useState("");

//   const isInstructor =
//     user &&
//     course.instructor &&
//     String(course.instructor._id) === String(user._id);

//   const locked = Number(course.price) > 0 && !isInstructor;

//   // ================= PAYMENT =================
//   const handlePayNow = async (e) => {
//     e.stopPropagation();
//     if (!user) return toast.error("Please login first.");

//     try {
//       setLoading(true);

//       // ✅ api instance بدل fetch
//       const res = await api.post("/enrollments/pay-with-fawry", {
//         courseId: course._id,
//       });

//       setReferenceNumber(res.data.referenceNumber);
//       setShowModal(true);
//       toast.success("Fawry code generated ✅");

//     } catch (err) {
//       console.error(err);
//       toast.error(err.response?.data?.message || "Payment failed ❌");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <>
//       <FawryModal
//         isOpen={showModal}
//         onClose={() => setShowModal(false)}
//         referenceNumber={referenceNumber}
//       />

//       <div
//         onClick={() => {
//           if (locked) return;
//           navigate(`/course/${course._id}`);
//         }}
//         className="relative bg-gray-800/80 rounded-2xl overflow-hidden shadow-lg hover:shadow-blue-500/20 hover:-translate-y-1 transition-all duration-300 cursor-pointer group border border-gray-700/50 hover:border-blue-500/30"
//       >
//         {/* ================= LOCK ================= */}
//         {locked && (
//           <div className="absolute top-3 right-3 bg-black/70 backdrop-blur-sm p-2 rounded-full z-10 shadow-lg border border-yellow-500/30">
//             <span className="text-yellow-400 text-lg">🔒</span>
//           </div>
//         )}

//         {/* ================= BADGE FREE/PAID ================= */}
//         <div className="absolute top-3 left-3 z-10">
//           {Number(course?.price) > 0 ? (
//             <span className="px-2 py-1 rounded-lg text-xs font-bold bg-yellow-500/20 text-yellow-400 border border-yellow-500/30 backdrop-blur-sm">
//               💰 {course.price} EGP
//             </span>
//           ) : (
//             <span className="px-2 py-1 rounded-lg text-xs font-bold bg-green-500/20 text-green-400 border border-green-500/30 backdrop-blur-sm">
//               🆓 Free
//             </span>
//           )}
//         </div>

//         {/* ================= IMAGE ================= */}
//         <div className="h-44 bg-gray-700 overflow-hidden">
//           <img
//             src={course.thumbnail || "https://picsum.photos/300"}
//             alt={course?.title}
//             className="w-full h-full object-cover group-hover:scale-110 transition duration-500"
//           />
//           {/* Gradient overlay */}
//           <div className="absolute inset-0 h-44 bg-gradient-to-t from-gray-800/60 to-transparent"></div>
//         </div>

//         {/* ================= CONTENT ================= */}
//         <div className="p-4">
//           <h3 className="text-base font-bold group-hover:text-blue-400 transition line-clamp-1">
//             {course?.title}
//           </h3>

//           <p className="text-gray-400 text-xs mt-1.5 line-clamp-2 leading-relaxed">
//             {course?.description}
//           </p>

//           <div className="flex items-center gap-1.5 mt-3">
//             <div className="w-5 h-5 rounded-full bg-blue-500/20 flex items-center justify-center text-xs">
//               👤
//             </div>
//             <p className="text-blue-300 text-xs font-medium truncate">
//               {course.instructor?.name || "Not provided"}
//             </p>
//           </div>

//           {/* ================= ACTIONS ================= */}
//           <div className="mt-4 flex flex-col gap-2">
//             {!locked ? (
//               <>
//                 <button
//                   onClick={(e) => {
//                     e.stopPropagation();
//                     navigate(`/course/${course._id}`);
//                   }}
//                   className="w-full py-2 rounded-xl text-sm font-semibold bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 transition-all duration-200 shadow-lg shadow-blue-500/20 hover:shadow-blue-500/40 hover:scale-[1.02]"
//                 >
//                   Open Course 🚀
//                 </button>

//                 <button
//                   onClick={(e) => {
//                     e.stopPropagation();
//                     navigate(`/course/${course._id}/quizzes`);
//                   }}
//                   className="w-full py-2 rounded-xl text-sm font-semibold bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-500 hover:to-purple-400 transition-all duration-200 shadow-lg shadow-purple-500/20 hover:shadow-purple-500/40 hover:scale-[1.02]"
//                 >
//                   Quizzes 🧠
//                 </button>
//               </>
//             ) : (
//               <button
//                 onClick={handlePayNow}
//                 disabled={loading}
//                 className="w-full py-2 rounded-xl text-sm font-bold bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-400 hover:to-orange-400 transition-all duration-200 shadow-lg shadow-yellow-500/20 hover:shadow-yellow-500/40 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
//               >
//                 {loading ? (
//                   <span className="flex items-center justify-center gap-2">
//                     <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
//                     Processing...
//                   </span>
//                 ) : (
//                   "Pay Now 💳"
//                 )}
//               </button>
//             )}
//           </div>
//         </div>
//       </div>
//     </>
//   );
// }





import { useNavigate } from "react-router-dom";
import { useState } from "react";
import toast from "react-hot-toast";
import FawryModal from "../components/FawryModal";
import api from "../api/axios";

export default function CourseCard({ course, user }) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [referenceNumber, setReferenceNumber] = useState("");

  const isInstructor =
    user &&
    course.instructor &&
    String(course.instructor._id) === String(user._id);

  const locked = Number(course.price) > 0 && !isInstructor;

  const handlePayNow = async (e) => {
    e.stopPropagation();
    if (!user) return toast.error("Please login first.");
    try {
      setLoading(true);
      const res = await api.post("/enrollments/pay-with-fawry", {
        courseId: course._id,
      });
      setReferenceNumber(res.data.referenceNumber);
      setShowModal(true);
    //   toast.success("Fawry code generated");
    } catch (err) {
      toast.error(err.response?.data?.message || "Payment failed ❌");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <FawryModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        referenceNumber={referenceNumber}
      />

      <div
        onClick={() => { if (locked) return; navigate(`/course/${course._id}`); }}
        className="
          relative flex flex-col
          bg-white dark:bg-gray-900
          border border-gray-200 dark:border-gray-700/60
          rounded-2xl overflow-hidden
          shadow-sm hover:shadow-lg hover:shadow-blue-500/10
          hover:-translate-y-1 transition-all duration-300
          cursor-pointer group
        "
      >
        {/* Lock Badge */}
        {locked && (
          <div className="absolute top-3 right-3 z-10 bg-black/50 backdrop-blur-sm p-1.5 rounded-lg border border-yellow-500/30">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
        )}

        {/* Price Badge */}
        <div className="absolute top-3 left-3 z-10">
          {Number(course?.price) > 0 ? (
            <span className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-amber-500/20 text-amber-400 border border-amber-500/30 backdrop-blur-sm">
              {course.price} EGP
            </span>
          ) : (
            <span className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 backdrop-blur-sm">
              Free
            </span>
          )}
        </div>

        {/* Thumbnail */}
        <div className="h-44 bg-gray-100 dark:bg-gray-800 overflow-hidden relative">
          <img
            src={course.thumbnail || "https://picsum.photos/300"}
            alt={course?.title}
            className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
        </div>

        {/* Content */}
        <div className="flex flex-col flex-1 p-4 gap-3">

          {/* Title + Description */}
          <div>
            <h3 className="text-sm font-bold text-gray-900 dark:text-gray-100 group-hover:text-blue-500 dark:group-hover:text-blue-400 transition line-clamp-1">
              {course?.title}
            </h3>
            <p className="text-gray-500 dark:text-gray-400 text-xs mt-1 line-clamp-2 leading-relaxed">
              {course?.description}
            </p>
          </div>

          {/* Instructor */}
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-blue-500/10 dark:bg-blue-500/20 flex items-center justify-center flex-shrink-0">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5 text-blue-500 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <span className="text-xs text-blue-600 dark:text-blue-400 font-medium truncate">
              {course.instructor?.name || "Not provided"}
            </span>
          </div>

          {/* Divider */}
          <div className="border-t border-gray-100 dark:border-gray-800" />

          {/* Actions */}
          <div className="flex flex-col gap-2 mt-auto">
            {!locked ? (
              <>
                <button
                  onClick={(e) => { e.stopPropagation(); navigate(`/course/${course._id}`); }}
                  className="
                    w-full py-2 rounded-xl text-xs font-semibold
                    bg-blue-600 hover:bg-blue-500
                    dark:bg-blue-600 dark:hover:bg-blue-500
                    text-white transition-all duration-200
                    shadow-sm hover:shadow-blue-500/30 hover:scale-[1.02]
                    flex items-center justify-center gap-1.5
                  "
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Open Course
                </button>

                <button
                  onClick={(e) => { e.stopPropagation(); navigate(`/course/${course._id}/quizzes`); }}
                  className="
                    w-full py-2 rounded-xl text-xs font-semibold
                    bg-purple-600 hover:bg-purple-500
                    dark:bg-purple-600 dark:hover:bg-purple-500
                    text-white transition-all duration-200
                    shadow-sm hover:shadow-purple-500/30 hover:scale-[1.02]
                    flex items-center justify-center gap-1.5
                  "
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Quizzes
                </button>
              </>
            ) : (
              <button
                onClick={handlePayNow}
                disabled={loading}
                className="
                  w-full py-2 rounded-xl text-xs font-bold
                  bg-amber-500 hover:bg-amber-400
                  text-white transition-all duration-200
                  shadow-sm hover:shadow-amber-500/30 hover:scale-[1.02]
                  disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100
                  flex items-center justify-center gap-1.5
                "
              >
                {loading ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                    </svg>
                    Pay Now
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
}