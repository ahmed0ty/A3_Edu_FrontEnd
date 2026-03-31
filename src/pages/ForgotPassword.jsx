// import { useState } from "react";
// import axios from "../api/axios";
// import { useNavigate } from "react-router-dom";
// import { Spinner } from "../components/Spinner";
// import {
//   showSuccess,
//   showError,
//   showLoading,
//   dismissToast,
// } from "../utils/toast";

// export default function ForgotPassword() {
//   const [email, setEmail] = useState("");
//   const [loading, setLoading] = useState(false);

//   const navigate = useNavigate();

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     setLoading(true);
//     const toastId = showLoading("Sending OTP...");

//     try {
//       const res = await axios.post("/auth/forgot-password", {
//         email,
//       });

//       dismissToast(toastId);
//       showSuccess("OTP sent successfully 📩");

//       navigate("/reset-password", { state: { email } });
//     } catch (err) {
//       dismissToast(toastId);
//       showError(err.response?.data?.message || "Error sending OTP");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
//       <form
//         onSubmit={handleSubmit}
//         className="bg-gray-800 p-8 rounded-lg w-96"
//       >
//         <h2 className="text-xl mb-4 text-center">
//           Forgot Password
//         </h2>

//         <input
//           type="email"
//           placeholder="Email"
//           className="w-full p-2 mb-4 bg-gray-700 rounded"
//           value={email}
//           onChange={(e) => setEmail(e.target.value)}
//         />

//         <button
//           disabled={loading}
//           className="w-full bg-blue-500 p-2 rounded flex justify-center"
//         >
//           {loading ? <Spinner /> : "Send OTP"}
//         </button>
//       </form>
//     </div>
//   );
// }




























import { useState } from "react";
import axios from "../api/axios";
import { useNavigate, Link } from "react-router-dom";
import { Spinner } from "../components/Spinner";
import {
  showSuccess,
  showError,
  showLoading,
  dismissToast,
} from "../utils/toast";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email.trim()) {
      showError("Please enter your email");
      return;
    }

    setLoading(true);
    const toastId = showLoading("Sending OTP...");

    try {
      await axios.post("/auth/forgot-password", {
        email: email.trim(),
      });

      dismissToast(toastId);
      showSuccess("OTP sent successfully 📩");

      navigate("/reset-password", { state: { email: email.trim() } });
    } catch (err) {
      dismissToast(toastId);
      showError(err.response?.data?.message || "Error sending OTP");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="
        min-h-screen flex items-center justify-center
        px-4 py-10
        bg-gray-50 dark:bg-gray-950
        transition-colors duration-300
      "
    >
      <div className="w-full max-w-5xl grid lg:grid-cols-2 gap-6 items-stretch animate-fadeIn">
        {/* Left Side */}
        <div
          className="
            hidden lg:flex flex-col justify-between
            rounded-3xl
            border border-gray-200 dark:border-gray-800
            bg-white dark:bg-gray-900
            shadow-xl shadow-gray-200/40 dark:shadow-black/20
            p-10
          "
        >
          <div>
            <div
              className="
                inline-flex items-center gap-2
                px-3 py-1.5 rounded-full mb-5
                bg-blue-50 dark:bg-blue-500/10
                text-blue-600 dark:text-blue-400
                text-xs font-semibold
                border border-blue-100 dark:border-blue-500/20
              "
            >
              Password Recovery
            </div>

            <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100">
              Reset your password safely
            </h1>

            <p className="mt-3 text-sm md:text-base leading-relaxed text-gray-500 dark:text-gray-400">
              Enter your email address and we will send you a one-time password
              to continue resetting your account password.
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
                Recovery Method
              </p>
              <p className="text-base font-semibold text-gray-900 dark:text-gray-100">
                Email Verification with OTP
              </p>
            </div>
          </div>

          <div className="mt-8 text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
            Make sure you have access to your inbox before continuing.
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
            p-8 md:p-10
          "
        >
          <div className="mb-8 text-center lg:text-left">
            <div className="flex justify-center lg:hidden mb-4">
              <div
                className="
                  w-16 h-16 rounded-2xl
                  flex items-center justify-center
                  bg-blue-50 dark:bg-blue-500/10
                  border border-blue-100 dark:border-blue-500/20
                  text-2xl
                "
              >
                🔑
              </div>
            </div>

            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-gray-100">
              Forgot Password
            </h2>

            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
              Enter your email to receive an OTP code.
            </p>
          </div>

          {/* Email */}
          <div className="mb-6">
            <label className="block mb-2 text-sm font-semibold text-gray-700 dark:text-gray-200">
              Email Address
            </label>
            <input
              type="email"
              placeholder="Enter your email"
              className="
                w-full h-12 px-4 rounded-2xl
                border border-gray-200 dark:border-gray-700
                bg-gray-50 dark:bg-gray-800
                text-gray-900 dark:text-gray-100
                placeholder:text-gray-400 dark:placeholder:text-gray-500
                outline-none
                focus:ring-2 focus:ring-blue-500/20
                focus:border-blue-500
                transition-all duration-200
              "
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

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
                Sending...
              </>
            ) : (
              "Send OTP"
            )}
          </button>

          {/* Back */}
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-5 text-center">
            Remembered your password?{" "}
            <Link
              to="/"
              className="text-blue-600 dark:text-blue-400 font-medium hover:underline"
            >
              Back to Login
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}