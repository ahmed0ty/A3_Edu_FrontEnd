// import { useEffect, useState, useRef } from "react";
// import toast from "react-hot-toast";
// import { useParams, useNavigate } from "react-router-dom";
// import api from "../api/axios"
// export default function QuizAttempt() {
//   const { attemptId } = useParams();
//   const navigate = useNavigate();

//   const [quiz, setQuiz] = useState(null);
//   const [current, setCurrent] = useState(0);
//   const [answers, setAnswers] = useState({});
//   const [timeLeft, setTimeLeft] = useState(0);
//   const [isTimeUp, setIsTimeUp] = useState(false);

//   const token = localStorage.getItem("token");
//   const submittedRef = useRef(false);

//   // 🔥 Fetch attempt
//   useEffect(() => {
//     const fetchAttempt = async () => {
//       try {
//        const res = await api.get(`/quizzes/attempt/${attemptId}`);
// const data = res.data;

//         // 🔴 مهم: completed موجود هنا داخل data.data
//         if (data.completed) {
//           navigate(`/results/${attemptId}`);
//           return;
//         }

//         const attempt = data.data;

//         if (!attempt || !attempt.quiz) {
//           console.error("Invalid attempt data");
//           return;
//         }

//         setQuiz(attempt.quiz);

//         const expires = new Date(attempt.expiresAt).getTime();
//         const now = Date.now();
//         const seconds = Math.floor((expires - now) / 1000);

//         if (seconds <= 0) {
//           setIsTimeUp(true);
//         } else {
//           setTimeLeft(seconds);
//         }
//       } catch (err) {
//         console.error(err);
//       }
//     };

//     fetchAttempt();
//   }, [attemptId, navigate, token]);

//   // ⏱️ Timer (مُصحح)
//   useEffect(() => {
//     if (!timeLeft) return;

//     if (timeLeft <= 0) {
//       setIsTimeUp(true);
//       return;
//     }

//     const timer = setInterval(() => {
//       setTimeLeft((t) => {
//         if (t <= 1) {
//           clearInterval(timer);
//           setIsTimeUp(true);
//           return 0;
//         }
//         return t - 1;
//       });
//     }, 1000);

//     return () => clearInterval(timer);
//   }, [timeLeft]);

//   const formatTime = (t) => {
//     const m = Math.floor(t / 60);
//     const s = t % 60;
//     return `${m}:${s < 10 ? "0" : ""}${s}`;
//   };

// const handleAnswer = (value) => {
//   const questionId = quiz.questions[current]._id;

//   setAnswers((prev) => ({
//     ...prev,
//     [questionId]: value,
//   }));
// };
//   // 🔥 Submit Quiz

// const submitQuiz = async () => {
//   if (!quiz || submittedRef.current) return;

//   submittedRef.current = true;

//   try {
//     // ✅ axios بدل fetch
//     const res = await api.post(
//       `/quizzes/attempt/${attemptId}/submit`,
//       {
//         answers: Object.keys(answers).map((questionId) => ({
//           questionId,
//           answer: answers[questionId],
//         })),
//       }
//     );

//     const data = res.data;

//     // ❌ فشل من الباك
//     if (!data || data.success === false) {
//       toast.error(data?.message || "Error submitting quiz");
//       submittedRef.current = false; // 👈 رجعها عشان يقدر يجرب تاني
//       return;
//     }

//     // ✅ نجاح
//     navigate(`/results/${attemptId}`);

//   } catch (err) {
//     console.error("❌ SUBMIT QUIZ ERROR:", err);

//     const message =
//       err.response?.data?.message || "Network error";

//     toast.error(message);

//     submittedRef.current = false; // 👈 مهم جدًا في حالة الخطأ
//   }
// };

//   // 🚨 وقت انتهى
//   if (isTimeUp) {
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
//         <div className="text-center bg-gray-800 p-10 rounded-2xl shadow-lg">
//           <h1 className="text-3xl font-bold text-red-500 mb-4">
//             ⏱ Time’s Up!
//           </h1>

//           <button
//   onClick={() => navigate(`/results/${attemptId}`)}
//   className="bg-green-600 px-6 py-3 rounded-lg font-bold"
// >
//   View Results 🚀
// </button>
//         </div>
//       </div>
//     );
//   }

//   // 🔴 Loading
//   if (!quiz || !quiz.questions) {
//     return (
//       <div className="h-screen flex items-center justify-center text-white">
//         Loading...
//       </div>
//     );
//   }

