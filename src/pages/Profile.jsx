// import { useEffect, useState } from "react";
// import axios from "../api/axios";
// import { useAuth } from "../context/AuthContext";
// import { useNavigate } from "react-router-dom";
// import toast from "react-hot-toast";

// export default function Profile() {
//   const { user, setUser } = useAuth();
//   const navigate = useNavigate();

//   const [formData, setFormData] = useState({
//     name: "",
//     email: "",
//     profileImage: ""
//   });
//   const [image, setImage] = useState(null);
//   const [preview, setPreview] = useState("");

//   const getProfile = async () => {
//     try {
//       const res = await axios.get("/users/me");
//       setFormData(res.data.user);
//       setPreview(res.data.user.profileImage);
//     } catch (err) {
//       console.log(err);
//     }
//   };

// useEffect(() => {
//   if (user) {
//     setFormData(user);
//     setPreview(user.profileImage);
//   } else {
//     getProfile();
//   }
// }, [user]);

//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const handleImage = (e) => {
//     const file = e.target.files[0];
//     setImage(file);
//     if (file) setPreview(URL.createObjectURL(file));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     const data = new FormData();
//     data.append("name", formData.name);
//     data.append("email", formData.email);
//     if (image) data.append("profileImage", image);

//     try {
//       const res = await axios.put("/users/me", data, {
//         headers: { "Content-Type": "multipart/form-data" },
//       });

//       // 🔥 تحديث الـ Context فورًا
//       setUser(res.data.user);
//       setFormData(res.data.user);
//       setPreview(res.data.user.profileImage);
//       localStorage.setItem("user", JSON.stringify(res.data.user));

//       // 🔥 توست احترافي
//       toast.success("Profile updated successfully");

//       // 🔹 توجيه للداش بورد مباشرة
//       navigate("/dashboard");

//     } catch (err) {
//       toast.error("Failed to update profile");
//       console.log(err);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gray-950 flex justify-center items-center text-white">
//       <div className="bg-gray-900 p-8 rounded-2xl w-[420px] shadow-xl">
//         <h2 className="text-2xl font-bold mb-6 text-center">👤 My Profile</h2>

//         <form onSubmit={handleSubmit} className="space-y-4">
//           <div className="flex flex-col items-center">
//             <img
//               src={preview || "https://i.pravatar.cc/100"} // افتراضية
//               className="w-24 h-24 rounded-full border-4 border-blue-500 mb-3 object-cover"
//             />
//             <input type="file" onChange={handleImage} className="text-sm" />
//           </div>

//           <input
//             type="text"
//             name="name"
//             value={formData.name}
//             onChange={handleChange}
//             placeholder="Name"
//             className="w-full p-3 rounded-lg bg-gray-800 border border-gray-700"
//           />

//           <input
//             type="email"
//             name="email"
//             value={formData.email}
//             onChange={handleChange}
//             placeholder="Email"
//             className="w-full p-3 rounded-lg bg-gray-800 border border-gray-700"
//           />

//           <button
//             className="w-full bg-blue-600 hover:bg-blue-700 py-3 rounded-lg font-semibold"
//           >
//             Save Changes
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// }























import { useEffect, useState } from "react";
import axios from "../api/axios";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { Spinner } from "../components/Spinner";

