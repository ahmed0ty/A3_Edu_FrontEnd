// import { useState, useEffect } from "react";
// import toast from "react-hot-toast";
// import { useNavigate } from "react-router-dom";
// import api from "../api/axios"
// export default function CreateQuiz() {
//   const [title, setTitle] = useState("");
//   const [course, setCourse] = useState("");
//   const [startDate, setStartDate] = useState("");
//   const [endDate, setEndDate] = useState("");
//   const [questions, setQuestions] = useState([]);
//   const navigate = useNavigate();
//   const [courses, setCourses] = useState([]); // 🔥 الكورسات
//   const [image, setImage] = useState(null);
// //   const token = localStorage.getItem("token");

//   // ✅ تحويل التاريخ لـ UTC
//   const toUTC = (dateStr) => {
//     if (!dateStr) return null;
//     return new Date(dateStr).toISOString();
//   };

//   // ✅ هات الكورسات بتاعة المدرس
//   useEffect(() => {
//     const fetchCourses = async () => {
//       try {
//        const res = await api.get("/courses/my-courses");

//              // 👇 حطهم هنا
//       console.log("🔥 FULL RESPONSE:", res);
//       console.log("🔥 DATA:", res.data);
// setCourses(res.data.data);
//       } catch (err) {
//         console.error("Error fetching courses:", err);
//       }
//     };

//     fetchCourses();
//   }, []);

//   // ➕ إضافة سؤال
//   const addQuestion = () => {
//     setQuestions([
//       ...questions,
//       {
//         question: "",
//         type: "multiple-choice",
//         options: ["", "", "", ""],
//         correctAnswer: "",
//       },
//     ]);
//   };

//   // ✏️ تعديل سؤال
//   const updateQuestion = (index, field, value) => {
//     const updated = [...questions];
//     updated[index][field] = value;
//     setQuestions(updated);
//   };

//   // ✏️ تعديل option
//   const updateOption = (qIndex, optIndex, value) => {
//     const updated = [...questions];
//     updated[qIndex].options[optIndex] = value;
//     setQuestions(updated);
//   };

//   // 🚀 Submit
//   const handleSubmit = async () => {
//     try {
//       const formData = new FormData();

//       formData.append("title", title);
//       formData.append("course", course);
//       formData.append("startAt", toUTC(startDate));
//       formData.append("endAt", toUTC(endDate));

//       // ❌ نحذف الصور من JSON
//       formData.append(
//         "questions",
//         JSON.stringify(
//           questions.map((q) => ({
//             question: q.question,
//             type: q.type,
//             options: q.options,
//             correctAnswer: q.correctAnswer,
//           }))
//         )
//       );

//       formData.append("duration", 1);

//       // ✅ صورة الكويز
//       if (image) {
//         formData.append("image", image);
//       }

//       // ✅ صور الأسئلة
// questions.forEach((q, index) => {
//   if (q.image instanceof File) {
//     formData.append("questionImages", q.image);
//     formData.append("imageIndexes", index);
//   }
// });
//  console.log("📦 FORM DATA:", Object.fromEntries(formData.entries()));


//       await api.post("/quizzes", formData);
//     //   console.log("✅ SUCCESS:", res.data);

//       toast.success("Quiz Created ✅");

//       navigate(`/quizzes/${course}`);
//     } catch (err) {
//             console.log("❌ ERROR RESPONSE:", err.response?.data);
//     console.log("❌ STATUS:", err.response?.status);
//     console.log("❌ FULL ERROR:", err);
//       console.error(err);
//       toast.error(err.message || "Something went wrong");
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gray-900 text-white p-6">
//       <h1 className="text-3xl font-bold mb-6">Create Quiz</h1>

//       {/* Title */}
//       <input
//         placeholder="Quiz Title"
//         className="block w-full p-2 mb-4 bg-gray-800"
//         value={title}
//         onChange={(e) => setTitle(e.target.value)}
//       />
   

