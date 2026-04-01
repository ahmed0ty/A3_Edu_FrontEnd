// import { createContext, useContext, useState, useEffect } from "react";
// import axios from "../api/axios";

// const AuthContext = createContext();

// export const AuthProvider = ({ children }) => {
//   const [user, setUser] = useState(null);
//   const [loading, setLoading] = useState(true);

//   // ================= LOGIN =================
//   const loginUser = async (credentials) => {
//     const res = await axios.post("/auth/login", credentials);

//     // 🔥 خزّن الـ access token
//     localStorage.setItem("token", res.data.accessToken);

//     // 🔥 جلب بيانات المستخدم الكاملة بعد login
//     const meRes = await axios.get("/auth/me", { withCredentials: true });
//     setUser(meRes.data.user); // تحديث Context فورًا
//     localStorage.setItem("user", JSON.stringify(meRes.data.user));
//   };

//   // ================= LOGOUT =================
//   const logout = async () => {
//     try {
//       await axios.post("/auth/logout", {}, { withCredentials: true });
//     } catch (err) {
//       console.log("Logout API failed");
//     }
//     localStorage.removeItem("token");
//     localStorage.removeItem("user");
//     setUser(null);
//   };

//   // ================= GET CURRENT USER =================
//   const getMe = async () => {
//     try {
//       const res = await axios.get("/auth/me", { withCredentials: true });
//       setUser(res.data.user);
//       localStorage.setItem("user", JSON.stringify(res.data.user));
//     } catch (err) {
//       setUser(null);
//       localStorage.removeItem("token");
//       localStorage.removeItem("user");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     const token = localStorage.getItem("token");
//     const savedUser = localStorage.getItem("user");

//     if (savedUser) setUser(JSON.parse(savedUser));
//     if (token) getMe();
//     else setLoading(false);
//   }, []);

//   return (
//     <AuthContext.Provider value={{ user, setUser, loginUser, logout, loading }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };

// export const useAuth = () => useContext(AuthContext);


















import { createContext, useContext, useState, useEffect } from "react";
import axios from "../api/axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // ================= LOGIN =================
  const loginUser = async (credentials) => {
    const res = await axios.post("/auth/login", credentials);

    // 🔥 خزّن الـ access token
    localStorage.setItem("token", res.data.accessToken);

    // 🔥 جلب بيانات المستخدم الكاملة بعد login
    const meRes = await axios.get("/auth/me", { withCredentials: true });
    setUser(meRes.data.user); // تحديث Context فورًا
    localStorage.setItem("user", JSON.stringify(meRes.data.user));
  };

  // ================= LOGOUT =================
  const logout = async () => {
    try {
      await axios.post("/auth/logout", {}, { withCredentials: true });
    } catch (err) {
      console.log("Logout API failed");
    }
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  };

  // ================= GET CURRENT USER =================
  const getMe = async () => {
    try {
      const res = await axios.get("/auth/me", { withCredentials: true });
      setUser(res.data.user);
    } catch (err) {
      setUser(null);
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    const savedUser = localStorage.getItem("user");

    if (savedUser) setUser(JSON.parse(savedUser));
    if (token) getMe();
    else setLoading(false);
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser, loginUser, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);