//   const question = quiz.questions[current];
//   const progress = ((current + 1) / quiz.questions.length) * 100;

//   return (
//     <div className="min-h-screen bg-gray-900 text-white p-6 flex flex-col items-center">

//       {/* Header */}
//       <div className="w-full max-w-3xl flex justify-between items-center mb-6">
//         <h1 className="text-2xl font-bold">{quiz.title}</h1>

//         <div className="bg-red-600 px-4 py-2 rounded-lg font-bold">
//           ⏱ {formatTime(timeLeft)}
//         </div>
//       </div>

//       {/* Progress */}
//       <div className="w-full max-w-3xl bg-gray-700 h-2 rounded mb-6">
//         <div
//           className="bg-blue-500 h-2 rounded"
//           style={{ width: `${progress}%` }}
//         />
//       </div>

//       {/* Question */}
//       <div className="w-full max-w-3xl bg-gray-800 p-6 rounded-xl shadow-lg">
//         <h2 className="text-xl mb-6 font-semibold">
//           {current + 1}. {question.question}
//         </h2>

//         {question.image && (
//   <img
//     src={question.image}
//     alt="question"
//     className="w-full max-h-80 object-contain mb-4 rounded-lg"
//   />
// )}

//         {/* Options */}
//         {question.type === "multiple-choice" && (
//           <div className="space-y-3">
// {question.options.map((opt, i) => (
//   <button
//     key={i}
//     onClick={() => handleAnswer(opt)}
//     className={`w-full text-left p-3 rounded-lg border ${
//       answers[question._id] === opt
//         ? "bg-blue-600"
//         : "bg-gray-700"
//     }`}
//   >
//     {opt}
//   </button>
// ))}
//           </div>
//         )}

//         {/* True / False */}
//         {question.type === "true-false" && (
//           <div className="flex gap-4">
//             <button
//   onClick={() => handleAnswer(true)}
//   className={`flex-1 p-3 rounded-lg ${
//     answers[question._id] === true
//       ? "bg-green-600"
//       : "bg-gray-700"
//   }`}
// >
//   True
// </button>

// <button
//   onClick={() => handleAnswer(false)}
//   className={`flex-1 p-3 rounded-lg ${
//     answers[question._id] === false
//       ? "bg-red-600"
//       : "bg-gray-700"
//   }`}
// >
//   False
// </button>
//           </div>
//         )}
//       </div>

//       {/* Navigation */}
//       <div className="w-full max-w-3xl flex justify-between mt-6">
//         <button
//           onClick={() => setCurrent((c) => c - 1)}
//           disabled={current === 0}
//           className="px-4 py-2 bg-gray-700 rounded disabled:opacity-50"
//         >
//           ⬅ Prev
//         </button>

//         {current === quiz.questions.length - 1 ? (
//           <button
//             onClick={submitQuiz}
//             className="px-6 py-2 bg-green-600 rounded font-bold"
//           >
//             Submit 🚀
//           </button>
//         ) : (
//           <button
//             onClick={() => setCurrent((c) => c + 1)}
//             className="px-4 py-2 bg-blue-600 rounded"
//           >
//             Next ➡
//           </button>
//         )}
//       </div>

//     </div>
//   );
// }



































import { useEffect, useState, useRef } from "react";
import toast from "react-hot-toast";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/axios";
import { Spinner } from "../components/Spinner";