//       {/* Course */}
//       <select
//         className="block w-full p-2 mb-4 bg-gray-800"
//         value={course}
//         onChange={(e) => setCourse(e.target.value)}
//       >
//         <option value="">Select Course</option>
//         {courses.map((c) => (
//           <option key={c._id} value={c._id}>
//             {c.title}
//           </option>
//         ))}
//       </select>

//       {/* Dates */}
//       <input
//         type="datetime-local"
//         className="block w-full p-2 mb-4 bg-gray-800"
//         value={startDate}
//         onChange={(e) => setStartDate(e.target.value)}
//       />

//       <input
//         type="datetime-local"
//         className="block w-full p-2 mb-4 bg-gray-800"
//         value={endDate}
//         onChange={(e) => setEndDate(e.target.value)}
//       />



//       {/* Questions */}
//       <h2 className="text-xl mb-4">Questions</h2>

//       {questions.map((q, i) => (
//         <div key={i} className="mb-6 p-4 bg-gray-800 rounded">

//           <div className="flex items-center gap-2 mb-2">

//             <input
//               placeholder="Question"
//               className="flex-1 p-2 bg-gray-700"
//               value={q.question}
//               onChange={(e) =>
//                 updateQuestion(i, "question", e.target.value)
//               }
//             />

//             {/* 📷 كاميرا */}
//             <label className="cursor-pointer bg-gray-600 px-3 py-2 rounded">
//               📷
//               <input
//                 type="file"
//                 accept="image/*"
//                 hidden
//                 onChange={(e) => {
//                   const file = e.target.files[0];

//                   const updated = [...questions];
//                   updated[i].image = file;
//                   setQuestions(updated);
//                 }}
//               />
//             </label>
//           </div>

//           {/* Preview */}
//           {q.image && (
//             <img
//               src={URL.createObjectURL(q.image)}
//               className="w-40 h-40 object-cover mb-2"
//             />
//           )}

//           {/* Options */}
//           {q.options.map((opt, j) => (
//             <input
//               key={j}
//               placeholder={`Option ${j + 1}`}
//               className="w-full p-2 mb-2 bg-gray-700"
//               value={opt}
//               onChange={(e) =>
//                 updateOption(i, j, e.target.value)
//               }
//             />
//           ))}

//           {/* Correct Answer */}
//           <input
//             placeholder="Correct Answer"
//             className="w-full p-2 bg-gray-700"
//             value={q.correctAnswer}
//             onChange={(e) =>
//               updateQuestion(i, "correctAnswer", e.target.value)
//             }
//           />
//         </div>
//       ))}

//       <button
//         onClick={addQuestion}
//         className="bg-blue-600 px-4 py-2 rounded mb-4"
//       >
//         + Add Question
//       </button>

//       <br />

//       <button
//         onClick={handleSubmit}
//         className="bg-green-600 px-6 py-3 rounded"
//       >
//         Create Quiz 🚀
//       </button>
//     </div>
//   );
// }








































import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import { Spinner } from "../components/Spinner";

