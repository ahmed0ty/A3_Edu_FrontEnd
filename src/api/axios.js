// import axios from "axios";

// const instance = axios.create({
//   baseURL: "https://a3-edu.onrender.com",
//   withCredentials: true, // مهم لو refresh token على كوكي
// });

// instance.interceptors.request.use(config => {
//   const token = localStorage.getItem("token");
//   if (token) config.headers.Authorization = `Bearer ${token}`;
//   return config;
// });

// instance.interceptors.response.use(
//   response => response,
//   async error => {
//     const originalRequest = error.config;

//     if (error.response?.status === 401 && !originalRequest._retry) {
//       originalRequest._retry = true;

//       try {
//         // جلب access token جديد
//         const res = await axios.post(
//           "https://a3-edu.onrender.com/auth/refresh",
//           {}, // body فاضي لو كوكي
//           { withCredentials: true }
//         );

//         const newToken = res.data.accessToken;
//         localStorage.setItem("token", newToken);

//         originalRequest.headers.Authorization = `Bearer ${newToken}`;

//         return axios(originalRequest); // إعادة نفس الريكوست
//       } catch (err) {
//         localStorage.removeItem("token");
//         window.location.href = "/login";
//       }
//     }

//     return Promise.reject(error);
//   }
// );

// export default instance;








import axios from "axios";

const instance = axios.create({
  baseURL: "https://a3-edu.onrender.com",
  withCredentials: true,
});

instance.interceptors.request.use(config => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

instance.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
  originalRequest._retry = true;

  try {
    const res = await axios.post(
      "https://a3-edu.onrender.com/auth/refresh",
      {},
      { withCredentials: true }
    );

    const newToken = res.data.accessToken;
    localStorage.setItem("token", newToken);

    instance.defaults.headers.Authorization = `Bearer ${newToken}`;
    originalRequest.headers.Authorization = `Bearer ${newToken}`;

    return instance(originalRequest);
  } catch (err) {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/";
    return Promise.reject(err);
  }
}

    return Promise.reject(error);
  }
);

export default instance;