// import { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import axios from "../api/axios";
// import { useAuth } from "../context/AuthContext";
// import { Spinner } from "../components/Spinner";
// import {
//   showSuccess,
//   showError,
//   showLoading,
//   dismissToast,
// } from "../utils/toast.js";

// export default function Login() {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [loading, setLoading] = useState(false);

//   const navigate = useNavigate();
//   const { setUser } = useAuth(); // 🔥 استخدم setUser لتحديث Context مباشرة

//   const handleLogin = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     const toastId = showLoading("Logging in...");

//     try {
//       // 🔹 1️⃣ login للحصول على access token
//       const res = await axios.post(
//         "/auth/login",
//         { email, password },
//         { withCredentials: true } // 🔥 مهم عشان refresh token cookie
//       );

//       localStorage.setItem("token", res.data.accessToken);

//       // 🔹 2️⃣ جلب بيانات المستخدم الحقيقية من السيرفر
//       const meRes = await axios.get("/auth/me", { withCredentials: true });

//       setUser(meRes.data.user); // 🔥 تحديث Context فورًا
//       localStorage.setItem("user", JSON.stringify(meRes.data.user));

//       dismissToast(toastId);
//       showSuccess("Welcome back 👋");

//       // 🔹 3️⃣ redirect حسب الدور
//       if (meRes.data.user.role === "admin") navigate("/admin");
//       else navigate("/dashboard");

//     } catch (err) {
//       dismissToast(toastId);
//       showError(err.response?.data?.message || "Invalid email or password");
//       console.log(err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
//       <form
//         onSubmit={handleLogin}
//         className="bg-gray-800 p-8 rounded-lg w-96 shadow-lg"
//       >
//         <h2 className="text-2xl mb-6 text-center font-bold">Login</h2>

//         <input
//           type="email"
//           placeholder="Email"
//           className="w-full p-2 mb-4 rounded bg-gray-700"
//           value={email}
//           onChange={(e) => setEmail(e.target.value)}
//           required
//         />

//         <input
//           type="password"
//           placeholder="Password"
//           className="w-full p-2 mb-2 rounded bg-gray-700"
//           value={password}
//           onChange={(e) => setPassword(e.target.value)}
//           required
//         />

//         <div className="flex justify-end mb-4">
//           <button
//             type="button"
//             className="text-sm text-blue-400 hover:underline"
//             onClick={() => navigate("/forgot-password")}
//           >
//             Forgot Password?
//           </button>
//         </div>

//         <button
//           type="submit"
//           disabled={loading}
//           className="w-full bg-blue-500 p-2 rounded flex justify-center items-center gap-2 hover:bg-blue-600"
//         >
//           {loading ? <Spinner /> : "Login"}
//         </button>

//         <p className="text-center mt-4 text-sm">
//           Don't have an account?{" "}
//           <span
//             className="text-blue-400 cursor-pointer"
//             onClick={() =>
//               navigate("/register", { state: { fromApp: true } })
//             }
//           >
//             Register
//           </span>
//         </p>
//       </form>
//     </div>
//   );
// }













import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "../api/axios";
import { useAuth } from "../context/AuthContext";
import { Spinner } from "../components/Spinner";
import {
  showSuccess,
  showError,
  showLoading,
  dismissToast,
} from "../utils/toast.js";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { setUser } = useAuth();

  const handleLogin = async (e) => {
  e.preventDefault();

  if (!email.trim() || !password.trim()) {
    showError("Please enter your email and password");
    return;
  }

  setLoading(true);
  const toastId = showLoading("Logging in...");

  try {
    const res = await axios.post(
      "/auth/login",
      { email: email.trim(), password },
      { withCredentials: true }
    );

    const token = res.data.accessToken;
    const user = res.data.user;

    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));
    setUser(user);

    dismissToast(toastId);
    showSuccess("Welcome back 👋");

    if (user.role === "admin") navigate("/admin");
    else navigate("/dashboard");
  } catch (err) {
    dismissToast(toastId);
    showError(err.response?.data?.message || "Invalid email or password");
    console.log("LOGIN ERROR:", err.response?.data || err.message);
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
              Welcome Back
            </div>

            <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100">
              Sign in to your account
            </h1>

            <p className="mt-3 text-sm md:text-base leading-relaxed text-gray-500 dark:text-gray-400">
              Access your dashboard, courses, quizzes, and everything you need
              from one secure place.
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
                Access Includes
              </p>
              <div className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
                <p>• View and manage your courses</p>
                <p>• Continue lessons and quizzes</p>
                <p>• Access instructor and admin tools</p>
              </div>
            </div>
          </div>

          <div className="mt-8 text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
            Use your registered email and password to continue.
          </div>
        </div>

        {/* Form */}
        <form
          onSubmit={handleLogin}
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
              Login
            </h2>

            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
              Enter your credentials to access your account.
            </p>
          </div>

          {/* Email */}
          <div className="mb-4">
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
              required
            />
          </div>

          {/* Password */}
          <div className="mb-2">
            <label className="block mb-2 text-sm font-semibold text-gray-700 dark:text-gray-200">
              Password
            </label>
            <input
              type="password"
              placeholder="Enter your password"
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
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {/* Forgot Password */}
          <div className="flex justify-end mb-6">
            <button
              type="button"
              className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:underline"
              onClick={() => navigate("/forgot-password")}
            >
              Forgot Password?
            </button>
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
                Logging in...
              </>
            ) : (
              "Login"
            )}
          </button>

          {/* Register */}
          <p className="text-center mt-5 text-sm text-gray-500 dark:text-gray-400">
            Don&apos;t have an account?{" "}
            <Link
              to="/register"
              state={{ fromApp: true }}
              className="text-blue-600 dark:text-blue-400 font-medium hover:underline"
            >
              Register
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}