// import { useState } from "react";
// import axios from "../api/axios";
// import { useLocation, useNavigate } from "react-router-dom";
// import { Spinner } from "../components/Spinner";
// import {
//   showSuccess,
//   showError,
//   showLoading,
//   dismissToast,
// } from "../utils/toast";

// export default function ResetPassword() {
//   const { state } = useLocation();
//   const navigate = useNavigate();

//   const [form, setForm] = useState({
//     email: state?.email || "",
//     otp: "",
//     newPassword: "",
//   });

//   const [loading, setLoading] = useState(false);

//   const handleChange = (e) => {
//     setForm({ ...form, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     setLoading(true);
//     const toastId = showLoading("Resetting password...");

//     try {
//       const res = await axios.post("/auth/reset-password", form);

//       dismissToast(toastId);
//       showSuccess("Password reset successful 🔐");

//       navigate("/");
//     } catch (err) {
//       dismissToast(toastId);
//       showError(err.response?.data?.message || "Error resetting password");
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
//           Reset Password
//         </h2>

//         <input
//           name="email"
//           placeholder="Email"
//           className="w-full p-2 mb-2 bg-gray-700 rounded"
//           value={form.email}
//           onChange={handleChange}
//         />

//         <input
//           name="otp"
//           placeholder="OTP"
//           className="w-full p-2 mb-2 bg-gray-700 rounded"
//           onChange={handleChange}
//         />

//         <input
//           name="newPassword"
//           type="password"
//           placeholder="New Password"
//           className="w-full p-2 mb-4 bg-gray-700 rounded"
//           onChange={handleChange}
//         />

//         <button
//           disabled={loading}
//           className="w-full bg-blue-500 p-2 rounded flex justify-center"
//         >
//           {loading ? <Spinner /> : "Reset Password"}
//         </button>
//       </form>
//     </div>
//   );
// }
























import { useState } from "react";
import axios from "../api/axios";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { Spinner } from "../components/Spinner";
import {
  showSuccess,
  showError,
  showLoading,
  dismissToast,
} from "../utils/toast";

export default function ResetPassword() {
  const { state } = useLocation();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: state?.email || "",
    otp: "",
    newPassword: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.email.trim() || !form.otp.trim() || !form.newPassword.trim()) {
      showError("Please fill in all fields");
      return;
    }

    setLoading(true);
    const toastId = showLoading("Resetting password...");

    try {
      await axios.post("/auth/reset-password", {
        email: form.email.trim(),
        otp: form.otp.trim(),
        newPassword: form.newPassword,
      });

      dismissToast(toastId);
      showSuccess("Password reset successful 🔐");

      navigate("/");
    } catch (err) {
      dismissToast(toastId);
      showError(err.response?.data?.message || "Error resetting password");
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
              Reset Access
            </div>

            <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100">
              Create a new password
            </h1>

            <p className="mt-3 text-sm md:text-base leading-relaxed text-gray-500 dark:text-gray-400">
              Enter the OTP code sent to your email, then choose a new password
              to regain access to your account securely.
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
                Recovery Flow
              </p>
              <div className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
                <p>• Enter your email address</p>
                <p>• Paste the OTP code</p>
                <p>• Set a strong new password</p>
              </div>
            </div>
          </div>

          <div className="mt-8 text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
            Make sure your new password is easy for you to remember and hard for
            others to guess.
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
                🔐
              </div>
            </div>

            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-gray-100">
              Reset Password
            </h2>

            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
              Enter your OTP and choose a new password.
            </p>
          </div>

          {/* Email */}
          <div className="mb-4">
            <label className="block mb-2 text-sm font-semibold text-gray-700 dark:text-gray-200">
              Email Address
            </label>
            <input
              name="email"
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
              value={form.email}
              onChange={handleChange}
            />
          </div>

          {/* OTP */}
          <div className="mb-4">
            <label className="block mb-2 text-sm font-semibold text-gray-700 dark:text-gray-200">
              OTP Code
            </label>
            <input
              name="otp"
              placeholder="Enter OTP"
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
                tracking-[0.2em] text-center
              "
              value={form.otp}
              onChange={handleChange}
            />
          </div>

          {/* New Password */}
          <div className="mb-6">
            <label className="block mb-2 text-sm font-semibold text-gray-700 dark:text-gray-200">
              New Password
            </label>
            <input
              name="newPassword"
              type="password"
              placeholder="Enter new password"
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
              value={form.newPassword}
              onChange={handleChange}
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
                Resetting...
              </>
            ) : (
              "Reset Password"
            )}
          </button>

          {/* Back */}
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-5 text-center">
            Back to{" "}
            <Link
              to="/"
              className="text-blue-600 dark:text-blue-400 font-medium hover:underline"
            >
              Login
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}