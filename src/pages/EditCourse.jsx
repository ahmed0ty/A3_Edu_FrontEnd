// // EditCourse.jsx
// import { useState, useEffect } from "react";
// import toast from "react-hot-toast";
// import { useNavigate, useParams } from "react-router-dom";
// import api from "../api/axios";

// export default function EditCourse() {
//   const { id } = useParams();
//   const [title, setTitle] = useState("");
//   const [description, setDescription] = useState("");
//   const [thumbnail, setThumbnail] = useState("");
//   const [price, setPrice] = useState(0);
//   const [instructorPhone, setInstructorPhone] = useState("");
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   const navigate = useNavigate();

//   // ================= FETCH COURSE =================
//   useEffect(() => {
//     const fetchCourse = async () => {
//       try {
//         setLoading(true);

//         const res = await api.get(`/courses/${id}`);
//         const data = res.data.data;

//         setTitle(data.title || "");
//         setDescription(data.description || "");
//         setThumbnail(data.thumbnail || "");
//         setPrice(data.price ?? 0);
//         setInstructorPhone(data.instructorPhone || "");

//       } catch (err) {
//         console.error(err);
//         setError(err.response?.data?.message || "Something went wrong while fetching the course");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchCourse();
//   }, [id]);

//   // ================= UPDATE COURSE =================
//   const handleUpdate = async () => {
//     if (!title.trim() || !description.trim() || !instructorPhone.trim()) {
//       setError("Title, Description and Phone Number are required!");
//       return;
//     }
//     if (description.length < 10) {
//       setError("Description must be at least 10 characters");
//       return;
//     }

//     try {
//       await api.put(`/courses/${id}`, {
//         title: title.trim(),
//         description: description.trim(),
//         thumbnail: thumbnail.trim(),
//         price: Number(price),
//         instructorPhone: instructorPhone.trim(),
//       });

//       toast.success("Course updated");
//       navigate("/dashboard");

//     } catch (err) {
//       console.error(err);
//       setError(err.response?.data?.message || "Update failed. Not authorized or course not found.");
//     }
//   };

//   if (loading) return <p className="p-6 text-white">Loading course...</p>;

//   if (error)
//     return (
//       <div className="min-h-screen bg-gray-900 text-white p-6">
//         <p className="text-red-500 font-bold mb-4">{error}</p>
//         <button
//           onClick={() => navigate("/dashboard")}
//           className="bg-blue-600 px-6 py-3 rounded hover:scale-105 transition"
//         >
//           Go Back
//         </button>
//       </div>
//     );

//   return (
//     <div className="min-h-screen bg-gray-900 text-white p-6">
//       <h1 className="text-3xl font-bold mb-6">Edit Course</h1>

//       <input
//         placeholder="Title"
//         className="block w-full p-2 mb-4 bg-gray-800"
//         value={title}
//         onChange={(e) => setTitle(e.target.value)}
//       />

//       <input
//         placeholder="Description"
//         className="block w-full p-2 mb-4 bg-gray-800"
//         value={description}
//         onChange={(e) => setDescription(e.target.value)}
//       />

//       <input
//         placeholder="Thumbnail URL"
//         className="block w-full p-2 mb-4 bg-gray-800"
//         value={thumbnail}
//         onChange={(e) => setThumbnail(e.target.value)}
//       />

//       <input
//         placeholder="Price"
//         className="block w-full p-2 mb-4 bg-gray-800"
//         type="number"
//         value={price}
//         onChange={(e) => setPrice(e.target.value ?? 0)}
//       />

//       <input
//         placeholder="Instructor phone number has bank account"
//         className="block w-full p-2 mb-4 bg-gray-800"
//         value={instructorPhone}
//         onChange={(e) => setInstructorPhone(e.target.value)}
//       />

//       {error && <p className="text-red-500 font-bold mb-4">{error}</p>}

//       <button
//         onClick={handleUpdate}
//         className="bg-blue-600 px-6 py-3 rounded hover:scale-105 transition"
//       >
//         Update 🔄
//       </button>
//     </div>
//   );
// }






































// EditCourse.jsx
import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";
import api from "../api/axios";
import { Spinner } from "../components/Spinner";

