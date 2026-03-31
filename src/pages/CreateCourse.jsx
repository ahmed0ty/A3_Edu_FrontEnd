// // CreateCourse.jsx
// import { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import toast from "react-hot-toast";
// import api from "../api/axios";

// export default function CreateCourse() {
//   const [title, setTitle] = useState("");
//   const [description, setDescription] = useState("");
//   const [thumbnail, setThumbnail] = useState("");
//   const [price, setPrice] = useState(0);
//   const [instructorPhone, setInstructorPhone] = useState("");

//   const user = JSON.parse(localStorage.getItem("user"));
//   const navigate = useNavigate();

//   const handleSubmit = async () => {
//     try {
//       if (!title || !description || !instructorPhone) {
//         toast.error("Title, Description and Phone Number are required!");
//         return;
//       }
//       if (description.length < 10) {
//         toast.error("Description must be at least 10 characters!");
//         return;
//       }
//       if (isNaN(price)) {
//         toast.error("Price must be a number!");
//         return;
//       }

//       await api.post("/courses", {
//         title,
//         description,
//         thumbnail: thumbnail || "https://picsum.photos/300",
//         price: Number(price),
//         instructor: user?._id,
//         instructorPhone,
//         instructorName: user?.name,
//       });

//       toast.success("Course created");
//       navigate("/dashboard");

//     } catch (err) {
//       console.error("Request failed:", err);
//       const data = err.response?.data;
//       if (data?.errors) {
//         data.errors.forEach((e) => console.error(e.path, ":", e.msg));
//       }
//       toast.error(data?.message || "Something went wrong");
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gray-900 text-white p-6">
//       <h1 className="text-3xl font-bold mb-6">Create Course</h1>

//       <input
//         placeholder="Title"
//         className="block w-full p-2 mb-4 bg-gray-800"
//         value={title}
//         onChange={(e) => setTitle(e.target.value)}
//       />

//       <input
//         placeholder="Description (min 10 chars)"
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
//         placeholder="Price (number)"
//         className="block w-full p-2 mb-4 bg-gray-800"
//         type="number"
//         value={price}
//         onChange={(e) => setPrice(e.target.value)}
//       />

//       <input
//         placeholder="Instructor phone number has a bank account"
//         className="block w-full p-2 mb-4 bg-gray-800"
//         value={instructorPhone}
//         onChange={(e) => setInstructorPhone(e.target.value)}
//       />

//       <button
//         onClick={handleSubmit}
//         className="bg-green-600 px-6 py-3 rounded hover:scale-105 transition"
//       >
//         Create 🚀
//       </button>
//     </div>
//   );
// }
























// CreateCourse.jsx
import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../api/axios";
import { Spinner } from "../components/Spinner";

