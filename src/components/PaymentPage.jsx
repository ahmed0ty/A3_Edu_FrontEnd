// import { useState } from "react";
// import toast from "react-hot-toast";
// import { useNavigate, useLocation } from "react-router-dom";

// export default function PaymentPage() {
//   const navigate = useNavigate();
//   const location = useLocation();
//   const { course } = location.state || {};

//   const [senderNumber, setSenderNumber] = useState("");
//   const [receiptFile, setReceiptFile] = useState(null);
//   const [preview, setPreview] = useState(null);
//   const [isSubmitting, setIsSubmitting] = useState(false);

//   if (!course) {
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white p-4">
//         <p className="text-red-500 font-bold text-center">
//           Course data is missing. Please go back and try again.
//         </p>
//       </div>
//     );
//   }

//   const handleFileChange = (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       setReceiptFile(file);
//       setPreview(URL.createObjectURL(file));
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (!senderNumber || !receiptFile)
//       return toast("Please fill all fields");

//     try {
//       setIsSubmitting(true);

//       const formData = new FormData();
//       formData.append("receipt", receiptFile);
//       formData.append("senderNumber", senderNumber);
//       formData.append("courseId", course._id); // ✅ مهم

//       const token = localStorage.getItem("token");

//       const res = await fetch(
//         "http://localhost:3000/enrollments/confirm-payment",
//         {
//           method: "POST",
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//           body: formData,
//         }
//       );

//       const data = await res.json();

//       if (!res.ok) {
//         return toast(data.message || "Error submitting payment ❌");
//       }

//       toast("Payment submitted! Admin will verify it soon ✅");
//       navigate("/dashboard");

//     } catch (err) {
//       console.error(err);
//       toast("Something went wrong! ❌");
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white p-4">
//       <form
//         onSubmit={handleSubmit}
//         className="bg-gray-800 p-8 rounded-xl w-full max-w-md space-y-6 shadow-xl"
//       >
//         <h2 className="text-2xl font-bold mb-4 text-center">
//           Pay for {course.title}
//         </h2>

//         {/* Instructor Phone */}
//         <div>
//           <label className="block mb-1 font-semibold">
//             Send money to this number:
//           </label>
//           <div className="bg-gray-700 p-3 rounded text-white text-center font-mono tracking-wide">
//             {course.instructorPhone || "Instructor number not set"}
//           </div>
//         </div>

//         {/* Sender Number */}
//         <div>
//           <label className="block mb-1 font-semibold">
//             Your Number:
//           </label>
//           <input
//             type="text"
//             value={senderNumber}
//             onChange={(e) => setSenderNumber(e.target.value)}
//             placeholder="Enter your number"
//             className="w-full p-2 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
//           />
//         </div>

//         {/* Upload Receipt */}
//         <div>
//           <label className="block mb-2 font-semibold">
//             Upload receipt:
//           </label>

//           <label className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-gray-600 rounded-xl cursor-pointer bg-gray-700 hover:bg-gray-600 transition overflow-hidden">
            
//             {preview ? (
//               <div className="relative w-full h-full">
//                 <img
//                   src={preview}
//                   alt="Preview"
//                   className="h-full w-full object-cover"
//                 />

//                 <button
//                   type="button"
//                   onClick={(e) => {
//                     e.preventDefault();
//                     setReceiptFile(null);
//                     setPreview(null);
//                   }}
//                   className="absolute top-2 right-2 bg-red-600 hover:bg-red-700 text-white text-xs px-2 py-1 rounded"
//                 >
//                   Remove
//                 </button>
//               </div>
//             ) : (
//               <div className="flex flex-col items-center justify-center text-gray-300">
//                 <svg
//                   className="w-10 h-10 mb-2"
//                   fill="none"
//                   stroke="currentColor"
//                   strokeWidth="2"
//                   viewBox="0 0 24 24"
//                 >
//                   <path d="M12 4v16m8-8H4" />
//                 </svg>
//                 <p className="text-sm">Click or drag to upload</p>
//               </div>
//             )}

