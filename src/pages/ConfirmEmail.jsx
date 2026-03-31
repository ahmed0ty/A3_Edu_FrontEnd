// import { useState, useEffect } from "react";
// import { useLocation, useNavigate, Link } from "react-router-dom";
// import axios from "../api/axios";
// import { showSuccess, showError } from "../utils/toast";

// export default function ConfirmEmail() {
//   const navigate = useNavigate();
//   const location = useLocation();

//   const [email, setEmail] = useState("");
//   const [otp, setOtp] = useState("");
//   const [loading, setLoading] = useState(false);

//   // 🔥 جلب الإيميل من register
//   useEffect(() => {
//     if (location.state?.email) {
//       setEmail(location.state.email);
//     }
//   }, [location]);

//   // 🔥 حماية الصفحة من الدخول المباشر
//   useEffect(() => {
//     const params = new URLSearchParams(window.location.search);
//     const urlEmail = params.get("email");
//     const urlOtp = params.get("otp");

//     // لو جاي من لينك ايميل
//     if (urlEmail && urlOtp) {
//       setEmail(urlEmail);
//       setOtp(urlOtp);
//     }

//     // ❌ لو مفيش لا state ولا query params
//     if (!location.state?.email && !urlEmail) {
//       navigate("/");
//     }
//   }, [location, navigate]);

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (!otp || otp.length < 4) {
//       return showError("Please enter valid OTP");
//     }

//     try {
//       setLoading(true);

//       const { data } = await axios.post("/auth/confirm-email", {
//         email,
//         otp,
//       });

//       showSuccess(data.message || "Email confirmed successfully 🎉");

//       // 🔥 تحويل تلقائي للـ login
//       setTimeout(() => {
//         navigate("/");
//       }, 1500);

//     } catch (err) {
//       showError(
//         err.response?.data?.message || "Invalid OTP"
//       );
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-950 to-black text-white">

//       <form
//         onSubmit={handleSubmit}
//         className="bg-gray-800 p-8 rounded-2xl w-96 shadow-lg border border-gray-700"
//       >

//         <h2 className="text-2xl font-bold mb-6 text-center">
//           🔐 Confirm Your Email
//         </h2>

//         {/* Email (readonly لو جاي من register) */}
//         <input
//           className="w-full mb-4 p-3 bg-gray-700 rounded-lg outline-none focus:ring-2 focus:ring-purple-500"
//           placeholder="Email"
//           value={email}
//           onChange={(e) => setEmail(e.target.value)}
//         />

//         {/* OTP */}
//         <input
//           className="w-full mb-6 p-3 bg-gray-700 rounded-lg outline-none tracking-widest text-center text-xl focus:ring-2 focus:ring-purple-500"
//           placeholder="Enter OTP"
//           value={otp}
//           onChange={(e) => setOtp(e.target.value)}
//         />

//         {/* Button */}
//         <button
//           type="submit"
//           disabled={loading}
//           className="w-full bg-purple-600 py-3 rounded-lg hover:bg-purple-700 transition disabled:opacity-50"
//         >
//           {loading ? "Verifying..." : "Confirm"}
//         </button>

//         {/* Resend */}
//         <p className="text-sm text-gray-400 mt-4 text-center">
//           Didn't receive code?{" "}
//           <span className="text-purple-400 cursor-pointer hover:underline">
//             Resend OTP
//           </span>
//         </p>

//         {/* Back to login */}
//         <p className="text-sm text-gray-400 mt-2 text-center">
//           Back to{" "}
//           <Link to="/" className="text-purple-400 hover:underline">
//             Login
//           </Link>
//         </p>

//       </form>

//     </div>
//   );
// }















































import { useState, useEffect } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import axios from "../api/axios";
import { showSuccess, showError } from "../utils/toast";
import { Spinner } from "../components/Spinner";

export default function ConfirmEmail() {
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);

  // جلب الإيميل من register
  useEffect(() => {
    if (location.state?.email) {
      setEmail(location.state.email);
    }
  }, [location]);

  // حماية الصفحة من الدخول المباشر + دعم query params
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const urlEmail = params.get("email");
    const urlOtp = params.get("otp");

    if (urlEmail && urlOtp) {
      setEmail(urlEmail);
      setOtp(urlOtp);
    }

    if (!location.state?.email && !urlEmail) {
      navigate("/");
    }
  }, [location, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!otp || otp.length < 4) {
      return showError("Please enter a valid OTP");
    }

    try {
      setLoading(true);

      const { data } = await axios.post("/auth/confirm-email", {
        email,
        otp,
      });

      showSuccess(data.message || "Email confirmed successfully 🎉");

      setTimeout(() => {
        navigate("/");
      }, 1500);
    } catch (err) {
      showError(err.response?.data?.message || "Invalid OTP");
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
                bg-purple-50 dark:bg-purple-500/10
                text-purple-600 dark:text-purple-400
                text-xs font-semibold
                border border-purple-100 dark:border-purple-500/20
              "
            >
              Email Verification
            </div>

            <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100">
              Confirm your account securely
            </h1>

            <p className="mt-3 text-sm md:text-base leading-relaxed text-gray-500 dark:text-gray-400">
              Enter the one-time password sent to your email address to activate
              your account and continue.
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
                Verification Email
              </p>
              <p className="text-base font-semibold text-gray-900 dark:text-gray-100 break-all">
                {email || "your-email@example.com"}
              </p>
            </div>
          </div>

          <div className="mt-8 text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
            Tip: check your inbox and spam folder for the verification code.
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
                  bg-purple-50 dark:bg-purple-500/10
                  border border-purple-100 dark:border-purple-500/20
                  text-2xl
                "
              >
                🔐
              </div>
            </div>

            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-gray-100">
              Confirm Your Email
            </h2>

            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
              Enter your email and the OTP code to verify your account.
            </p>
          </div>

          {/* Email */}
          <div className="mb-4">
            <label className="block mb-2 text-sm font-semibold text-gray-700 dark:text-gray-200">
              Email
            </label>
            <input
              type="email"
              className="
                w-full h-12 px-4 rounded-2xl
                border border-gray-200 dark:border-gray-700
                bg-gray-50 dark:bg-gray-800
                text-gray-900 dark:text-gray-100
                placeholder:text-gray-400 dark:placeholder:text-gray-500
                outline-none
                focus:ring-2 focus:ring-purple-500/20
                focus:border-purple-500
                transition-all duration-200
              "
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          {/* OTP */}
          <div className="mb-6">
            <label className="block mb-2 text-sm font-semibold text-gray-700 dark:text-gray-200">
              OTP Code
            </label>
            <input
              className="
                w-full h-14 px-4 rounded-2xl
                border border-gray-200 dark:border-gray-700
                bg-gray-50 dark:bg-gray-800
                text-gray-900 dark:text-gray-100
                placeholder:text-gray-400 dark:placeholder:text-gray-500
                outline-none
                text-center text-xl tracking-[0.3em]
                focus:ring-2 focus:ring-purple-500/20
                focus:border-purple-500
                transition-all duration-200
              "
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
            />
          </div>

          {/* Button */}
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
                  : "bg-purple-600 hover:bg-purple-500 shadow-md hover:shadow-purple-500/25"
              }
            `}
          >
            {loading ? (
              <>
                <Spinner size="sm" variant="white" />
                Verifying...
              </>
            ) : (
              "Confirm"
            )}
          </button>

          {/* Resend */}
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-5 text-center">
            Didn&apos;t receive the code?{" "}
            <span className="text-purple-600 dark:text-purple-400 font-medium cursor-pointer hover:underline">
              Resend OTP
            </span>
          </p>

          {/* Back to login */}
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-2 text-center">
            Back to{" "}
            <Link
              to="/"
              className="text-purple-600 dark:text-purple-400 font-medium hover:underline"
            >
              Login
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}