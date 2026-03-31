import { useEffect, useState } from "react";
import axios from "../api/axios";
import { showSuccess, showError } from "../utils/toast";
import socket from "../socket";
import { Spinner } from "../components/Spinner";
import Navbar from "../components/Navbar";

export default function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);

  const [stats, setStats] = useState({});

  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalUsers, setTotalUsers] = useState(0);

  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectId, setRejectId] = useState(null);
  const [rejectReason, setRejectReason] = useState("");

  const itemsPerPage = 5;

  const pageActive = users.filter((u) => u.isActive).length;
  const pageInstructor = users.filter((u) => u.role === "instructor").length;

  const fetchData = async () => {
    try {
      setLoading(true);

      const [usersRes, reqRes, statsRes] = await Promise.all([
        axios.get("/users", {
          params: {
            page: currentPage,
            limit: itemsPerPage,
            search,
            role: roleFilter,
            status: statusFilter,
          },
        }),
        axios.get("/users/instructor/requests"),
        axios.get("/users/stats"),
      ]);

      setUsers(usersRes?.data?.data || []);
      setTotalPages(usersRes?.data?.pagination?.pages || 1);
      setTotalUsers(usersRes?.data?.pagination?.total || 0);
      setRequests(reqRes?.data?.data || []);
      setStats(statsRes?.data?.data || {});
    } catch (err) {
      console.log(err);
      showError("Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();

    socket.on("users:updated", fetchData);
    socket.on("instructorRequest:new", fetchData);
    socket.on("instructorRequest:updated", fetchData);
    socket.on("instructorRequest:newRequest", fetchData);

    return () => {
      socket.off("users:updated", fetchData);
      socket.off("instructorRequest:new", fetchData);
      socket.off("instructorRequest:updated", fetchData);
      socket.off("instructorRequest:newRequest", fetchData);
    };
  }, [currentPage, search, roleFilter, statusFilter]);

  const approve = async (id) => {
    try {
      await axios.patch(`/users/instructor/approve/${id}`);
      showSuccess("Instructor approved successfully");
      fetchData();
    } catch (err) {
      showError(err.response?.data?.message || "Error approving");
    }
  };

  const openRejectModal = (id) => {
    setRejectId(id);
    setShowRejectModal(true);
  };

  const closeRejectModal = () => {
    setShowRejectModal(false);
    setRejectReason("");
    setRejectId(null);
  };

  const submitReject = async () => {
    if (!rejectReason.trim()) {
      showError("Please enter rejection reason");
      return;
    }

    try {
      await axios.patch(`/users/instructor/reject/${rejectId}`, {
        reason: rejectReason.trim(),
      });

      showSuccess("Instructor request rejected");
      closeRejectModal();
      fetchData();
    } catch (err) {
      showError(err.response?.data?.message || "Error rejecting");
    }
  };

  const toggleActive = async (id) => {
    try {
      await axios.patch(`/users/${id}/toggle-active`);
      showSuccess("User status updated");
      fetchData();
    } catch (err) {
      showError(err.response?.data?.message || "Error updating status");
    }
  };

  const deleteUser = async (id) => {
    try {
      await axios.delete(`/users/${id}`);
      showSuccess("User deleted successfully");
      fetchData();
    } catch (err) {
      showError(err.response?.data?.message || "Error deleting user");
    }
  };

  const statCards = [
    {
      title: "Total Users",
      value: stats.total || 0,
      color: "text-gray-900 dark:text-gray-100",
    },
    {
      title: "Students",
      value: stats.students || 0,
      color: "text-blue-600 dark:text-blue-400",
    },
    {
      title: "Instructors",
      value: stats.instructors || 0,
      color: "text-violet-600 dark:text-violet-400",
    },
    {
      title: "Admins",
      value: stats.admins || 0,
      color: "text-cyan-600 dark:text-cyan-400",
    },
    {
      title: "Active",
      value: stats.active || 0,
      color: "text-emerald-600 dark:text-emerald-400",
    },
    {
      title: "Inactive",
      value: stats.inactive || 0,
      color: "text-red-600 dark:text-red-400",
    },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors duration-300">
        <Navbar />
        <div className="flex items-center justify-center py-20">
          <div className="flex flex-col items-center gap-4">
            <Spinner size="lg" variant="primary" />
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Loading admin dashboard...
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors duration-300">
      <Navbar />

      <div className="flex flex-col lg:flex-row min-h-[calc(100vh-73px)]">
        {/* Sidebar */}
        <aside
          className="
            w-full lg:w-72 shrink-0
            border-b lg:border-b-0 lg:border-r
            border-gray-200 dark:border-gray-800
            bg-white/90 dark:bg-gray-900/90
            backdrop-blur-xl
            p-6
          "
        >
          <div className="sticky top-24">
            <div className="mb-8">
              <div
                className="
                  inline-flex items-center gap-2
                  px-3 py-1.5 rounded-full mb-4
                  bg-blue-50 dark:bg-blue-500/10
                  border border-blue-100 dark:border-blue-500/20
                  text-blue-600 dark:text-blue-400
                  text-xs font-semibold
                "
              >
                Admin Workspace
              </div>

              <h2 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-gray-100">
                ⚡ Admin Dashboard
              </h2>

              <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                Manage users, instructor requests, and platform activity.
              </p>
            </div>

            <div className="space-y-3">
              {statCards.map((card, idx) => (
                <div
                  key={idx}
                  className="
                    rounded-2xl border
                    border-gray-200 dark:border-gray-800
                    bg-gray-50 dark:bg-gray-800/50
                    p-4
                  "
                >
                  <p className="text-xs uppercase tracking-wider text-gray-400 dark:text-gray-500">
                    {card.title}
                  </p>
                  <p className={`mt-2 text-2xl font-bold ${card.color}`}>
                    {card.value}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </aside>

        {/* Main */}
        <main className="flex-1 p-4 md:p-6 lg:p-8">
          {/* Admin Header */}
          <div className="mb-8 rounded-3xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-6 shadow-sm">
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-sm font-medium text-blue-600 dark:text-blue-400">
                  Welcome back, Admin
                </p>
                <h1 className="mt-1 text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100">
                  Admin Dashboard
                </h1>
                <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                  Here you can manage users, review instructor requests, and monitor platform statistics.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                <div className="rounded-2xl bg-gray-50 dark:bg-gray-800/60 px-4 py-3">
                  <p className="text-xs text-gray-500 dark:text-gray-400">Total Users</p>
                  <p className="mt-1 text-xl font-bold text-gray-900 dark:text-gray-100">
                    {stats.total || 0}
                  </p>
                </div>

                <div className="rounded-2xl bg-gray-50 dark:bg-gray-800/60 px-4 py-3">
                  <p className="text-xs text-gray-500 dark:text-gray-400">Pending Requests</p>
                  <p className="mt-1 text-xl font-bold text-amber-600 dark:text-amber-400">
                    {requests.length}
                  </p>
                </div>

                <div className="rounded-2xl bg-gray-50 dark:bg-gray-800/60 px-4 py-3">
                  <p className="text-xs text-gray-500 dark:text-gray-400">Active Users</p>
                  <p className="mt-1 text-xl font-bold text-emerald-600 dark:text-emerald-400">
                    {stats.active || 0}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Top Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
            <div className="rounded-3xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-5 shadow-sm">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Users On This Page
              </p>
              <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-gray-100">
                {users.length}
              </p>
            </div>

            <div className="rounded-3xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-5 shadow-sm">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Pending Requests
              </p>
              <p className="mt-2 text-3xl font-bold text-amber-600 dark:text-amber-400">
                {requests.length}
              </p>
            </div>

            <div className="rounded-3xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-5 shadow-sm">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Instructors On Page
              </p>
              <p className="mt-2 text-3xl font-bold text-violet-600 dark:text-violet-400">
                {pageInstructor}
              </p>
            </div>

            <div className="rounded-3xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-5 shadow-sm">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Active On Page
              </p>
              <p className="mt-2 text-3xl font-bold text-emerald-600 dark:text-emerald-400">
                {pageActive}
              </p>
            </div>
          </div>

          {/* Filters */}
          <div className="rounded-3xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-5 md:p-6 shadow-sm mb-8">
            <div className="flex flex-col lg:flex-row gap-4 lg:items-center lg:justify-between">
              <div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">
                  User Filters
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Search and filter the user list easily.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
                <input
                  type="text"
                  placeholder="Search email..."
                  className="
                    h-11 px-4 rounded-2xl
                    border border-gray-200 dark:border-gray-700
                    bg-gray-50 dark:bg-gray-800
                    text-gray-900 dark:text-gray-100
                    placeholder:text-gray-400 dark:placeholder:text-gray-500
                    focus:outline-none focus:ring-2 focus:ring-blue-500/30
                    min-w-[220px]
                  "
                  value={search}
                  onChange={(e) => {
                    setCurrentPage(1);
                    setSearch(e.target.value);
                  }}
                />

                <select
                  value={roleFilter}
                  onChange={(e) => {
                    setCurrentPage(1);
                    setRoleFilter(e.target.value);
                  }}
                  className="
                    h-11 px-4 rounded-2xl
                    border border-gray-200 dark:border-gray-700
                    bg-gray-50 dark:bg-gray-800
                    text-gray-900 dark:text-gray-100
                    focus:outline-none focus:ring-2 focus:ring-blue-500/30
                  "
                >
                  <option value="all">All Roles</option>
                  <option value="student">Student</option>
                  <option value="instructor">Instructor</option>
                  <option value="admin">Admin</option>
                </select>

                <select
                  value={statusFilter}
                  onChange={(e) => {
                    setCurrentPage(1);
                    setStatusFilter(e.target.value);
                  }}
                  className="
                    h-11 px-4 rounded-2xl
                    border border-gray-200 dark:border-gray-700
                    bg-gray-50 dark:bg-gray-800
                    text-gray-900 dark:text-gray-100
                    focus:outline-none focus:ring-2 focus:ring-blue-500/30
                  "
                >
                  <option value="all">All Status</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
            </div>
          </div>

          {/* Instructor Requests */}
          <section className="rounded-3xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-sm mb-8 overflow-hidden">
            <div className="px-6 py-5 border-b border-gray-200 dark:border-gray-800">
              <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100">
                Instructor Requests
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Review and approve or reject pending instructor applications.
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[700px]">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50">
                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                      Email
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                      Name
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                      ID Image
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {requests?.length > 0 ? (
                    requests.map((u) => (
                      <tr
                        key={u._id}
                        className="border-b border-gray-100 dark:border-gray-800 last:border-b-0"
                      >
                        <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-200">
                          {u.email}
                        </td>

                        <td className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-gray-100">
                          {u.instructorRequestData?.fullName || "-"}
                        </td>

                        <td className="px-6 py-4">
                          <img
                            src={u.instructorRequestData?.idImage}
                            alt="ID"
                            className="w-16 h-16 object-cover rounded-2xl border border-gray-200 dark:border-gray-700"
                          />
                        </td>

                        <td className="px-6 py-4">
                          <div className="flex flex-wrap gap-2">
                            <button
                              onClick={() => approve(u._id)}
                              className="px-4 py-2 rounded-xl text-sm font-medium bg-emerald-600 hover:bg-emerald-500 text-white transition-all"
                            >
                              Approve
                            </button>

                            <button
                              onClick={() => openRejectModal(u._id)}
                              className="px-4 py-2 rounded-xl text-sm font-medium bg-red-600 hover:bg-red-500 text-white transition-all"
                            >
                              Reject
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan="4"
                        className="px-6 py-10 text-center text-sm text-gray-500 dark:text-gray-400"
                      >
                        No pending instructor requests.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>

          {/* Users Table */}
          <section className="rounded-3xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-sm overflow-hidden">
            <div className="px-6 py-5 border-b border-gray-200 dark:border-gray-800">
              <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100">
                Users Management
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Total matched users: {totalUsers}
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[720px]">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50">
                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                      Email
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                      Role
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                      Status
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {users.length > 0 ? (
                    users.map((u) => (
                      <tr
                        key={u._id}
                        className="border-b border-gray-100 dark:border-gray-800 last:border-b-0"
                      >
                        <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-200">
                          {u.email}
                        </td>

                        <td className="px-6 py-4">
                          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-500/20 capitalize">
                            {u.role}
                          </span>
                        </td>

                        <td className="px-6 py-4">
                          {u.isActive ? (
                            <span className="px-3 py-1 text-xs rounded-full bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-500/20 font-semibold">
                              Active
                            </span>
                          ) : (
                            <span className="px-3 py-1 text-xs rounded-full bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 border border-red-100 dark:border-red-500/20 font-semibold">
                              Inactive
                            </span>
                          )}
                        </td>

                        <td className="px-6 py-4">
                          <div className="flex flex-wrap gap-2">
                            <button
                              onClick={() => toggleActive(u._id)}
                              className="px-4 py-2 rounded-xl text-sm font-medium bg-amber-500 hover:bg-amber-400 text-white transition-all"
                            >
                              Toggle
                            </button>

                            <button
                              onClick={() => deleteUser(u._id)}
                              className="px-4 py-2 rounded-xl text-sm font-medium bg-red-600 hover:bg-red-500 text-white transition-all"
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan="4"
                        className="px-6 py-10 text-center text-sm text-gray-500 dark:text-gray-400"
                      >
                        No users found for the selected filters.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <div className="px-6 py-5 border-t border-gray-200 dark:border-gray-800">
              <div className="flex flex-wrap items-center justify-center gap-2">
                <button
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((prev) => prev - 1)}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                    currentPage === 1
                      ? "bg-gray-200 dark:bg-gray-800 text-gray-400 cursor-not-allowed"
                      : "bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200"
                  }`}
                >
                  Prev
                </button>

                {Array.from({ length: totalPages }, (_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentPage(i + 1)}
                    className={`min-w-[40px] h-10 rounded-xl text-sm font-semibold transition-all ${
                      currentPage === i + 1
                        ? "bg-blue-600 text-white shadow-md shadow-blue-500/20"
                        : "bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200"
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}

                <button
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage((prev) => prev + 1)}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                    currentPage === totalPages
                      ? "bg-gray-200 dark:bg-gray-800 text-gray-400 cursor-not-allowed"
                      : "bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200"
                  }`}
                >
                  Next
                </button>
              </div>
            </div>
          </section>
        </main>
      </div>

      {showRejectModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
          <div className="w-full max-w-md rounded-3xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-2xl overflow-hidden animate-fadeIn">
            <div className="px-6 py-5 border-b border-gray-200 dark:border-gray-800">
              <h2 className="text-lg font-bold text-red-600 dark:text-red-400">
                Reject Instructor Request
              </h2>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Please provide a reason for rejecting this request.
              </p>
            </div>

            <div className="p-6">
              <textarea
                className="
                  w-full p-4 rounded-2xl
                  border border-gray-200 dark:border-gray-700
                  bg-gray-50 dark:bg-gray-800
                  text-gray-900 dark:text-gray-100
                  placeholder:text-gray-400 dark:placeholder:text-gray-500
                  focus:outline-none focus:ring-2 focus:ring-red-500/20
                  min-h-[120px] resize-none
                "
                rows="4"
                placeholder="Enter rejection reason..."
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
              />

              <div className="flex justify-end gap-3 mt-5">
                <button
                  onClick={closeRejectModal}
                  className="px-4 py-2 rounded-2xl bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 font-medium transition-all"
                >
                  Cancel
                </button>

                <button
                  onClick={submitReject}
                  className="px-4 py-2 rounded-2xl bg-red-600 hover:bg-red-500 text-white font-medium transition-all"
                >
                  Reject
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}