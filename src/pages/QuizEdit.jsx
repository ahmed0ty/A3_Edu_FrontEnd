// // src/pages/QuizEdit.jsx
// import { useEffect, useState } from "react";
// import toast from "react-hot-toast";
// import { useParams, useNavigate } from "react-router-dom";

// export default function QuizEdit() {
//   const { id } = useParams();
//   const navigate = useNavigate();
//   const token = localStorage.getItem("token");

//   const [title, setTitle] = useState("");
//   const [course, setCourse] = useState("");
//   const [startDate, setStartDate] = useState("");
//   const [endDate, setEndDate] = useState("");
//   const [questions, setQuestions] = useState([]);
//   const [image, setImage] = useState(null);

//   // const toUTC = (dateStr) => {
//   //   if (!dateStr) return null;
//   //   return new Date(dateStr).toISOString();
//   // };

//   useEffect(() => {
//   const fetchQuiz = async () => {
//     try {
//       const res = await fetch(`http://localhost:3000/quizzes/${id}`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });

//       const data = await res.json();

//       if (!res.ok) return toast.error(data.message || "Error fetching quiz");

//       const quiz = data.data;

//       setTitle(quiz.title);
//       setCourse(quiz.course);

//       // ✅ تحويل لـ Local Time عشان يظهر صح في datetime-local
//   const formatLocal = (date) => {
//   const d = new Date(date);
//   const offset = d.getTimezoneOffset();
//   const local = new Date(d.getTime() - offset * 60000);
//   return local.toISOString().slice(0, 16);
// };

//       setStartDate(
//         quiz.startAt ? formatLocal(quiz.startAt) : ""
//       );

//       setEndDate(
//         quiz.endAt ? formatLocal(quiz.endAt) : ""
//       );

//       setQuestions(quiz.questions || []);
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   fetchQuiz();
// }, [id, token]);

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

//   const updateQuestion = (index, field, value) => {
//     const updated = [...questions];
//     updated[index][field] = value;
//     setQuestions(updated);
//   };

//   const updateOption = (qIndex, optIndex, value) => {
//     const updated = [...questions];
//     updated[qIndex].options[optIndex] = value;
//     setQuestions(updated);
//   };

//   // 🚀 Submit (مهم جدًا: FormData)
//   const handleSubmit = async () => {
//     try {
//       const formData = new FormData();

//       formData.append("title", title);
//       formData.append("course", course);
// formData.append("startAt", new Date(startDate).toISOString());
// formData.append("endAt", new Date(endDate).toISOString());
// formData.append(
//   "questions",
//   JSON.stringify(
//     questions.map((q) => ({
//       question: q.question,
//       type: q.type,
//       options: q.options,
//       correctAnswer: q.correctAnswer,
//       image: q.image instanceof File ? null : q.image, // لو فيه لينك قديم
//     }))
//   )
// );
//       formData.append("duration", 10);

//       // 🔥 لو فيه صورة عامة للـ quiz
//       if (image) {
//         formData.append("image", image);
//       }

//       questions.forEach((q, index) => {
//   if (q.image instanceof File) {
//     formData.append("questionImages", q.image);
//     formData.append("imageIndexes", index);
//   }
// });

//       const res = await fetch(`http://localhost:3000/quizzes/${id}`, {
//         method: "PUT",
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//         body: formData,
//       });

//       let data;
//       try {
//         data = await res.json();
//       } catch {
//         throw new Error("Invalid server response");
//       }

//       if (!res.ok) {
//         return toast.error(data?.message || "Error updating quiz");
//       }

//       toast.success("Quiz Updated ✅");
//       navigate("/dashboard");
//     } catch (err) {
//       console.error(err);
//       toast.error(err.message || "Something went wrong");
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gray-900 text-white p-6">
//       <h1 className="text-3xl font-bold mb-6">Edit Quiz</h1>

//       {/* Title */}
//       <input
//         placeholder="Quiz Title"
//         className="block w-full p-2 mb-4 bg-gray-800"
//         value={title}
//         onChange={(e) => setTitle(e.target.value)}
//       />

//       {/* Hidden Course */}
//       <input type="hidden" value={course} />

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

//             {/* 📷 Upload */}
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
//         {q.image && (
//   <img
//     src={
//       q.image instanceof File
//         ? URL.createObjectURL(q.image)
//         : q.image
//     }
//     className="w-40 h-40 object-cover mb-2"
//   />
// )}

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
//         Update Quiz 🚀
//       </button>
//     </div>
//   );
// }





















// src/pages/QuizEdit.jsx
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/axios";
import { Spinner } from "../components/Spinner";