export default function QuizAttempt() {
  const { attemptId } = useParams();
  const navigate = useNavigate();

  const [quiz, setQuiz] = useState(null);
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(0);
  const [isTimeUp, setIsTimeUp] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const submittedRef = useRef(false);

  // ================= FETCH ATTEMPT =================
  useEffect(() => {
    const fetchAttempt = async () => {
      try {
        setLoading(true);

        const res = await api.get(`/quizzes/attempt/${attemptId}`);
        const data = res.data;

        if (data?.completed) {
          navigate(`/results/${attemptId}`);
          return;
        }

        const attempt = data?.data;

        if (!attempt || !attempt.quiz) {
          console.error("Invalid attempt data");
          return;
        }

        setQuiz(attempt.quiz);

        const expires = new Date(attempt.expiresAt).getTime();
        const now = Date.now();
        const seconds = Math.floor((expires - now) / 1000);

        if (seconds <= 0) {
          setIsTimeUp(true);
          setTimeLeft(0);
        } else {
          setTimeLeft(seconds);
        }
      } catch (err) {
        console.error(err);
        toast.error(
          err.response?.data?.message || "Failed to load quiz attempt"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchAttempt();
  }, [attemptId, navigate]);

  // ================= TIMER =================
  useEffect(() => {
    if (!timeLeft) return;

    if (timeLeft <= 0) {
      setIsTimeUp(true);
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          clearInterval(timer);
          setIsTimeUp(true);
          return 0;
        }
        return t - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  const formatTime = (t) => {
    const m = Math.floor(t / 60);
    const s = t % 60;
    return `${m}:${s < 10 ? "0" : ""}${s}`;
  };

  const handleAnswer = (value) => {
    const questionId = quiz.questions[current]._id;

    setAnswers((prev) => ({
      ...prev,
      [questionId]: value,
    }));
  };

  // ================= SUBMIT QUIZ =================
  const submitQuiz = async () => {
    if (!quiz || submittedRef.current) return;

    submittedRef.current = true;
    setSubmitting(true);

    try {
      const res = await api.post(`/quizzes/attempt/${attemptId}/submit`, {
        answers: Object.keys(answers).map((questionId) => ({
          questionId,
          answer: answers[questionId],
        })),
      });

      const data = res.data;

      if (!data || data.success === false) {
        toast.error(data?.message || "Error submitting quiz");
        submittedRef.current = false;
        setSubmitting(false);
        return;
      }

      navigate(`/results/${attemptId}`);
    } catch (err) {
      console.error("SUBMIT QUIZ ERROR:", err);

      const message = err.response?.data?.message || "Network error";
      toast.error(message);

      submittedRef.current = false;
      setSubmitting(false);
    }
  };

  // ================= TIME UP =================
  if (isTimeUp) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950 px-4 transition-colors duration-300">
        <div
          className="
            w-full max-w-md text-center
            rounded-3xl
            border border-red-200 dark:border-red-500/20
            bg-white dark:bg-gray-900
            shadow-xl shadow-gray-200/40 dark:shadow-black/20
            p-10
          "
        >
          <div className="text-6xl mb-4">⏱</div>

          <h1 className="text-3xl font-bold text-red-600 dark:text-red-400 mb-3">
            Time&apos;s Up!
          </h1>

          <p className="text-gray-500 dark:text-gray-400 mb-6">
            Your quiz time has ended. You can now view your results.
          </p>

          <button
            onClick={() => navigate(`/results/${attemptId}`)}
            className="
              px-6 py-3 rounded-2xl
              bg-emerald-600 hover:bg-emerald-500
              text-white font-bold
              transition-all duration-200
              shadow-md hover:shadow-emerald-500/25
            "
          >
            View Results 🚀
          </button>
        </div>
      </div>
    );
  }

  // ================= LOADING =================
  if (loading || !quiz || !quiz.questions) {
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

  const question = quiz.questions[current];
  const progress = ((current + 1) / quiz.questions.length) * 100;
  const selectedAnswer = answers[question._id];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 px-4 py-6 md:px-6 md:py-8 transition-colors duration-300">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Header */}
        <div
          className="
            rounded-3xl border border-gray-200 dark:border-gray-800
            bg-white dark:bg-gray-900
            shadow-sm
            p-5 md:p-6
          "
        >
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <p className="text-sm font-medium text-blue-600 dark:text-blue-400 mb-2">
                Quiz Attempt
              </p>
              <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100">
                {quiz.title}
              </h1>
              <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                Question {current + 1} of {quiz.questions.length}
              </p>
            </div>

            <div
              className="
                inline-flex items-center gap-2
                px-4 py-3 rounded-2xl
                bg-red-50 dark:bg-red-500/10
                border border-red-100 dark:border-red-500/20
                text-red-600 dark:text-red-400
                font-bold text-lg
                w-fit
              "
            >
              <span>⏱</span>
              {formatTime(timeLeft)}
            </div>
          </div>

          {/* Progress */}
          <div className="mt-6">
            <div className="flex items-center justify-between mb-2 text-xs font-medium text-gray-500 dark:text-gray-400">
              <span>Progress</span>
              <span>{Math.round(progress)}%</span>
            </div>

            <div className="w-full h-3 rounded-full bg-gray-200 dark:bg-gray-800 overflow-hidden">
              <div
                className="h-full rounded-full bg-blue-600 dark:bg-blue-500 transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>

        {/* Question Card */}
        <div
          className="
            rounded-3xl border border-gray-200 dark:border-gray-800
            bg-white dark:bg-gray-900
            shadow-sm
            p-6 md:p-8
          "
        >
          <div className="mb-6">
            <div
              className="
                inline-flex items-center px-3 py-1 rounded-full mb-4
                bg-blue-50 dark:bg-blue-500/10
                border border-blue-100 dark:border-blue-500/20
                text-blue-600 dark:text-blue-400
                text-xs font-semibold
              "
            >
              Question {current + 1}
            </div>

            <h2 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-gray-100 leading-relaxed">
              {question.question}
            </h2>
          </div>

          {question.image && (
            <div className="mb-6">
              <img
                src={question.image}
                alt="question"
                className="w-full max-h-96 object-contain rounded-3xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50"
              />
            </div>
          )}

          {/* Multiple Choice */}
          {question.type === "multiple-choice" && (
            <div className="space-y-3">
              {question.options.map((opt, i) => {
                const isSelected = selectedAnswer === opt;

                return (
                  <button
                    key={i}
                    onClick={() => handleAnswer(opt)}
                    className={`
                      w-full text-left px-4 py-4 rounded-2xl border transition-all duration-200
                      ${
                        isSelected
                          ? "bg-blue-600 border-blue-600 text-white shadow-md shadow-blue-500/20"
                          : "bg-gray-50 hover:bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-700 border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-100"
                      }
                    `}
                  >
                    <span className="font-semibold mr-2">
                      {String.fromCharCode(65 + i)}.
                    </span>
                    {opt}
                  </button>
                );
              })}
            </div>
          )}

          {/* True / False */}
          {question.type === "true-false" && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <button
                onClick={() => handleAnswer(true)}
                className={`
                  h-14 rounded-2xl font-semibold transition-all duration-200
                  ${
                    selectedAnswer === true
                      ? "bg-emerald-600 text-white shadow-md shadow-emerald-500/20"
                      : "bg-gray-50 hover:bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-100"
                  }
                `}
              >
                True
              </button>

              <button
                onClick={() => handleAnswer(false)}
                className={`
                  h-14 rounded-2xl font-semibold transition-all duration-200
                  ${
                    selectedAnswer === false
                      ? "bg-red-600 text-white shadow-md shadow-red-500/20"
                      : "bg-gray-50 hover:bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-100"
                  }
                `}
              >
                False
              </button>
            </div>
          )}
        </div>

        {/* Footer Navigation */}
        <div
          className="
            rounded-3xl border border-gray-200 dark:border-gray-800
            bg-white dark:bg-gray-900
            shadow-sm
            p-5
          "
        >
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <button
              onClick={() => setCurrent((c) => c - 1)}
              disabled={current === 0}
              className={`
                w-full sm:w-auto px-5 h-12 rounded-2xl font-semibold transition-all duration-200
                ${
                  current === 0
                    ? "bg-gray-200 dark:bg-gray-800 text-gray-400 cursor-not-allowed"
                    : "bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-gray-700"
                }
              `}
            >
              ⬅ Prev
            </button>

            <div className="text-sm text-gray-500 dark:text-gray-400">
              Answered: {Object.keys(answers).length} / {quiz.questions.length}
            </div>

            {current === quiz.questions.length - 1 ? (
              <button
                onClick={submitQuiz}
                disabled={submitting}
                className={`
                  w-full sm:w-auto px-6 h-12 rounded-2xl font-bold text-white transition-all duration-200 flex items-center justify-center gap-2
                  ${
                    submitting
                      ? "bg-gray-400 dark:bg-gray-700 cursor-not-allowed"
                      : "bg-emerald-600 hover:bg-emerald-500 shadow-md hover:shadow-emerald-500/25"
                  }
                `}
              >
                {submitting ? (
                  <>
                    <Spinner size="sm" variant="white" />
                    Submitting...
                  </>
                ) : (
                  "Submit 🚀"
                )}
              </button>
            ) : (
              <button
                onClick={() => setCurrent((c) => c + 1)}
                className="
                  w-full sm:w-auto px-5 h-12 rounded-2xl font-semibold
                  bg-blue-600 hover:bg-blue-500 text-white
                  transition-all duration-200
                  shadow-md hover:shadow-blue-500/25
                "
              >
                Next ➡
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}