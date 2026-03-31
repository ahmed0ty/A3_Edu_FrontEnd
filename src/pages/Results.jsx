// import { useEffect, useState } from "react";
// import { useParams } from "react-router-dom";

// export default function Results() {
//   const { attemptId } = useParams();
//   const [result, setResult] = useState(null);

//   const token = localStorage.getItem("token");

//  useEffect(() => {
//   const fetchResult = async () => {
//     try {
//       const res = await fetch(
//         `http://localhost:3000/quizzes/attempt/${attemptId}`,
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );

//       const data = await res.json();

//       console.log("API DATA:", data);

//       if (!res.ok) {
//         console.error("Fetch Error:", data);
//         return;
//       }

//       console.log("SET RESULT:", data.data);

//      setResult(data.data);
//     } catch (err) {
//       console.error("Unexpected error:", err);
//     }
//   };

//   fetchResult();
// }, [attemptId]);

// useEffect(() => {
//   console.log("RESULT STATE:", result);
//   console.log("ANSWERS:", result?.answers);
// }, [result]);

//   // 🔹 حماية من crash لو لسه مفيش بيانات
//   if (!result || !result.quiz) {
//     return (
//       <div className="text-white text-center mt-10">
//         Loading results...
//       </div>
//     );
//   }

//   const quiz = result.quiz;
//   const questions = quiz.questions || [];

//   const totalPoints = questions.reduce((acc, q) => acc + q.points, 0);
//   const percentage = Math.round((result.score / totalPoints) * 100);

//   return (
//     <div className="min-h-screen bg-gray-900 text-white p-6 flex justify-center">
//       <div className="bg-gray-800 p-8 rounded-2xl w-full max-w-3xl shadow-lg">
//         <h1 className="text-3xl font-bold mb-6 text-green-400 text-center">
//           🎉 Quiz Completed
//         </h1>

//         {/* Score */}
//         <div className="text-center mb-8">
//           <div className="text-lg text-gray-400">Your Score</div>
//           <div className="text-5xl font-bold text-blue-400">
//             {result.score} / {totalPoints}
//           </div>
//           <div className="text-xl mt-2">
//             {percentage}% {percentage >= 50 ? "✅ Passed" : "❌ Failed"}
//           </div>
//         </div>

//         {/* Time */}
//         <p className="text-gray-400 text-center mb-8">
//           Completed at: {new Date(result.completedAt).toLocaleString()}
//         </p>

//         {/* Review Questions */}
//        <div className="space-y-6">
//   {questions.map((q, index) => {
//     const userAnswer = result.answers?.find(
//     (a) => String(a.questionId) === String(q._id._id || q._id)
//     );

//     // ✅ Normalize function
//   const normalize = (val) =>
//   String(val)
//     .trim()
//     .toLowerCase();

//     // ✅ مقارنة صحيحة
// const isCorrect =
//   userAnswer &&
//   normalize(userAnswer.answer) === normalize(q.correctAnswer);

//     return (
//       <div key={q._id} className="bg-gray-700 p-5 rounded-xl">
//         <h3 className="font-bold mb-3">
//           {index + 1}. {q.question}
//         </h3>

//         <p>
//           Your Answer:{" "}
//           <span className={isCorrect ? "text-green-400" : "text-red-400"}>
//             {userAnswer ? String(userAnswer.answer) : "No Answer"}
//           </span>
//         </p>

//         <p>
//           Correct Answer:{" "}
//           <span className="text-green-400">
//             {String(q.correctAnswer)}
//           </span>
//         </p>

//         <p className="mt-2">
//           {isCorrect ? "✅ Correct" : "❌ Wrong"}
//         </p>
//       </div>
//     );
//   })}
// </div>

//         <div className="text-center mt-8">
//           <button
//             onClick={() => (window.location.href = "/dashboard")}
//             className="bg-blue-600 px-6 py-3 rounded-lg font-bold"
//           >
//             Back to Dashboard 🚀
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }






































import { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/axios";
import { Spinner } from "../components/Spinner";
import toast from "react-hot-toast";

export default function Results() {
  const { attemptId } = useParams();
  const navigate = useNavigate();

  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResult = async () => {
      try {
        setLoading(true);

        const res = await api.get(`/quizzes/attempt/${attemptId}`);
        const data = res.data;

        if (!data?.data) {
          toast.error("Failed to load results");
          return;
        }

        setResult(data.data);
      } catch (err) {
        console.error("Unexpected error:", err);
        toast.error(err.response?.data?.message || "Failed to load results");
      } finally {
        setLoading(false);
      }
    };

    fetchResult();
  }, [attemptId]);

  const normalize = (val) =>
    String(val ?? "")
      .trim()
      .toLowerCase();

  const quiz = result?.quiz;
  const questions = quiz?.questions || [];

  const totalPoints = useMemo(() => {
    return questions.reduce((acc, q) => acc + (q.points || 0), 0);
  }, [questions]);

  const percentage = useMemo(() => {
    if (!totalPoints) return 0;
    return Math.round(((result?.score || 0) / totalPoints) * 100);
  }, [result?.score, totalPoints]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950 transition-colors duration-300">
        <div className="flex flex-col items-center gap-4">
          <Spinner size="lg" variant="primary" />
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Loading results...
          </p>
        </div>
      </div>
    );
  }

  if (!result || !quiz) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950 px-4 transition-colors duration-300">
        <div
          className="
            w-full max-w-md rounded-3xl
            border border-gray-200 dark:border-gray-800
            bg-white dark:bg-gray-900
            shadow-xl p-8 text-center
          "
        >
          <div className="text-5xl mb-4">📄</div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            Results not available
          </h2>
          <p className="mt-3 text-sm text-gray-500 dark:text-gray-400">
            We could not load your quiz result right now.
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
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 px-4 py-8 md:px-6 md:py-10 transition-colors duration-300">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Header / Summary */}
        <div
          className="
            rounded-3xl border border-gray-200 dark:border-gray-800
            bg-white dark:bg-gray-900
            shadow-xl shadow-gray-200/40 dark:shadow-black/20
            p-6 md:p-8
          "
        >
          <div className="text-center">
            <div
              className={`
                inline-flex items-center gap-2
                px-3 py-1.5 rounded-full mb-5
                text-xs font-semibold border
                ${
                  percentage >= 50
                    ? "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-100 dark:border-emerald-500/20"
                    : "bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 border-red-100 dark:border-red-500/20"
                }
              `}
            >
              {percentage >= 50 ? "Passed" : "Failed"}
            </div>

            <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-gray-900 dark:text-gray-100">
              🎉 Quiz Completed
            </h1>

            <p className="mt-3 text-sm md:text-base text-gray-500 dark:text-gray-400">
              Here is your final performance summary.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
            <div
              className="
                rounded-2xl border border-gray-200 dark:border-gray-800
                bg-gray-50 dark:bg-gray-800/50
                p-5 text-center
              "
            >
              <p className="text-xs uppercase tracking-wider text-gray-400 dark:text-gray-500">
                Score
              </p>
              <p className="mt-2 text-3xl font-bold text-blue-600 dark:text-blue-400">
                {result.score} / {totalPoints}
              </p>
            </div>

            <div
              className="
                rounded-2xl border border-gray-200 dark:border-gray-800
                bg-gray-50 dark:bg-gray-800/50
                p-5 text-center
              "
            >
              <p className="text-xs uppercase tracking-wider text-gray-400 dark:text-gray-500">
                Percentage
              </p>
              <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-gray-100">
                {percentage}%
              </p>
            </div>

            <div
              className="
                rounded-2xl border border-gray-200 dark:border-gray-800
                bg-gray-50 dark:bg-gray-800/50
                p-5 text-center
              "
            >
              <p className="text-xs uppercase tracking-wider text-gray-400 dark:text-gray-500">
                Completed At
              </p>
              <p className="mt-2 text-sm font-semibold text-gray-700 dark:text-gray-200">
                {result.completedAt
                  ? new Date(result.completedAt).toLocaleString()
                  : "N/A"}
              </p>
            </div>
          </div>
        </div>

        {/* Questions Review */}
        <div
          className="
            rounded-3xl border border-gray-200 dark:border-gray-800
            bg-white dark:bg-gray-900
            shadow-xl shadow-gray-200/40 dark:shadow-black/20
            p-6 md:p-8
          "
        >
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              Review Answers
            </h2>
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
              Check your answers and compare them with the correct ones.
            </p>
          </div>

          <div className="space-y-5">
            {questions.map((q, index) => {
              const qId = q?._id?._id || q?._id;

              const userAnswer = result.answers?.find(
                (a) => String(a.questionId) === String(qId)
              );

              const isCorrect =
                userAnswer &&
                normalize(userAnswer.answer) === normalize(q.correctAnswer);

              return (
                <div
                  key={String(qId)}
                  className="
                    rounded-3xl border border-gray-200 dark:border-gray-800
                    bg-gray-50 dark:bg-gray-800/40
                    p-5
                  "
                >
                  <div className="flex items-start justify-between gap-3 mb-4">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">
                      {index + 1}. {q.question}
                    </h3>

                    <span
                      className={`
                        px-3 py-1 rounded-full text-xs font-semibold border whitespace-nowrap
                        ${
                          isCorrect
                            ? "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-100 dark:border-emerald-500/20"
                            : "bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 border-red-100 dark:border-red-500/20"
                        }
                      `}
                    >
                      {isCorrect ? "Correct" : "Wrong"}
                    </span>
                  </div>

                  {q.image && (
                    <div className="mb-4">
                      <img
                        src={q.image}
                        alt="question"
                        className="w-full max-h-80 object-contain rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900"
                      />
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div
                      className="
                        rounded-2xl border border-gray-200 dark:border-gray-700
                        bg-white dark:bg-gray-900
                        p-4
                      "
                    >
                      <p className="text-xs uppercase tracking-wider text-gray-400 dark:text-gray-500 mb-2">
                        Your Answer
                      </p>
                      <p
                        className={`font-semibold ${
                          isCorrect
                            ? "text-emerald-600 dark:text-emerald-400"
                            : "text-red-600 dark:text-red-400"
                        }`}
                      >
                        {userAnswer ? String(userAnswer.answer) : "No Answer"}
                      </p>
                    </div>

                    <div
                      className="
                        rounded-2xl border border-gray-200 dark:border-gray-700
                        bg-white dark:bg-gray-900
                        p-4
                      "
                    >
                      <p className="text-xs uppercase tracking-wider text-gray-400 dark:text-gray-500 mb-2">
                        Correct Answer
                      </p>
                      <p className="font-semibold text-emerald-600 dark:text-emerald-400">
                        {String(q.correctAnswer)}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="text-center mt-8">
            <button
              onClick={() => navigate("/dashboard")}
              className="
                px-6 py-3 rounded-2xl
                bg-blue-600 hover:bg-blue-500
                text-white font-bold
                transition-all duration-200
                shadow-md hover:shadow-blue-500/25
              "
            >
              Back to Dashboard 🚀
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}