export default function Profile() {
  const { user, setUser } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    profileImage: "",
  });

  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState("");
  const [loadingProfile, setLoadingProfile] = useState(false);
  const [saving, setSaving] = useState(false);

  const getProfile = async () => {
    try {
      setLoadingProfile(true);
      const res = await axios.get("/users/me");
      setFormData(res.data.user);
      setPreview(res.data.user.profileImage || "");
    } catch (err) {
      console.log(err);
      toast.error("Failed to load profile");
    } finally {
      setLoadingProfile(false);
    }
  };

  useEffect(() => {
    if (user) {
      setFormData(user);
      setPreview(user.profileImage || "");
    } else {
      getProfile();
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
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

    if (!formData.name?.trim() || !formData.email?.trim()) {
      return toast.error("Name and email are required");
    }

    const data = new FormData();
    data.append("name", formData.name.trim());
    data.append("email", formData.email.trim());
    if (image) data.append("profileImage", image);

    try {
      setSaving(true);

      const res = await axios.put("/users/me", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setUser(res.data.user);
      setFormData(res.data.user);
      setPreview(res.data.user.profileImage || "");
      localStorage.setItem("user", JSON.stringify(res.data.user));

      toast.success("Profile updated successfully");
      navigate("/dashboard");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update profile");
      console.log(err);
    } finally {
      setSaving(false);
    }
  };

  if (loadingProfile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950 transition-colors duration-300">
        <div className="flex flex-col items-center gap-4">
          <Spinner size="lg" variant="primary" />
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Loading profile...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      className="
        min-h-screen
        bg-gray-50 dark:bg-gray-950
        px-4 py-8 md:px-6 md:py-10
        transition-colors duration-300
      "
    >
      <div className="max-w-5xl mx-auto grid grid-cols-1 xl:grid-cols-[0.95fr_1.05fr] gap-6">
        {/* Left Card */}
        <div
          className="
            rounded-3xl
            border border-gray-200 dark:border-gray-800
            bg-white dark:bg-gray-900
            shadow-xl shadow-gray-200/40 dark:shadow-black/20
            overflow-hidden
          "
        >
          <div className="p-6 md:p-8 border-b border-gray-200 dark:border-gray-800">
            <div
              className="
                inline-flex items-center gap-2
                px-3 py-1.5 rounded-full mb-4
                bg-blue-50 dark:bg-blue-500/10
                text-blue-600 dark:text-blue-400
                text-xs font-semibold
                border border-blue-100 dark:border-blue-500/20
              "
            >
              Profile Settings
            </div>

            <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100">
              My Profile
            </h1>

            <p className="mt-3 text-sm md:text-base leading-relaxed text-gray-500 dark:text-gray-400">
              Manage your personal information and update your account details.
            </p>
          </div>

          <div className="p-6 md:p-8">
            <div
              className="
                rounded-3xl overflow-hidden
                border border-gray-200 dark:border-gray-800
                bg-gray-50 dark:bg-gray-800/50
                p-6
                text-center
              "
            >
              <div className="flex justify-center">
                <img
                  src={preview || "https://i.pravatar.cc/140"}
                  alt="Profile Preview"
                  className="w-28 h-28 rounded-full border-4 border-blue-500 object-cover shadow-md"
                />
              </div>

              <h2 className="mt-4 text-xl font-bold text-gray-900 dark:text-gray-100">
                {formData.name || "Your Name"}
              </h2>

              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400 break-all">
                {formData.email || "your@email.com"}
              </p>

              <div className="mt-5 inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 text-xs font-semibold border border-blue-100 dark:border-blue-500/20 capitalize">
                {user?.role || "user"}
              </div>
            </div>
          </div>
        </div>

        {/* Right Form */}
        <form
          onSubmit={handleSubmit}
          className="
            rounded-3xl
            border border-gray-200 dark:border-gray-800
            bg-white dark:bg-gray-900
            shadow-xl shadow-gray-200/40 dark:shadow-black/20
            p-6 md:p-8
            space-y-5
          "
        >
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              Update Profile
            </h2>
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
              Edit your information below and save your changes.
            </p>
          </div>

          {/* Image Upload */}
          <div>
            <label className="block mb-2 text-sm font-semibold text-gray-700 dark:text-gray-200">
              Profile Image
            </label>

            <div className="flex items-center gap-4">
              <img
                src={preview || "https://i.pravatar.cc/100"}
                alt="Profile"
                className="w-20 h-20 rounded-2xl object-cover border border-gray-200 dark:border-gray-700"
              />

              <label
                className="
                  px-4 py-2.5 rounded-2xl cursor-pointer
                  bg-gray-100 hover:bg-gray-200
                  dark:bg-gray-800 dark:hover:bg-gray-700
                  text-gray-700 dark:text-gray-200
                  border border-gray-200 dark:border-gray-700
                  text-sm font-medium transition-all duration-200
                "
              >
                Upload Image
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImage}
                  className="hidden"
                />
              </label>
            </div>
          </div>

          {/* Name */}
          <div>
            <label className="block mb-2 text-sm font-semibold text-gray-700 dark:text-gray-200">
              Full Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name || ""}
              onChange={handleChange}
              placeholder="Enter your name"
              className="
                w-full h-12 px-4 rounded-2xl
                border border-gray-200 dark:border-gray-700
                bg-gray-50 dark:bg-gray-800
                text-gray-900 dark:text-gray-100
                placeholder:text-gray-400 dark:placeholder:text-gray-500
                focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500
                transition-all duration-200
              "
            />
          </div>

          {/* Email */}
          <div>
            <label className="block mb-2 text-sm font-semibold text-gray-700 dark:text-gray-200">
              Email Address
            </label>
            <input
              type="email"
              name="email"
              value={formData.email || ""}
              onChange={handleChange}
              placeholder="Enter your email"
              className="
                w-full h-12 px-4 rounded-2xl
                border border-gray-200 dark:border-gray-700
                bg-gray-50 dark:bg-gray-800
                text-gray-900 dark:text-gray-100
                placeholder:text-gray-400 dark:placeholder:text-gray-500
                focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500
                transition-all duration-200
              "
            />
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
                    : "bg-blue-600 hover:bg-blue-500 shadow-md hover:shadow-blue-500/25"
                }
              `}
            >
              {saving ? (
                <>
                  <Spinner size="sm" variant="white" />
                  Saving...
                </>
              ) : (
                <>
                  <span>💾</span>
                  Save Changes
                </>
              )}
            </button>

            <button
              type="button"
              onClick={() => navigate("/dashboard")}
              className="
                sm:w-auto h-12 px-5 rounded-2xl
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