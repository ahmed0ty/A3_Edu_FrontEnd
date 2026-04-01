import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";

import Login from "./pages/login";
import Register from "./pages/register";
import ConfirmEmail from "./pages/ConfirmEmail";
import Dashboard from "./pages/Dashboard";
import Course from "./pages/Course";
import Quizzes from "./pages/Quizzes";

import ProtectedRoute from "./components/ProtectedRoute";
import AdminRoute from "./components/AdminRoute";

import QuizAttempt from "./pages/QuizAttempt";
import Results from "./pages/Results";
import CreateQuiz from "./pages/CreateQuiz";
import QuizEdit from "./pages/QuizEdit";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";

import AdminDashboard from "./pages/AdminDashboard";
import CreateCourse from "./pages/CreateCourse";
import EditCourse from "./pages/EditCourse";
import InstructorEnrollments from "./pages/InstructorEnrollments";
import Profile from "./pages/Profile";
import PaymentPage from "./components/PaymentPage";

export default function App() {
  const { user, loading } = useAuth();

  // 🔥 لحد ما نعرف هل المستخدم logged in
if (loading) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-950 gap-4">
      <div className="relative w-14 h-14">
        <div className="absolute inset-0 rounded-full border-4 border-gray-200 dark:border-gray-800" />
        <div className="absolute inset-0 rounded-full border-4 border-t-blue-500 animate-spin" />
      </div>
      <span className="text-sm font-medium text-gray-400 dark:text-gray-500 tracking-wide">
        Loading...
      </span>
    </div>
  );
}

  return (
    <BrowserRouter>
      <Routes>

        <Route path="/profile" element={<Profile />} />

        {/* 🔥 لو logged in يمنع الدخول للـ login */}
        <Route
          path="/"
          element={
            user ? (
              user.role === "admin" ? (
                <Navigate to="/admin" />
              ) : (
                <Navigate to="/dashboard" />
              )
            ) : (
              <Login />
            )
          }
        />

        <Route path="/register" element={<Register />} />

        {/* 🔥 confirm لازم يكون فيه email + otp */}
        <Route
          path="/confirm"
          element={
            <ConfirmEmail />
          }
        />

        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />

        {/* 🔒 Protected */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/course/:id"
          element={
            <ProtectedRoute>
              <Course />
            </ProtectedRoute>
          }
        />

        <Route
          path="/course/:id/quizzes"
          element={
            <ProtectedRoute>
              <Quizzes />
            </ProtectedRoute>
          }
        />

        <Route
          path="/quiz/:attemptId"
          element={
            <ProtectedRoute>
              <QuizAttempt />
            </ProtectedRoute>
          }
        />

        {/* 🔥 كانت مفتوحة */}
        <Route
          path="/results/:attemptId"
          element={
            <ProtectedRoute>
              <Results />
            </ProtectedRoute>
          }
        />

        {/* 🔥 لازم تبقى protected */}
       <Route
  path="/create-quiz/:courseId"
  element={
    <ProtectedRoute>
      <CreateQuiz />
    </ProtectedRoute>
  }
/>

        <Route
          path="/quiz/:id/edit"
          element={
            <ProtectedRoute>
              <QuizEdit />
            </ProtectedRoute>
          }
        />

        {/* 🔥 Admin */}
        <Route
          path="/admin"
          element={
            <AdminRoute>
              <AdminDashboard />
            </AdminRoute>
          }
        />

        {/* 🔥 أي route غلط */}
        <Route path="*" element={<Navigate to="/" />} />

        {/* <Route path="/request-instructor" element={<RequestInstructor />} /> */}

        <Route path="/create-course" element={<CreateCourse />} />

        <Route path="/edit-course/:id" element={<EditCourse />} />

        <Route
          path="/enrollments/course/:courseId/enrollments"
          element={<InstructorEnrollments />}
        />

        <Route path="/payment" element={<PaymentPage />} />

      </Routes>
    </BrowserRouter>
  );
}