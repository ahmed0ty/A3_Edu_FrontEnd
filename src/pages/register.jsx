// import { useState, useEffect } from "react";
// import { Link, useNavigate, useLocation } from "react-router-dom";
// import axios from "../api/axios"; // خليها axios instance لو عندك
// import { showSuccess, showError } from "../utils/toast";

// export default function Register() {
//   const navigate = useNavigate();
//   const location = useLocation();

//   const [form, setForm] = useState({
//     name: "",
//     email: "",
//     password: "",
//   });

//   const [image, setImage] = useState(null);       // 🔹 صورة البروفايل
//   const [preview, setPreview] = useState("");     // 🔹 preview للصورة

//   const [errors, setErrors] = useState([]);
//   const [loading, setLoading] = useState(false);

//   // 🔥 منع الدخول المباشر من URL
//   useEffect(() => {
//     if (!location.state?.fromApp) navigate("/");
//   }, [location, navigate]);

//   const handleChange = (e) => {
//     setForm({ ...form, [e.target.name]: e.target.value });
//   };

//   // 🔹 handle image selection
//   const handleImage = (e) => {
//     const file = e.target.files[0];
//     setImage(file);

//     if (file) setPreview(URL.createObjectURL(file));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);

//     try {
//       const data = new FormData();
//       data.append("name", form.name);
//       data.append("email", form.email);
//       data.append("password", form.password);
//       data.append("role", "student");

//       if (image) data.append("profileImage", image); // 🔹 أضف الصورة لو موجودة

//       const { data: res } = await axios.post(
//         "/auth/register",
//         data,
//         { headers: { "Content-Type": "multipart/form-data" } }
//       );

//       showSuccess(res.message || "Registered successfully");
//       setErrors([]);
//       navigate("/confirm", { state: { email: form.email } });

//     } catch (err) {
//       const responseErrors = err.response?.data?.errors;

//       if (responseErrors) setErrors(responseErrors);
//       else showError(err.response?.data?.message || "Something went wrong");

//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-950 to-black text-white">
//       <form
//         onSubmit={handleSubmit}
//         className="w-full max-w-md bg-gray-800 p-8 rounded-2xl shadow-lg flex flex-col items-center"
//       >
//         <h2 className="text-3xl font-bold mb-6 text-center">Create Account 🚀</h2>

//         {/* Errors */}
//         {errors.length > 0 && (
//           <div className="mb-4 bg-red-500/20 p-3 rounded-lg w-full">
//             {errors.map((err, index) => (
//               <p key={index} className="text-red-400 text-sm">{err.message}</p>
//             ))}
//           </div>
//         )}

//         {/* 🔹 Profile Image */}
//         <div className="relative mb-6">
//           <label
//             htmlFor="profileImage"
//             className="w-28 h-28 rounded-full border-4 border-blue-500 overflow-hidden cursor-pointer flex items-center justify-center"
//           >
//             <img
//               src={preview || "https://i.pravatar.cc/100"}
//               alt="Preview"
//               className="w-full h-full object-cover"
//             />
//           </label>
//           <input
//             type="file"
//             id="profileImage"
//             onChange={handleImage}
//             className="hidden"
//           />
//         </div>

//         {/* Name */}
//         <input
//           name="name"
//           placeholder="Name"
//           value={form.name}
//           className="w-full p-3 mb-4 bg-gray-700 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
//           onChange={handleChange}
//           required
//         />

//         {/* Email */}
//         <input
//           name="email"
//           type="email"
//           placeholder="Email"
//           value={form.email}
//           className="w-full p-3 mb-4 bg-gray-700 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
//           onChange={handleChange}
//           required
//         />

//         {/* Password */}
//         <input
//           name="password"
//           type="password"
//           placeholder="Password"
//           value={form.password}
//           className="w-full p-3 mb-4 bg-gray-700 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
//           onChange={handleChange}
//           required
//         />

//         {/* Button */}
//         <button
//           type="submit"
//           className="w-full bg-blue-600 py-3 rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
//           disabled={loading}
//         >
//           {loading ? "Registering..." : "Register"}
//         </button>

//         {/* Link */}
//         <p className="text-sm text-gray-400 mt-4 text-center">
//           Already have an account?{" "}
//           <Link
//             to="/"
//             state={{ fromApp: true }}
//             className="text-blue-400"
//           >
//             Login
//           </Link>
//         </p>
//       </form>
//     </div>
//   );
// }







































import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import axios from "../api/axios";
import { Spinner } from "../components/Spinner";
import { showSuccess, showError } from "../utils/toast";