export default function QuizEdit() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [course, setCourse] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [questions, setQuestions] = useState([]);
  const [image, setImage] = useState(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const formatLocal = (date) => {
    const d = new Date(date);
    const offset = d.getTimezoneOffset();
    const local = new Date(d.getTime() - offset * 60000);
    return local.toISOString().slice(0, 16);
  };

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        setLoading(true);

        const res = await api.get(`/quizzes/${id}`);
        const quiz = res.data?.data;

        if (!quiz) {
          toast.error("Quiz not found");
          return;
        }

        setTitle(quiz.title || "");
        setCourse(
          typeof quiz.course === "object" ? quiz.course?._id : quiz.course || ""
        );
        setStartDate(quiz.startAt ? formatLocal(quiz.startAt) : "");
        setEndDate(quiz.endAt ? formatLocal(quiz.endAt) : "");
        setQuestions(quiz.questions || []);
      } catch (err) {
        console.error(err);
        toast.error(err.response?.data?.message || "Error fetching quiz");
      } finally {
        setLoading(false);
      }
    };

    fetchQuiz();
  }, [id]);

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
      toast.error("Course is missing");
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

      if (!q.question?.trim()) {
        toast.error(`Question ${i + 1} is required`);
        return false;
      }

      if (q.type === "multiple-choice") {
        if (!Array.isArray(q.options) || q.options.some((opt) => !opt?.trim())) {
          toast.error(`All options are required in question ${i + 1}`);
          return false;
        }
      }

      if (q.correctAnswer === "" || q.correctAnswer === null || q.correctAnswer === undefined) {
        toast.error(`Correct answer is required in question ${i + 1}`);
        return false;
      }
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e?.preventDefault?.();

    if (!validateForm()) return;

    try {
      setSaving(true);

      const formData = new FormData();
      formData.append("title", title.trim());
      formData.append("course", course);
      formData.append("startAt", new Date(startDate).toISOString());
      formData.append("endAt", new Date(endDate).toISOString());
      formData.append("duration", 10);

      formData.append(
        "questions",
        JSON.stringify(
          questions.map((q) => ({
            question: q.question,
            type: q.type,
            options: q.options,
            correctAnswer: q.correctAnswer,
            image: q.image instanceof File ? null : q.image,
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

      await api.put(`/quizzes/${id}`, formData);

      toast.success("Quiz updated successfully ✅");
      navigate("/dashboard");
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Error updating quiz");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950 transition-colors duration-300">
        <div className="flex flex-col items-center gap-4">
          <Spinner size="lg" variant="primary" />
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Loading quiz...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 px-4 py-8 md:px-6 md:py-10 transition-colors duration-300">
      <div className="max-w-6xl mx-auto grid grid-cols-1 xl:grid-cols-[1fr_1.2fr] gap-6">
        {/* Left Side */}
        <div
          className="
            rounded-3xl border border-gray-200 dark:border-gray-800
            bg-white dark:bg-gray-900
            shadow-xl shadow-gray-200/40 dark:shadow-black/20
            overflow-hidden h-fit
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
              Quiz Editor
            </div>

            <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100">
              Edit Quiz
            </h1>

            <p className="mt-3 text-sm md:text-base leading-relaxed text-gray-500 dark:text-gray-400">
              Update quiz details, edit questions, and save your changes.
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
                  <p className="text-xs text-gray-400 dark:text-gray-500">Title</p>
                  <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                    {title || "Untitled Quiz"}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-gray-400 dark:text-gray-500">Questions</p>
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
                    Upload new quiz cover
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

        {/* Right Side */}
        <form
          onSubmit={handleSubmit}
          className="
            rounded-3xl border border-gray-200 dark:border-gray-800
            bg-white dark:bg-gray-900
            shadow-xl shadow-gray-200/40 dark:shadow-black/20
            p-6 md:p-8 space-y-6
          "
        >
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              Quiz Details
            </h2>
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
              Edit quiz information and update the questions below.
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

          {/* Hidden Course */}
          <input type="hidden" value={course} readOnly />

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
                  Edit and manage quiz questions
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
                          src={q.image instanceof File ? URL.createObjectURL(q.image) : q.image}
                          alt={`Question ${i + 1}`}
                          className="w-40 h-40 object-cover rounded-2xl border border-gray-200 dark:border-gray-700"
                        />
                      </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
                      {q.options?.map((opt, j) => (
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
                    : "bg-emerald-600 hover:bg-emerald-500 shadow-md hover:shadow-emerald-500/25"
                }
              `}
            >
              {saving ? (
                <>
                  <Spinner size="sm" variant="white" />
                  Updating...
                </>
              ) : (
                <>
                  <span>🚀</span>
                  Update Quiz
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