//             <input
//               type="file"
//               onChange={handleFileChange}
//               className="hidden"
//               accept="image/*"
//             />
//           </label>
//         </div>

//         {/* Submit */}
//         <button
//           type="submit"
//           disabled={isSubmitting}
//           className={`w-full py-2 rounded font-bold transition ${
//             isSubmitting
//               ? "bg-gray-500 cursor-not-allowed"
//               : "bg-green-600 hover:bg-green-700"
//           }`}
//         >
//           {isSubmitting ? "Submitting..." : "Submit Payment"}
//         </button>
//       </form>
//     </div>
//   );
// }





































import { useState } from "react";
import toast from "react-hot-toast";
import { useNavigate, useLocation } from "react-router-dom";

export default function PaymentPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { course } = location.state || {};

  const [senderNumber, setSenderNumber] = useState("");
  const [receiptFile, setReceiptFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!course) {
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
          <div className="text-4xl mb-3">⚠️</div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
            Course data is missing
          </h2>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            Please go back and try again.
          </p>
          <button
            onClick={() => navigate(-1)}
            className="
              mt-6 px-5 py-3 rounded-2xl
              bg-gray-100 hover:bg-gray-200
              dark:bg-gray-800 dark:hover:bg-gray-700
              text-gray-800 dark:text-gray-100
              font-medium transition-all
            "
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setReceiptFile(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!senderNumber || !receiptFile) {
      return toast.error("Please fill all fields");
    }

    try {
      setIsSubmitting(true);

      const formData = new FormData();
      formData.append("receipt", receiptFile);
      formData.append("senderNumber", senderNumber);
      formData.append("courseId", course._id);

      const token = localStorage.getItem("token");

      const res = await fetch(
        "http://localhost:3000/enrollments/confirm-payment",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );

      const data = await res.json();

      if (!res.ok) {
        return toast.error(data.message || "Error submitting payment ❌");
      }

      toast.success("Payment submitted! Admin will verify it soon ✅");
      navigate("/dashboard");
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong! ❌");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="
        min-h-screen flex items-center justify-center
        bg-gray-50 dark:bg-gray-950
        px-4 py-10
        transition-colors duration-300
      "
    >
      <div className="w-full max-w-5xl grid lg:grid-cols-2 gap-6 items-stretch animate-fadeIn">
        {/* Left Info Card */}
        <div
          className="
            rounded-3xl
            border border-gray-200 dark:border-gray-800
            bg-white dark:bg-gray-900
            shadow-xl shadow-gray-200/40 dark:shadow-black/20
            p-8 md:p-10
            flex flex-col justify-between
          "
        >
          <div>
            <div
              className="
                inline-flex items-center gap-2
                px-3 py-1 rounded-full mb-5
                bg-blue-50 dark:bg-blue-500/10
                text-blue-600 dark:text-blue-400
                text-xs font-semibold
                border border-blue-100 dark:border-blue-500/20
              "
            >
              Secure Payment
            </div>

            <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100">
              Complete your enrollment
            </h1>

            <p className="mt-3 text-sm md:text-base leading-relaxed text-gray-500 dark:text-gray-400">
              Submit your payment details and upload the transfer receipt to
              complete enrollment for this course.
            </p>

            <div
              className="
                mt-8 rounded-2xl
                border border-gray-200 dark:border-gray-800
                bg-gray-50 dark:bg-gray-800/50
                p-5
              "
            >
              <p className="text-xs uppercase tracking-wider text-gray-400 dark:text-gray-500 mb-2">
                Course
              </p>
              <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100">
                {course.title}
              </h2>

              {course.price && (
                <div className="mt-4 inline-flex items-center px-3 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-sm font-semibold border border-emerald-100 dark:border-emerald-500/20">
                  {course.price} EGP
                </div>
              )}
            </div>

            <div
              className="
                mt-5 rounded-2xl
                border border-amber-200 dark:border-amber-500/20
                bg-amber-50 dark:bg-amber-500/10
                p-4
              "
            >
              <p className="text-sm font-semibold text-amber-700 dark:text-amber-300">
                Send money to this number
              </p>
              <p className="mt-2 text-lg font-bold tracking-wider text-gray-900 dark:text-gray-100 font-mono">
                {course.instructorPhone || "Instructor number not set"}
              </p>
            </div>
          </div>

          <div className="mt-8 text-xs text-gray-400 dark:text-gray-500 leading-relaxed">
            Make sure the uploaded receipt is clear and readable to speed up
            verification.
          </div>
        </div>

        {/* Form Card */}
        <form
          onSubmit={handleSubmit}
          className="
            rounded-3xl
            border border-gray-200 dark:border-gray-800
            bg-white dark:bg-gray-900
            shadow-xl shadow-gray-200/40 dark:shadow-black/20
            p-8 md:p-10
            space-y-6
          "
        >
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              Payment Details
            </h2>
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
              Fill in your payment information and attach the receipt.
            </p>
          </div>

          {/* Sender Number */}
          <div>
            <label className="block mb-2 text-sm font-semibold text-gray-700 dark:text-gray-200">
              Your Number
            </label>
            <input
              type="text"
              value={senderNumber}
              onChange={(e) => setSenderNumber(e.target.value)}
              placeholder="Enter your number"
              className="
                w-full h-12 px-4 rounded-2xl
                border border-gray-200 dark:border-gray-700
                bg-gray-50 dark:bg-gray-800
                text-gray-900 dark:text-gray-100
                placeholder:text-gray-400 dark:placeholder:text-gray-500
                focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500
                transition-all duration-200
              "
            />
          </div>

          {/* Upload Receipt */}
          <div>
            <label className="block mb-2 text-sm font-semibold text-gray-700 dark:text-gray-200">
              Upload receipt
            </label>

            <label
              className="
                relative flex flex-col items-center justify-center
                w-full min-h-[220px]
                rounded-3xl cursor-pointer overflow-hidden
                border-2 border-dashed border-gray-300 dark:border-gray-700
                bg-gray-50 dark:bg-gray-800/60
                hover:bg-gray-100 dark:hover:bg-gray-800
                transition-all duration-200
              "
            >
              {preview ? (
                <div className="relative w-full h-[220px]">
                  <img
                    src={preview}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />

                  <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black/70 to-transparent">
                    <div className="flex items-center justify-between gap-3">
                      <p className="text-white text-sm font-medium truncate">
                        {receiptFile?.name}
                      </p>

                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          setReceiptFile(null);
                          setPreview(null);
                        }}
                        className="
                          px-3 py-1.5 rounded-xl
                          bg-red-600 hover:bg-red-500
                          text-white text-xs font-semibold
                          transition-all
                        "
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center text-center px-6">
                  <div
                    className="
                      w-16 h-16 rounded-2xl
                      flex items-center justify-center mb-4
                      bg-blue-50 dark:bg-blue-500/10
                      text-blue-600 dark:text-blue-400
                      border border-blue-100 dark:border-blue-500/20
                    "
                  >
                    <svg
                      className="w-8 h-8"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 16V4m0 0l-4 4m4-4l4 4M4 16.5v1A2.5 2.5 0 006.5 20h11a2.5 2.5 0 002.5-2.5v-1"
                      />
                    </svg>
                  </div>

                  <p className="text-sm font-semibold text-gray-800 dark:text-gray-100">
                    Click to upload receipt
                  </p>
                  <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                    JPG, PNG or clear transfer screenshot
                  </p>
                </div>
              )}

              <input
                type="file"
                onChange={handleFileChange}
                className="hidden"
                accept="image/*"
              />
            </label>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isSubmitting}
            className={`
              w-full h-12 rounded-2xl
              font-bold text-sm text-white
              transition-all duration-200
              ${
                isSubmitting
                  ? "bg-gray-400 dark:bg-gray-700 cursor-not-allowed"
                  : "bg-emerald-600 hover:bg-emerald-500 shadow-md hover:shadow-emerald-500/25"
              }
            `}
          >
            {isSubmitting ? "Submitting..." : "Submit Payment"}
          </button>
        </form>
      </div>
    </div>
  );
}