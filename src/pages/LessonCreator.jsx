

// import { useState } from "react";
// import api from "../api/axios"; // ✅ بدل axios العادي
// import toast from "react-hot-toast";

// export default function LessonCreator({ onCreate, courseId }) {
//   const [title, setTitle] = useState("");
//   const [type, setType] = useState("video");
//   const [content, setContent] = useState("");
//   const [file, setFile] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [progress, setProgress] = useState(0);

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (
//       !title ||
//       ((!content) && (type === "text" || type === "link")) ||
//       ((!file) && (type === "video" || type === "pdf"))
//     ) {
//       return toast.error("Please fill all required fields");
//     }

//     setLoading(true);
//     setProgress(0);

//     try {
//       const formData = new FormData();
//       formData.append("title", title);
//       formData.append("type", type);

//       if (type === "video" || type === "pdf") {
//         formData.append("file", file);
//       } else {
//         formData.append("content", content);
//       }

//       // ✅ api instance مع onUploadProgress
//       const res = await api.post(
//         `/lessons/course/${courseId}`,
//         formData,
//         {
//           onUploadProgress: (e) => {
//             const percent = Math.round((e.loaded * 100) / e.total);
//             setProgress(percent);
//           },
//         }
//       );

//       onCreate.addLesson(res.data.data);
//       setTitle("");
//       setContent("");
//       setFile(null);
//       setType("video");
//       setProgress(0);
//       toast.success("Lesson created");

//     } catch (err) {
//       console.error(err);
//       toast.error(err.response?.data?.message || "Upload failed");
//       setProgress(0);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="bg-gray-800 p-6 rounded-xl shadow-lg max-w-md mx-auto mb-6">
//       <h2 className="text-2xl font-bold mb-4 text-white text-center">
//         Create New Lesson
//       </h2>

//       <form className="space-y-4" onSubmit={handleSubmit}>
//         <input
//           type="text"
//           placeholder="Lesson Title"
//           className="w-full p-3 rounded bg-gray-700 text-white focus:outline-none"
//           value={title}
//           onChange={(e) => setTitle(e.target.value)}
//           required
//         />

//         <select
//           className="w-full p-3 rounded bg-gray-700 text-white focus:outline-none"
//           value={type}
//           onChange={(e) => setType(e.target.value)}
//         >
//           <option value="video">Video</option>
//           <option value="pdf">PDF</option>
//           <option value="text">Text</option>
//           <option value="link">Link</option>
//         </select>

//         {type === "text" || type === "link" ? (
//           <input
//             type="text"
//             placeholder={type === "text" ? "Lesson content" : "Paste link here"}
//             className="w-full p-3 rounded bg-gray-700 text-white focus:outline-none"
//             value={content}
//             onChange={(e) => setContent(e.target.value)}
//             required
//           />
//         ) : (
//           <input
//             type="file"
//             accept={type === "video" ? "video/*" : "application/pdf"}
//             onChange={(e) => setFile(e.target.files[0])}
//             required
//             className="w-full text-white"
//           />
//         )}

//         {loading && (type === "video" || type === "pdf") && (
//           <div className="w-full bg-gray-600 rounded-full h-3 mt-2">
//             <div
//               className="bg-blue-500 h-3 rounded-full transition-all"
//               style={{ width: `${progress}%` }}
//             />
//           </div>
//         )}

//         <button
//           type="submit"
//           className={`w-full p-3 rounded bg-blue-600 hover:bg-blue-700 transition ${
//             loading ? "opacity-70 cursor-not-allowed" : ""
//           }`}
//           disabled={loading}
//         >
//           {loading ? `Uploading... ${progress}%` : "Create Lesson"}
//         </button>
//       </form>
//     </div>
//   );
// }
































import { useState } from "react";
import api from "../api/axios";
import toast from "react-hot-toast";
import { Spinner } from "../components/Spinner";

export default function LessonCreator({ onCreate, courseId }) {
  const [title, setTitle] = useState("");
  const [type, setType] = useState("video");
  const [content, setContent] = useState("");
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);

  const isFileType = type === "video" || type === "pdf";
  const isTextType = type === "text" || type === "link";

  const resetForm = () => {
    setTitle("");
    setType("video");
    setContent("");
    setFile(null);
    setProgress(0);
  };

  const handleTypeChange = (value) => {
    setType(value);
    setContent("");
    setFile(null);
    setProgress(0);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title.trim()) {
      return toast.error("Lesson title is required");
    }

    if (isTextType && !content.trim()) {
      return toast.error("Please fill all required fields");
    }

    if (isFileType && !file) {
      return toast.error("Please upload the required file");
    }

    setLoading(true);
    setProgress(0);

    try {
      const formData = new FormData();
      formData.append("title", title.trim());
      formData.append("type", type);

      if (isFileType) {
        formData.append("file", file);
      } else {
        formData.append("content", content.trim());
      }

      const res = await api.post(`/lessons/course/${courseId}`, formData, {
        onUploadProgress: (e) => {
          if (!e.total) return;
          const percent = Math.round((e.loaded * 100) / e.total);
          setProgress(percent);
        },
      });

      onCreate?.addLesson?.(res.data?.data);
      resetForm();
      toast.success("Lesson created successfully");
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Upload failed");
      setProgress(0);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="
        w-full max-w-lg mx-auto
        rounded-3xl
        border border-gray-200 dark:border-gray-800
        bg-white dark:bg-gray-900
        shadow-xl shadow-gray-200/40 dark:shadow-black/20
        overflow-hidden
        transition-colors duration-300
      "
    >
      {/* Header */}
      <div className="px-6 py-5 border-b border-gray-200 dark:border-gray-800">
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
          Lesson Builder
        </div>

        <h2 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-gray-100">
          Create New Lesson
        </h2>

        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
          Add a new lesson by selecting the lesson type and uploading or writing
          its content.
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="p-6 space-y-5">
        {/* Title */}
        <div>
          <label className="block mb-2 text-sm font-semibold text-gray-700 dark:text-gray-200">
            Lesson Title
          </label>
          <input
            type="text"
            placeholder="Enter lesson title"
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
            required
          />
        </div>

        {/* Type */}
        <div>
          <label className="block mb-2 text-sm font-semibold text-gray-700 dark:text-gray-200">
            Lesson Type
          </label>
          <select
            className="
              w-full h-12 px-4 rounded-2xl
              border border-gray-200 dark:border-gray-700
              bg-gray-50 dark:bg-gray-800
              text-gray-900 dark:text-gray-100
              focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500
              transition-all duration-200
            "
            value={type}
            onChange={(e) => handleTypeChange(e.target.value)}
          >
            <option value="video">Video</option>
            <option value="pdf">PDF</option>
            <option value="text">Text</option>
            <option value="link">Link</option>
          </select>
        </div>

        {/* Text / Link */}
        {isTextType && (
          <div>
            <label className="block mb-2 text-sm font-semibold text-gray-700 dark:text-gray-200">
              {type === "text" ? "Lesson Content" : "Lesson Link"}
            </label>

            {type === "text" ? (
              <textarea
                placeholder="Write lesson content here..."
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
                value={content}
                onChange={(e) => setContent(e.target.value)}
                required
              />
            ) : (
              <input
                type="text"
                placeholder="Paste link here"
                className="
                  w-full h-12 px-4 rounded-2xl
                  border border-gray-200 dark:border-gray-700
                  bg-gray-50 dark:bg-gray-800
                  text-gray-900 dark:text-gray-100
                  placeholder:text-gray-400 dark:placeholder:text-gray-500
                  focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500
                  transition-all duration-200
                "
                value={content}
                onChange={(e) => setContent(e.target.value)}
                required
              />
            )}
          </div>
        )}

        {/* File Upload */}
        {isFileType && (
          <div>
            <label className="block mb-2 text-sm font-semibold text-gray-700 dark:text-gray-200">
              Upload {type === "video" ? "Video" : "PDF"}
            </label>

            <label
              className="
                flex flex-col items-center justify-center
                min-h-[180px] rounded-3xl cursor-pointer overflow-hidden
                border-2 border-dashed border-gray-300 dark:border-gray-700
                bg-gray-50 dark:bg-gray-800/50
                hover:bg-gray-100 dark:hover:bg-gray-800
                transition-all duration-200
              "
            >
              {file ? (
                <div className="w-full p-6 text-center">
                  <div
                    className="
                      w-16 h-16 rounded-2xl mx-auto mb-4
                      flex items-center justify-center
                      bg-blue-50 dark:bg-blue-500/10
                      text-blue-600 dark:text-blue-400
                      border border-blue-100 dark:border-blue-500/20
                    "
                  >
                    {type === "video" ? "🎬" : "📄"}
                  </div>

                  <p className="text-sm font-semibold text-gray-800 dark:text-gray-100 break-all">
                    {file.name}
                  </p>

                  <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                    {(file.size / 1024 / 1024).toFixed(2)} MB
                  </p>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      setFile(null);
                      setProgress(0);
                    }}
                    className="
                      mt-4 px-4 py-2 rounded-2xl
                      bg-red-600 hover:bg-red-500
                      text-white text-sm font-semibold
                      transition-all duration-200
                    "
                  >
                    Remove File
                  </button>
                </div>
              ) : (
                <div className="text-center px-6">
                  <div
                    className="
                      w-16 h-16 rounded-2xl mx-auto mb-4
                      flex items-center justify-center
                      bg-blue-50 dark:bg-blue-500/10
                      text-blue-600 dark:text-blue-400
                      border border-blue-100 dark:border-blue-500/20
                    "
                  >
                    {type === "video" ? "🎥" : "📑"}
                  </div>

                  <p className="text-sm font-semibold text-gray-800 dark:text-gray-100">
                    Click to upload {type === "video" ? "video" : "PDF"}
                  </p>

                  <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                    {type === "video"
                      ? "Supported: video files"
                      : "Supported: PDF documents"}
                  </p>
                </div>
              )}

              <input
                type="file"
                hidden
                accept={type === "video" ? "video/*" : "application/pdf"}
                onChange={(e) => setFile(e.target.files[0])}
                required={!file}
              />
            </label>
          </div>
        )}

        {/* Progress */}
        {loading && isFileType && (
          <div>
            <div className="flex items-center justify-between mb-2 text-xs font-medium text-gray-500 dark:text-gray-400">
              <span>Uploading lesson...</span>
              <span>{progress}%</span>
            </div>

            <div className="w-full h-3 rounded-full bg-gray-200 dark:bg-gray-800 overflow-hidden">
              <div
                className="h-full rounded-full bg-blue-600 dark:bg-blue-500 transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className={`
            w-full h-12 rounded-2xl
            font-semibold text-white
            transition-all duration-200
            flex items-center justify-center gap-2
            ${
              loading
                ? "bg-gray-400 dark:bg-gray-700 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-500 shadow-md hover:shadow-blue-500/25"
            }
          `}
        >
          {loading ? (
            <>
              <Spinner size="sm" variant="white" />
              {isFileType ? `Uploading... ${progress}%` : "Creating..."}
            </>
          ) : (
            "Create Lesson"
          )}
        </button>
      </form>
    </div>
  );
}