export default function CreateCourse() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [thumbnail, setThumbnail] = useState("");
  const [price, setPrice] = useState(0);
  const [instructorPhone, setInstructorPhone] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const user = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem("user"));
    } catch {
      return null;
    }
  }, []);

  const previewImage = thumbnail?.trim() || "https://picsum.photos/600/400";

  const handleSubmit = async (e) => {
    e?.preventDefault?.();

    try {
      if (!title.trim() || !description.trim() || !instructorPhone.trim()) {
        toast.error("Title, description, and phone number are required.");
        return;
      }

      if (description.trim().length < 10) {
        toast.error("Description must be at least 10 characters.");
        return;
      }

      if (isNaN(price)) {
        toast.error("Price must be a number.");
        return;
      }

      setLoading(true);

      await api.post("/courses", {
        title: title.trim(),
        description: description.trim(),
        thumbnail: thumbnail.trim() || "https://picsum.photos/300",
        price: Number(price),
        instructor: user?._id,
        instructorPhone: instructorPhone.trim(),
        instructorName: user?.name,
      });

      toast.success("Course created successfully");
      navigate("/dashboard");
    } catch (err) {
      console.error("Request failed:", err);
      const data = err.response?.data;

      if (data?.errors) {
        data.errors.forEach((e) => console.error(e.path, ":", e.msg));
      }

      toast.error(data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

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
        {/* Left Info / Preview */}
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
                bg-emerald-50 dark:bg-emerald-500/10
                text-emerald-600 dark:text-emerald-400
                text-xs font-semibold
                border border-emerald-100 dark:border-emerald-500/20
              "
            >
              Course Builder
            </div>

            <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100">
              Create a new course
            </h1>

            <p className="mt-3 text-sm md:text-base leading-relaxed text-gray-500 dark:text-gray-400">
              Add your course details, choose a thumbnail, set pricing, and make
              it ready for students.
            </p>
          </div>

          {/* Preview Card */}
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
                        "Your course description will appear here as students see it."}
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
                    {user?.name || "Instructor Name"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
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
              Course Details
            </h2>
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
              Fill out the information below to publish your course.
            </p>
          </div>

          {/* Title */}
          <div>
            <label className="block mb-2 text-sm font-semibold text-gray-700 dark:text-gray-200">
              Title
            </label>
            <input
              type="text"
              placeholder="Enter course title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="
                w-full h-12 px-4 rounded-2xl
                border border-gray-200 dark:border-gray-700
                bg-gray-50 dark:bg-gray-800
                text-gray-900 dark:text-gray-100
                placeholder:text-gray-400 dark:placeholder:text-gray-500
                focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500
                transition-all duration-200
              "
            />
          </div>

          {/* Description */}
          <div>
            <label className="block mb-2 text-sm font-semibold text-gray-700 dark:text-gray-200">
              Description
            </label>
            <textarea
              placeholder="Write a short description for your course..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows="5"
              className="
                w-full px-4 py-3 rounded-2xl
                border border-gray-200 dark:border-gray-700
                bg-gray-50 dark:bg-gray-800
                text-gray-900 dark:text-gray-100
                placeholder:text-gray-400 dark:placeholder:text-gray-500
                focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500
                transition-all duration-200 resize-none
              "
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
              type="text"
              placeholder="https://example.com/image.jpg"
              value={thumbnail}
              onChange={(e) => setThumbnail(e.target.value)}
              className="
                w-full h-12 px-4 rounded-2xl
                border border-gray-200 dark:border-gray-700
                bg-gray-50 dark:bg-gray-800
                text-gray-900 dark:text-gray-100
                placeholder:text-gray-400 dark:placeholder:text-gray-500
                focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500
                transition-all duration-200
              "
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
                placeholder="0"
                min="0"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="
                  w-full h-12 px-4 pr-16 rounded-2xl
                  border border-gray-200 dark:border-gray-700
                  bg-gray-50 dark:bg-gray-800
                  text-gray-900 dark:text-gray-100
                  placeholder:text-gray-400 dark:placeholder:text-gray-500
                  focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500
                  transition-all duration-200
                "
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
              type="text"
              placeholder="Phone number linked to payment account"
              value={instructorPhone}
              onChange={(e) => setInstructorPhone(e.target.value)}
              className="
                w-full h-12 px-4 rounded-2xl
                border border-gray-200 dark:border-gray-700
                bg-gray-50 dark:bg-gray-800
                text-gray-900 dark:text-gray-100
                placeholder:text-gray-400 dark:placeholder:text-gray-500
                focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500
                transition-all duration-200
              "
            />
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <button
              type="submit"
              disabled={loading}
              className={`
                flex-1 h-12 rounded-2xl
                font-semibold text-white
                transition-all duration-200
                flex items-center justify-center gap-2
                ${
                  loading
                    ? "bg-gray-400 dark:bg-gray-700 cursor-not-allowed"
                    : "bg-emerald-600 hover:bg-emerald-500 shadow-md hover:shadow-emerald-500/25"
                }
              `}
            >
              {loading ? (
                <>
                  <Spinner size="sm" variant="white" />
                  Creating...
                </>
              ) : (
                <>
                  <span>🚀</span>
                  Create Course
                </>
              )}
            </button>

            <button
              type="button"
              onClick={() => navigate(-1)}
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