export default function Register() {
  const navigate = useNavigate();
  const location = useLocation();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState("");
  const [errors, setErrors] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!location.state?.fromApp) navigate("/");
  }, [location, navigate]);

  const handleChange = (e) => {
    setErrors([]);
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImage = (e) => {
    const file = e.target.files[0];
    setImage(file);

    if (file) {
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.name.trim() || !form.email.trim() || !form.password.trim()) {
      showError("Please fill in all required fields");
      return;
    }

    setLoading(true);

    try {
      const data = new FormData();
      data.append("name", form.name.trim());
      data.append("email", form.email.trim());
      data.append("password", form.password);
      data.append("role", "student");

      if (image) data.append("profileImage", image);

      const { data: res } = await axios.post("/auth/register", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      showSuccess(res.message || "Registered successfully");
      setErrors([]);
      navigate("/confirm", { state: { email: form.email.trim() } });
    } catch (err) {
      const responseErrors = err.response?.data?.errors;

      if (responseErrors) {
        setErrors(responseErrors);
      } else {
        showError(err.response?.data?.message || "Something went wrong");
      }
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
              Create Account
            </div>

            <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100">
              Join the platform today
            </h1>

            <p className="mt-3 text-sm md:text-base leading-relaxed text-gray-500 dark:text-gray-400">
              Create your account to start learning, enroll in courses, and
              access your dashboard بسهولة ومن مكان واحد.
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
                What You Get
              </p>
              <div className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
                <p>• Personalized student dashboard</p>
                <p>• Access to free and paid courses</p>
                <p>• Quizzes, lessons, and progress tracking</p>
              </div>
            </div>
          </div>

          <div className="mt-8 text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
            Use a valid email because you will confirm your account with OTP.
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
                🚀
              </div>
            </div>

            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-gray-100">
              Create Account
            </h2>

            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
              Fill in your details to create a new account.
            </p>
          </div>

          {/* Errors */}
          {errors.length > 0 && (
            <div
              className="
                mb-5 rounded-2xl
                border border-red-200 dark:border-red-500/20
                bg-red-50 dark:bg-red-500/10
                px-4 py-3
              "
            >
              {errors.map((err, index) => (
                <p
                  key={index}
                  className="text-sm text-red-600 dark:text-red-400"
                >
                  {err.message}
                </p>
              ))}
            </div>
          )}

          {/* Profile Image */}
          <div className="flex justify-center mb-6">
            <div className="relative">
              <label
                htmlFor="profileImage"
                className="
                  w-28 h-28 rounded-full overflow-hidden cursor-pointer
                  flex items-center justify-center
                  border-4 border-blue-500/80
                  shadow-lg
                  bg-gray-100 dark:bg-gray-800
                "
              >
                <img
                  src={preview || "https://i.pravatar.cc/120"}
                  alt="Preview"
                  className="w-full h-full object-cover"
                />
              </label>

              <label
                htmlFor="profileImage"
                className="
                  absolute -bottom-1 left-1/2 -translate-x-1/2
                  px-3 py-1 rounded-full
                  bg-blue-600 hover:bg-blue-500
                  text-white text-xs font-semibold
                  cursor-pointer transition-all duration-200
                "
              >
                Upload
              </label>

              <input
                type="file"
                id="profileImage"
                accept="image/*"
                onChange={handleImage}
                className="hidden"
              />
            </div>
          </div>

          {/* Name */}
          <div className="mb-4">
            <label className="block mb-2 text-sm font-semibold text-gray-700 dark:text-gray-200">
              Full Name
            </label>
            <input
              name="name"
              placeholder="Enter your name"
              value={form.name}
              onChange={handleChange}
              required
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
            />
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
              value={form.email}
              onChange={handleChange}
              required
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
            />
          </div>

          {/* Password */}
          <div className="mb-6">
            <label className="block mb-2 text-sm font-semibold text-gray-700 dark:text-gray-200">
              Password
            </label>
            <input
              name="password"
              type="password"
              placeholder="Enter your password"
              value={form.password}
              onChange={handleChange}
              required
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
                  : "bg-blue-600 hover:bg-blue-500 shadow-md hover:shadow-blue-500/25"
              }
            `}
          >
            {loading ? (
              <>
                <Spinner size="sm" variant="white" />
                Registering...
              </>
            ) : (
              "Register"
            )}
          </button>

          {/* Link */}
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-5 text-center">
            Already have an account?{" "}
            <Link
              to="/"
              state={{ fromApp: true }}
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