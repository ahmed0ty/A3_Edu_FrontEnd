// InstructorEnrollments.jsx
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import toast from "react-hot-toast";

export default function InstructorEnrollments() {
  const { courseId } = useParams();
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [courseInstructorId, setCourseInstructorId] = useState(null);
const [courseTitle, setCourseTitle] = useState("");
  const token = localStorage.getItem("token");
  const storedUser = JSON.parse(localStorage.getItem("user"));
  const currentUserId = storedUser?._id;

  console.log("Current User ID:", currentUserId);

  // ================= FETCH COURSE INFO =================
  useEffect(() => {
    const fetchCourseInstructor = async () => {
      try {
        const res = await fetch(`https://a3-edu.onrender.com/courses/${courseId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
        const data = await res.json();
        console.log("Fetched course data:", data);
        setCourseInstructorId(data.data.instructor?._id || null);
        setCourseTitle(data.data.title || "");
      } catch (err) {
        console.error("Failed to fetch course:", err);
      }
    };
    if (token) fetchCourseInstructor();
  }, [courseId, token]);

  // ================= FETCH ENROLLMENTS =================
  useEffect(() => {
    const fetchEnrollments = async () => {
      try {
        setLoading(true);
        const res = await fetch(
          `https://a3-edu.onrender.com/enrollments/course/${courseId}/enrollments`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
        const data = await res.json();
        const withEditFlag = (data.data || []).map((e) => ({ ...e, editing: false }));
        setEnrollments(withEditFlag);
      } catch (err) {
        setError(err.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };
    if (token) fetchEnrollments();
  }, [courseId, token]);

  // ================= HANDLE APPROVAL =================
  const handleApproval = async (enrollmentId, status) => {
    try {
      const res = await fetch(
        `https://a3-edu.onrender.com/enrollments/${enrollmentId}/status`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ status }),
        }
      );
      if (!res.ok) throw new Error("Failed to update status");

      setEnrollments((prev) =>
        prev.map((e) =>
          e._id === enrollmentId
            ? { ...e, approvalStatus: status, editing: true } // بعد الضغط يتحول ل edit
            : e
        )
      );
    } catch (err) {
      console.error(err);
      toast("Error updating status");
    }
  };

  // ================= TOGGLE EDIT MODE =================
  const toggleEdit = (enrollmentId) => {
    setEnrollments((prev) =>
      prev.map((e) =>
        e._id === enrollmentId ? { ...e, editing: !e.editing } : e
      )
    );
  };

  // ================= SEARCH FILTER =================
  const filteredEnrollments = enrollments.filter(
    (e) =>
      e.student?.name?.toLowerCase().includes(search.toLowerCase()) ||
      e.student?.email?.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return <p className="p-8 text-white">Loading enrollments...</p>;
  if (error) return <p className="p-8 text-red-500">{error}</p>;
  if (!enrollments.length)
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Navbar />

      <div className="flex flex-col items-center justify-center h-[70vh] text-center">
        <div className="bg-gray-800 p-10 rounded-2xl shadow-lg max-w-md w-full">
          
          {/* Icon */}
          <div className="text-6xl mb-4">📭</div>

          {/* Title */}
          <h2 className="text-2xl font-bold mb-2">
            No Enrollments Yet
          </h2>

          {/* Description */}
          <p className="text-gray-400 mb-6">
            No students have enrolled in this course yet.  
            Once they do, they will appear here.
          </p>

          {/* Button */}
          <button
            onClick={() => window.history.back()}
            className="bg-purple-600 px-6 py-2 rounded-lg font-semibold hover:bg-purple-700 transition"
          >
            🔙 Go Back
          </button>
        </div>
      </div>
    </div>
  );

  const isInstructor =
    currentUserId && courseInstructorId && String(currentUserId) === String(courseInstructorId);

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Navbar />
      <div className="p-8">
        <h2 className="text-3xl font-bold mb-6">
          Enrollments for Course: <span className="text-purple-400">{courseTitle || "Loading..."}</span>
        </h2>

        {/* 🔍 Search */}
        <div className="mb-6">
          <input
            type="text"
            placeholder="Search by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full md:w-1/3 p-2 rounded-lg bg-gray-800 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>

        {/* 🗂 Table */}
        <div className="overflow-x-auto bg-gray-800 rounded-lg shadow">
          <table className="min-w-full divide-y divide-gray-700">
            <thead className="bg-gray-700">
<tr>
<th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Name</th>
<th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">Email</th>
<th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">Phone</th> {/* جديد */}
<th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">Receipt</th> {/* جديد */}
<th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">Status</th>
<th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">Actions</th>
</tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {filteredEnrollments.map((enroll) => (
                <tr key={enroll._id} className="hover:bg-gray-700 transition">
                  <td className="px-6 py-4">{enroll.student?.name || "-"}</td>
                  <td className="px-6 py-4">{enroll.student?.email || "-"}</td>
                  {/* 📱 رقم المرسل */}
<td className="px-6 py-4 text-blue-400 font-mono">
  {enroll.senderNumber || "-"}
</td>

{/* 🧾 صورة الإيصال */}
<td className="px-6 py-4">
  {enroll.receipt ? (
   <img
  src={enroll.receipt} // 👈 مباشرة
  alt="receipt"
  className="w-14 h-14 object-cover rounded cursor-pointer hover:scale-110 transition"
  onClick={() => window.open(enroll.receipt, "_blank")}
/>
  ) : (
    "-"
  )}
</td>
                  <td className="px-6 py-4">
                    {enroll.approvalStatus === "pending" && (
                      <span className="text-yellow-400 font-bold">Pending ⏳</span>
                    )}
                    {enroll.approvalStatus === "accepted" && (
                      <span className="text-green-400 font-bold">Accepted ✅</span>
                    )}
                    {enroll.approvalStatus === "rejected" && (
                      <span className="text-red-400 font-bold">Rejected ❌</span>
                    )}
                  </td>
                 <td className="px-6 py-4 space-x-2">
  {isInstructor && (
    <>
      {/* لو في وضع edit أو status pending نعرض الزرارين */}
      {(enroll.editing || enroll.approvalStatus === "pending") ? (
        <>
          <button
            onClick={() => handleApproval(enroll._id, "accepted")}
            className="px-3 py-1 rounded bg-green-600 hover:bg-green-700 transition"
          >
            Accept ✅
          </button>
          <button
            onClick={() => handleApproval(enroll._id, "rejected")}
            className="px-3 py-1 rounded bg-red-600 hover:bg-red-700 transition"
          >
            Reject ❌
          </button>
          {/* زر لإلغاء الوضعية مؤقتًا */}
          {enroll.editing && (
            <button
              onClick={() => toggleEdit(enroll._id)}
              className="px-3 py-1 rounded bg-gray-600 hover:bg-gray-500 transition"
            >
              Cancel 🛑
            </button>
          )}
        </>
      ) : (
        // لو مش pending ونفسه edit زرار edit
        <button
          onClick={() => toggleEdit(enroll._id)}
          className="px-3 py-1 rounded bg-yellow-600 hover:bg-yellow-700 transition"
        >
          Edit 🖊️
        </button>
      )}
    </>
  )}
</td>
                </tr>
              ))}
              {filteredEnrollments.length === 0 && (
                <tr>
                  <td colSpan="4" className="px-6 py-4 text-center text-gray-400">
                    No results found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}