export default function EditCourse() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [thumbnail, setThumbnail] = useState("");
  const [price, setPrice] = useState(0);
  const [instructorPhone, setInstructorPhone] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const previewImage = thumbnail?.trim() || "https://picsum.photos/600/400";

  // ================= FETCH COURSE =================
  useEffect(() => {
    const fetchCourse = async () => {
      try {
        setLoading(true);
        setError("");

        const res = await api.get(`/courses/${id}`);
        const data = res.data?.data;

        setTitle(data?.title || "");
        setDescription(data?.description || "");
        setThumbnail(data?.thumbnail || "");
        setPrice(data?.price ?? 0);
        setInstructorPhone(data?.instructorPhone || "");
      } catch (err) {
        console.error(err);
        setError(
          err.response?.data?.message ||
            "Something went wrong while fetching the course"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchCourse();
  }, [id]);

  // ================= UPDATE COURSE =================
  const handleUpdate = async (e) => {
    e?.preventDefault?.();

    if (!title.trim() || !description.trim() || !instructorPhone.trim()) {
      setError("Title, description, and phone number are required.");
      return;
    }

    if (description.trim().length < 10) {
      setError("Description must be at least 10 characters.");
      return;
    }

    try {
      setSaving(true);
      setError("");

      await api.put(`/courses/${id}`, {
        title: title.trim(),
        description: description.trim(),
        thumbnail: thumbnail.trim(),
        price: Number(price),
        instructorPhone: instructorPhone.trim(),
      });

      toast.success("Course updated successfully");
      navigate("/dashboard");
    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.message ||
          "Update failed. Not authorized or course not found."
      );
    } finally {
      setSaving(false);
    }
  };

  // ================= LOADING =================
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950 transition-colors duration-300">
        <div className="flex flex-col items-center gap-4">
          <Spinner size="lg" variant="primary" />
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Loading course...
          </p>
        </div>
      </div>
    );
  }

  // ================= ERROR STATE =================
  if (error && !title && !description && !instructorPhone) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950 px-4 transition-colors duration-300">
        <div
          className="
            w-full max-w-md rounded-3xl
            border border-red-200 dark:border-red-500/20
            bg-white dark:bg-gray-900
            shadow-xl p-8 text-center
          "
        >
          <div className="text-5xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            Unable to load course
          </h2>
          <p className="mt-3 text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
            {error}
          </p>

          <button
            onClick={() => navigate("/dashboard")}
            className="
              mt-6 px-5 py-3 rounded-2xl
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

  return (
    <div
      className="
        min-h-screen
        bg-gray-50 dark:bg-gray-950
        px-4 py-8 md:px-6 md:py-10
        transition-colors duration-300
      "
    >
      <div className="max-w-6xl mx-auto grid grid-cols-1 xl:grid-cols-[1.05fr_0.95fr] gap-6">
        {/* Left Preview */}
        <div
          className="
            rounded-3xl
            border border-gray-200 dark:border-gray-800
            bg-white dark:bg-gray-900
            shadow-xl shadow-gray-200/40 dark:shadow-black/20
            overflow-hidden
          "
        >
          <div className="p-6 md:p-8 border-b border-gray-200 dark:border-gray-800">
            <div
              className="
                inline-flex items-center gap-2
                px-3 py-1.5 rounded-full mb-4
                bg-blue-50 dark:bg-blue-500/10
                text-blue-600 dark:text-blue-400
                text-xs font-semibold
                border border-blue-100 dark:border-blue-500/20
              "
            >
              Course Editor
            </div>

            <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100">
              Edit your course
            </h1>

            <p className="mt-3 text-sm md:text-base leading-relaxed text-gray-500 dark:text-gray-400">
              Update your course details, thumbnail, pricing, and payment phone
              number before saving changes.
            </p>
          </div>

          <div className="p-6 md:p-8">
            <p className="text-xs uppercase tracking-wider text-gray-400 dark:text-gray-500 mb-3">
              Live Preview
            </p>

            <div
              className="
                rounded-3xl overflow-hidden
                border border-gray-200 dark:border-gray-800
                bg-gray-50 dark:bg-gray-800/50
              "
            >
              <div className="aspect-video bg-gray-100 dark:bg-gray-800 overflow-hidden">
                <img
                  src={previewImage}
                  alt="Course preview"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.src = "https://picsum.photos/600/400";
                  }}
                />
              </div>

              <div className="p-5">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100 truncate">
                      {title.trim() || "Course Title"}
                    </h2>
                    <p className="mt-2 text-sm leading-relaxed text-gray-500 dark:text-gray-400 line-clamp-3">
                      {description.trim() ||
                        "Your updated course description will appear here."}
                    </p>
                  </div>

                  <span
                    className="
                      shrink-0 px-3 py-1.5 rounded-xl
                      bg-amber-50 dark:bg-amber-500/10
                      text-amber-600 dark:text-amber-400
                      border border-amber-100 dark:border-amber-500/20
                      text-sm font-semibold
                    "
                  >
                    {Number(price) > 0 ? `${price} EGP` : "Free"}
                  </span>
                </div>

                <div className="mt-4 flex items-center gap-2 text-sm text-blue-600 dark:text-blue-400">
                  <div className="w-8 h-8 rounded-xl bg-blue-50 dark:bg-blue-500/10 flex items-center justify-center border border-blue-100 dark:border-blue-500/20">
                    👨‍🏫
                  </div>
                  <span className="font-medium truncate">
                    {instructorPhone || "Instructor Phone"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Form */}
        <form
          onSubmit={handleUpdate}
          className="
            rounded-3xl
            border border-gray-200 dark:border-gray-800
            bg-white dark:bg-gray-900
            shadow-xl shadow-gray-200/40 dark:shadow-black/20
            p-6 md:p-8
            space-y-5
          "
        >
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              Update Course Details
            </h2>
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
              Edit the course information below and save your changes.
            </p>
          </div>

          {/* Title */}
          <div>
            <label className="block mb-2 text-sm font-semibold text-gray-700 dark:text-gray-200">
              Title
            </label>
            <input
              placeholder="Enter course title"
              className="
                w-full h-12 px-4 rounded-2xl
                border border-gray-200 dark:border-gray-700
                bg-gray-50 dark:bg-gray-800
                text-gray-900 dark:text-gray-100
                placeholder:text-gray-400 dark:placeholder:text-gray-500
                focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500
                transition-all duration-200
              "
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          {/* Description */}
          <div>
            <label className="block mb-2 text-sm font-semibold text-gray-700 dark:text-gray-200">
              Description
            </label>
            <textarea
              placeholder="Write a clear course description..."
              rows="5"
              className="
                w-full px-4 py-3 rounded-2xl
                border border-gray-200 dark:border-gray-700
                bg-gray-50 dark:bg-gray-800
                text-gray-900 dark:text-gray-100
                placeholder:text-gray-400 dark:placeholder:text-gray-500
                focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500
                transition-all duration-200 resize-none
              "
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
            <p className="mt-2 text-xs text-gray-400 dark:text-gray-500">
              Minimum 10 characters.
            </p>
          </div>

          {/* Thumbnail */}
          <div>
            <label className="block mb-2 text-sm font-semibold text-gray-700 dark:text-gray-200">
              Thumbnail URL
            </label>
            <input
              placeholder="https://example.com/image.jpg"
              className="
                w-full h-12 px-4 rounded-2xl
                border border-gray-200 dark:border-gray-700
                bg-gray-50 dark:bg-gray-800
                text-gray-900 dark:text-gray-100
                placeholder:text-gray-400 dark:placeholder:text-gray-500
                focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500
                transition-all duration-200
              "
              value={thumbnail}
              onChange={(e) => setThumbnail(e.target.value)}
            />
          </div>

          {/* Price */}
          <div>
            <label className="block mb-2 text-sm font-semibold text-gray-700 dark:text-gray-200">
              Price
            </label>
            <div className="relative">
              <input
                type="number"
                min="0"
                placeholder="0"
                className="
                  w-full h-12 px-4 pr-16 rounded-2xl
                  border border-gray-200 dark:border-gray-700
                  bg-gray-50 dark:bg-gray-800
                  text-gray-900 dark:text-gray-100
                  placeholder:text-gray-400 dark:placeholder:text-gray-500
                  focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500
                  transition-all duration-200
                "
                value={price}
                onChange={(e) => setPrice(e.target.value ?? 0)}
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-semibold text-gray-400 dark:text-gray-500">
                EGP
              </span>
            </div>
          </div>

          {/* Instructor Phone */}
          <div>
            <label className="block mb-2 text-sm font-semibold text-gray-700 dark:text-gray-200">
              Instructor Phone Number
            </label>
            <input
              placeholder="Phone number linked to payment account"
              className="
                w-full h-12 px-4 rounded-2xl
                border border-gray-200 dark:border-gray-700
                bg-gray-50 dark:bg-gray-800
                text-gray-900 dark:text-gray-100
                placeholder:text-gray-400 dark:placeholder:text-gray-500
                focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500
                transition-all duration-200
              "
              value={instructorPhone}
              onChange={(e) => setInstructorPhone(e.target.value)}
            />
          </div>

          {/* Error */}
          {error && (
            <div
              className="
                rounded-2xl border border-red-200 dark:border-red-500/20
                bg-red-50 dark:bg-red-500/10
                px-4 py-3 text-sm
                text-red-600 dark:text-red-400
              "
            >
              {error}
            </div>
          )}

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <button
              type="submit"
              disabled={saving}
              className={`
                flex-1 h-12 rounded-2xl
                font-semibold text-white
                transition-all duration-200
                flex items-center justify-center gap-2
                ${
                  saving
                    ? "bg-gray-400 dark:bg-gray-700 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-500 shadow-md hover:shadow-blue-500/25"
                }
              `}
            >
              {saving ? (
                <>
                  <Spinner size="sm" variant="white" />
                  Saving...
                </>
              ) : (
                <>
                  <span>🔄</span>
                  Update Course
                </>
              )}
            </button>

            <button
              type="button"
              onClick={() => navigate("/dashboard")}
              className="
                sm:w-auto h-12 px-5 rounded-2xl
                bg-gray-100 hover:bg-gray-200
                dark:bg-gray-800 dark:hover:bg-gray-700
                text-gray-700 dark:text-gray-200
                border border-gray-200 dark:border-gray-700
                font-medium transition-all duration-200
              "
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}