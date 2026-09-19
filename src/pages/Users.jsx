import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import {
  Users as UsersIcon,
  Shield,
  User,
  UserCheck,
  Search,
  Plus,
} from "lucide-react";
import UsersTable from "../components/users/UsersTable";
import UserFormModal from "../components/users/UserFormModal";
import DashboardLayout from "../components/layout/DashboardLayout";
import { fetchUsers } from "../api/user.api";
import PageLoader from "../components/ui/sessionLoader/PageLoader";

const Users = () => {
  const { t } = useTranslation();
  const [isPageLoading, setIsPageLoading] = useState(true);
  const [users, setUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);

  useEffect(() => {
    const loadUsers = async () => {
      try {
        setIsPageLoading(true);
        const response = await fetchUsers();
        const fetchedData =
          response.data?.users || response.data?.data || response.data;

        setUsers(Array.isArray(fetchedData) ? fetchedData : []);
      } catch (error) {
        console.error("Error fetching users:", error);
        setUsers([]);
        toast.error(t("errors.loadUsers") || "Failed to load users.", {
          toastId: "users-fetch-error",
        });
      } finally {
        setIsPageLoading(false);
      }
    };

    loadUsers();
  }, [t]);

  const safeUsers = Array.isArray(users) ? users : [];

  const totalUsers = safeUsers.length;
  const adminsCount = safeUsers.filter(
    (u) => u?.role?.toLowerCase() === "admin"
  ).length;
  const customersCount = safeUsers.filter(
    (u) => u?.role?.toLowerCase() === "customer"
  ).length;
  const verifiedCount = safeUsers.filter((u) => u?.isVerified).length;

  const filteredUsers = safeUsers.filter((user) => {
    const query = searchQuery.toLowerCase();
    const username = (user?.username || "").toLowerCase();
    const email = (user?.email || "").toLowerCase();

    return username.includes(query) || email.includes(query);
  });

  return (
    <DashboardLayout>
      {isPageLoading ? (
        <PageLoader text={t("pages.loadingUsers") || "Loading users..."} />
      ) : (
        <div className="p-2 sm:p-4 animate-fade-in">
          {/* Header section */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
            <div>
              <p className="text-indigo-600 font-semibold tracking-wider text-xs uppercase mb-1">
                {t("pages.userManagement") || "User Management"}
              </p>
              <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">
                {t("pages.manageUsers") || "Manage Users"}
              </h1>
            </div>

            <div className="flex flex-wrap gap-3 items-center">
              <div className="relative">
                <Search
                  size={18}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <input
                  type="text"
                  placeholder={t("pages.searchUsers") || "Search users..."}
                  className="bg-white border border-slate-200 rounded-xl pl-10 pr-4 py-2 w-full sm:w-64 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 shadow-xs transition"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              <button
                onClick={() => {
                  setEditingUser(null);
                  setIsModalOpen(true);
                }}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2 rounded-xl text-sm font-semibold flex items-center gap-2 transition-all shadow-xs cursor-pointer"
              >
                <Plus size={18} />
                {t("pages.addUser") || "Add User"}
              </button>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {/* Total Users */}
            <div className="bg-white p-5 rounded-2xl shadow-xs border border-slate-200/80 flex justify-between items-center hover:-translate-y-1 transition-all duration-300">
              <div>
                <p className="text-slate-500 text-xs font-medium mb-1">
                  {t("pages.totalUsers") || "Total Users"}
                </p>
                <p className="text-2xl font-bold text-slate-900">{totalUsers}</p>
              </div>
              <div className="bg-blue-50 text-blue-600 w-12 h-12 rounded-xl flex items-center justify-center">
                <UsersIcon size={22} />
              </div>
            </div>

            {/* Admins */}
            <div className="bg-white p-5 rounded-2xl shadow-xs border border-slate-200/80 flex justify-between items-center hover:-translate-y-1 transition-all duration-300">
              <div>
                <p className="text-slate-500 text-xs font-medium mb-1">
                  {t("pages.admins") || "Admins"}
                </p>
                <p className="text-2xl font-bold text-slate-900">{adminsCount}</p>
              </div>
              <div className="bg-purple-50 text-purple-600 w-12 h-12 rounded-xl flex items-center justify-center">
                <Shield size={22} />
              </div>
            </div>

            {/* Customers */}
            <div className="bg-white p-5 rounded-2xl shadow-xs border border-slate-200/80 flex justify-between items-center hover:-translate-y-1 transition-all duration-300">
              <div>
                <p className="text-slate-500 text-xs font-medium mb-1">
                  {t("pages.customers") || "Customers"}
                </p>
                <p className="text-2xl font-bold text-slate-900">
                  {customersCount}
                </p>
              </div>
              <div className="bg-teal-50 text-teal-600 w-12 h-12 rounded-xl flex items-center justify-center">
                <User size={22} />
              </div>
            </div>

            {/* Verified */}
            <div className="bg-white p-5 rounded-2xl shadow-xs border border-slate-200/80 flex justify-between items-center hover:-translate-y-1 transition-all duration-300">
              <div>
                <p className="text-slate-500 text-xs font-medium mb-1">
                  {t("pages.verified") || "Verified"}
                </p>
                <p className="text-2xl font-bold text-slate-900">
                  {verifiedCount}
                </p>
              </div>
              <div className="bg-amber-50 text-amber-600 w-12 h-12 rounded-xl flex items-center justify-center">
                <UserCheck size={22} />
              </div>
            </div>
          </div>

          {/* Users Table */}
          <UsersTable
            users={filteredUsers}
            setUsers={setUsers}
            onEditClick={(user) => {
              setEditingUser(user);
              setIsModalOpen(true);
            }}
          />

          {/* User Form Modal */}
          {isModalOpen && (
            <UserFormModal
              closeModal={() => {
                setIsModalOpen(false);
                setEditingUser(null);
              }}
              setUsers={setUsers}
              editingUser={editingUser}
            />
          )}
        </div>
      )}
    </DashboardLayout>
  );
};

export default Users;