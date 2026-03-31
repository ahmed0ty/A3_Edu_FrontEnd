// import { useState } from "react";
// import axios from "../api/axios";
// import { showSuccess, showError } from "../utils/toast";

// export default function RequestInstructor() {
//   const [fullName, setFullName] = useState("");
//   const [file, setFile] = useState(null);

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     try {
//       const formData = new FormData();

//       formData.append("fullName", fullName);
//       formData.append("file", file);

//       await axios.post("/users/request-instructor", formData, {
//         headers: {
//           "Content-Type": "multipart/form-data",
//         },
//       });

//       showSuccess("Request sent successfully");
//     } catch (err) {
//       showError(err.response?.data?.message || "Error");
//     }
//   };

//   return (
//     <div className="p-6 text-white">
//       <h2 className="text-xl mb-4">Request Instructor</h2>

//       <form onSubmit={handleSubmit} className="flex flex-col gap-4">

//         <input
//           type="text"
//           placeholder="Full Name"
//           className="p-2 bg-gray-800"
//           value={fullName}
//           onChange={(e) => setFullName(e.target.value)}
//           required
//         />

//         <input
//           type="file"
//           onChange={(e) => setFile(e.target.files[0])}
//           required
//         />

//         <button className="bg-blue-500 p-2 rounded">
//           Send Request
//         </button>

//       </form>
//     </div>
//   );
// }