export default function CreateQuiz() {
  const [title, setTitle] = useState("");
  const [course, setCourse] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [questions, setQuestions] = useState([]);
  const [courses, setCourses] = useState([]);
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const toUTC = (dateStr) => {
    if (!dateStr) return null;
    return new Date(dateStr).toISOString();
  };

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await api.get("/courses/my-courses");
        setCourses(res.data?.data || []);
      } catch (err) {
        console.error("Error fetching courses:", err);
        toast.error("Failed to load your courses");
      }
    };

    fetchCourses();
  }, []);

  const addQuestion = () => {
    setQuestions((prev) => [
      ...prev,
      {
        question: "",
        type: "multiple-choice",
        options: ["", "", "", ""],
        correctAnswer: "",
        image: null,
      },
    ]);
  };

  const removeQuestion = (index) => {
    setQuestions((prev) => prev.filter((_, i) => i !== index));
  };

  const updateQuestion = (index, field, value) => {
    setQuestions((prev) => {
      const updated = [...prev];
      updated[index][field] = value;
      return updated;
    });
  };

  const updateOption = (qIndex, optIndex, value) => {
    setQuestions((prev) => {
      const updated = [...prev];
      updated[qIndex].options[optIndex] = value;
      return updated;
    });
  };

  const validateForm = () => {
    if (!title.trim()) {
      toast.error("Quiz title is required");
      return false;
    }

    if (!course) {
      toast.error("Please select a course");
      return false;
    }

    if (!startDate || !endDate) {
      toast.error("Please select start and end dates");
      return false;
    }

    if (new Date(endDate) <= new Date(startDate)) {
      toast.error("End date must be after start date");
      return false;
    }

    if (questions.length === 0) {
      toast.error("Add at least one question");
      return false;
    }

    for (let i = 0; i < questions.length; i++) {
      const q = questions[i];

      if (!q.question.trim()) {
        toast.error(`Question ${i + 1} is required`);
        return false;
      }

      if (q.options.some((opt) => !opt.trim())) {
        toast.error(`All options are required in question ${i + 1}`);
        return false;
      }

      if (!q.correctAnswer.trim()) {
        toast.error(`Correct answer is required in question ${i + 1}`);
        return false;
      }
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("title", title.trim());
      formData.append("course", course);
      formData.append("startAt", toUTC(startDate));
      formData.append("endAt", toUTC(endDate));
      formData.append("duration", 1);

      formData.append(
        "questions",
        JSON.stringify(
          questions.map((q) => ({
            question: q.question,
            type: q.type,
            options: q.options,
            correctAnswer: q.correctAnswer,
          }))
        )
      );

      if (image) {
        formData.append("image", image);
      }

      questions.forEach((q, index) => {
        if (q.image instanceof File) {
          formData.append("questionImages", q.image);
          formData.append("imageIndexes", index);
        }
      });

      await api.post("/quizzes", formData);

      toast.success("Quiz Created ✅");
      navigate(`/quizzes/${course}`);
    } catch (err) {
      console.log("❌ ERROR RESPONSE:", err.response?.data);
      console.log("❌ STATUS:", err.response?.status);
      console.log("❌ FULL ERROR:", err);

      toast.error(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 px-4 py-8 md:px-6 md:py-10 transition-colors duration-300">
      <div className="max-w-6xl mx-auto grid grid-cols-1 xl:grid-cols-[1fr_1.2fr] gap-6">
        {/* Left Side */}
        <div
          className="
            rounded-3xl border border-gray-200 dark:border-gray-800
            bg-white dark:bg-gray-900
            shadow-xl shadow-gray-200/40 dark:shadow-black/20
            overflow-hidden
            h-fit
          "
        >
          <div className="p-6 md:p-8 border-b border-gray-200 dark:border-gray-800">
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
              Quiz Builder
            </div>

            <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100">
              Create a new quiz
            </h1>

            <p className="mt-3 text-sm md:text-base leading-relaxed text-gray-500 dark:text-gray-400">
              Build your quiz, add questions, upload images, and assign it to one
              of your courses.
            </p>
          </div>

          <div className="p-6 md:p-8 space-y-5">
            <div
              className="
                rounded-2xl border border-gray-200 dark:border-gray-800
                bg-gray-50 dark:bg-gray-800/50
                p-5
              "
            >
              <p className="text-xs uppercase tracking-wider text-gray-400 dark:text-gray-500 mb-2">
                Summary
              </p>

              <div className="space-y-3">
                <div>
                  <p className="text-xs text-gray-400 dark:text-gray-500">
                    Title
                  </p>
                  <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                    {title || "Untitled Quiz"}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-gray-400 dark:text-gray-500">
                    Course
                  </p>
                  <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                    {courses.find((c) => c._id === course)?.title || "No course selected"}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-gray-400 dark:text-gray-500">
                    Questions
                  </p>
                  <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                    {questions.length} question{questions.length !== 1 ? "s" : ""}
                  </p>
                </div>
              </div>
            </div>

            <label
              className="
                flex flex-col items-center justify-center
                min-h-[220px] rounded-3xl cursor-pointer overflow-hidden
                border-2 border-dashed border-gray-300 dark:border-gray-700
                bg-gray-50 dark:bg-gray-800/50
                hover:bg-gray-100 dark:hover:bg-gray-800
                transition-all duration-200
              "
            >
              {image ? (
                <div className="relative w-full h-[220px]">
                  <img
                    src={URL.createObjectURL(image)}
                    alt="Quiz cover"
                    className="w-full h-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      setImage(null);
                    }}
                    className="
                      absolute top-3 right-3
                      px-3 py-1.5 rounded-xl
                      bg-red-600 hover:bg-red-500
                      text-white text-xs font-semibold
                    "
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <div className="text-center px-6">
                  <div
                    className="
                      w-16 h-16 rounded-2xl mx-auto mb-4
                      flex items-center justify-center
                      bg-purple-50 dark:bg-purple-500/10
                      text-purple-600 dark:text-purple-400
                      border border-purple-100 dark:border-purple-500/20
                    "
                  >
                    🖼️
                  </div>
                  <p className="text-sm font-semibold text-gray-800 dark:text-gray-100">
                    Upload quiz cover image
                  </p>
                  <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                    Optional image for the quiz
                  </p>
                </div>
              )}

              <input
                type="file"
                hidden
                accept="image/*"
                onChange={(e) => setImage(e.target.files[0])}
              />
            </label>
          </div>
        </div>

        {/* Right Side Form */}
        <form
          onSubmit={handleSubmit}
          className="
            rounded-3xl border border-gray-200 dark:border-gray-800
            bg-white dark:bg-gray-900
            shadow-xl shadow-gray-200/40 dark:shadow-black/20
            p-6 md:p-8
            space-y-6
          "
        >
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              Quiz Details
            </h2>
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
              Fill in the quiz details and add your questions below.
            </p>
          </div>

          {/* Title */}
          <div>
            <label className="block mb-2 text-sm font-semibold text-gray-700 dark:text-gray-200">
              Quiz Title
            </label>
            <input
              placeholder="Enter quiz title"
              className="
                w-full h-12 px-4 rounded-2xl
                border border-gray-200 dark:border-gray-700
                bg-gray-50 dark:bg-gray-800
                text-gray-900 dark:text-gray-100
                placeholder:text-gray-400 dark:placeholder:text-gray-500
                focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500
              "
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          {/* Course */}
          <div>
            <label className="block mb-2 text-sm font-semibold text-gray-700 dark:text-gray-200">
              Course
            </label>
            <select
              className="
                w-full h-12 px-4 rounded-2xl
                border border-gray-200 dark:border-gray-700
                bg-gray-50 dark:bg-gray-800
                text-gray-900 dark:text-gray-100
                focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500
              "
              value={course}
              onChange={(e) => setCourse(e.target.value)}
            >
              <option value="">Select Course</option>
              {courses.map((c) => (
                <option key={c._id} value={c._id}>
                  {c.title}
                </option>
              ))}
            </select>
          </div>

          {/* Dates */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block mb-2 text-sm font-semibold text-gray-700 dark:text-gray-200">
                Start Date
              </label>
              <input
                type="datetime-local"
                className="
                  w-full h-12 px-4 rounded-2xl
                  border border-gray-200 dark:border-gray-700
                  bg-gray-50 dark:bg-gray-800
                  text-gray-900 dark:text-gray-100
                  focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500
                "
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>

            <div>
              <label className="block mb-2 text-sm font-semibold text-gray-700 dark:text-gray-200">
                End Date
              </label>
              <input
                type="datetime-local"
                className="
                  w-full h-12 px-4 rounded-2xl
                  border border-gray-200 dark:border-gray-700
                  bg-gray-50 dark:bg-gray-800
                  text-gray-900 dark:text-gray-100
                  focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500
                "
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>
          </div>

          {/* Questions */}
          <div>
            <div className="flex items-center justify-between gap-3 mb-4">
              <div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">
                  Questions
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Add and manage quiz questions
                </p>
              </div>

              <button
                type="button"
                onClick={addQuestion}
                className="
                  px-4 py-2 rounded-2xl
                  bg-blue-600 hover:bg-blue-500
                  text-white text-sm font-semibold
                  transition-all duration-200
                  shadow-md hover:shadow-blue-500/25
                "
              >
                + Add Question
              </button>
            </div>

            {questions.length === 0 ? (
              <div
                className="
                  rounded-3xl border border-dashed border-gray-300 dark:border-gray-700
                  bg-gray-50 dark:bg-gray-800/40
                  p-10 text-center
                "
              >
                <div className="text-4xl mb-3">❓</div>
                <h4 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                  No questions yet
                </h4>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  Start by adding your first question.
                </p>
              </div>
            ) : (
              <div className="space-y-5">
                {questions.map((q, i) => (
                  <div
                    key={i}
                    className="
                      rounded-3xl border border-gray-200 dark:border-gray-800
                      bg-gray-50 dark:bg-gray-800/40
                      p-5
                    "
                  >
                    <div className="flex items-center justify-between gap-3 mb-4">
                      <h4 className="text-base font-bold text-gray-900 dark:text-gray-100">
                        Question {i + 1}
                      </h4>

                      <button
                        type="button"
                        onClick={() => removeQuestion(i)}
                        className="
                          px-3 py-1.5 rounded-xl
                          bg-red-600 hover:bg-red-500
                          text-white text-xs font-semibold
                        "
                      >
                        Remove
                      </button>
                    </div>

                    <div className="flex items-center gap-2 mb-4">
                      <input
                        placeholder="Enter question text"
                        className="
                          flex-1 h-12 px-4 rounded-2xl
                          border border-gray-200 dark:border-gray-700
                          bg-white dark:bg-gray-900
                          text-gray-900 dark:text-gray-100
                          placeholder:text-gray-400 dark:placeholder:text-gray-500
                          focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500
                        "
                        value={q.question}
                        onChange={(e) =>
                          updateQuestion(i, "question", e.target.value)
                        }
                      />

                      <label
                        className="
                          h-12 px-4 rounded-2xl cursor-pointer
                          flex items-center justify-center
                          bg-gray-200 hover:bg-gray-300
                          dark:bg-gray-700 dark:hover:bg-gray-600
                          text-gray-700 dark:text-gray-100
                          font-medium transition-all
                        "
                      >
                        📷
                        <input
                          type="file"
                          accept="image/*"
                          hidden
                          onChange={(e) => {
                            const file = e.target.files[0];
                            updateQuestion(i, "image", file);
                          }}
                        />
                      </label>
                    </div>

                    {q.image && (
                      <div className="mb-4">
                        <img
                          src={URL.createObjectURL(q.image)}
                          alt={`Question ${i + 1}`}
                          className="w-40 h-40 object-cover rounded-2xl border border-gray-200 dark:border-gray-700"
                        />
                      </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
                      {q.options.map((opt, j) => (
                        <input
                          key={j}
                          placeholder={`Option ${j + 1}`}
                          className="
                            w-full h-11 px-4 rounded-2xl
                            border border-gray-200 dark:border-gray-700
                            bg-white dark:bg-gray-900
                            text-gray-900 dark:text-gray-100
                            placeholder:text-gray-400 dark:placeholder:text-gray-500
                            focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500
                          "
                          value={opt}
                          onChange={(e) => updateOption(i, j, e.target.value)}
                        />
                      ))}
                    </div>

                    <div>
                      <label className="block mb-2 text-sm font-semibold text-gray-700 dark:text-gray-200">
                        Correct Answer
                      </label>
                      <input
                        placeholder="Enter the correct answer exactly"
                        className="
                          w-full h-12 px-4 rounded-2xl
                          border border-gray-200 dark:border-gray-700
                          bg-white dark:bg-gray-900
                          text-gray-900 dark:text-gray-100
                          placeholder:text-gray-400 dark:placeholder:text-gray-500
                          focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500
                        "
                        value={q.correctAnswer}
                        onChange={(e) =>
                          updateQuestion(i, "correctAnswer", e.target.value)
                        }
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Submit */}
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
                  Create Quiz
                </>
              )}
            </button>

            <button
              type="button"
              onClick={() => navigate(-1)}
              className="
                h-12 px-5 rounded-2xl
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
