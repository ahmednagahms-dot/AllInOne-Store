import React, { useState } from "react";
import { toast } from "react-toastify";
import { deleteUser, updateUser } from "../../api/user.api";

const UsersTable = ({ users, setUsers, onEditClick }) => {
  const [updatingId, setUpdatingId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [userToDelete, setUserToDelete] = useState(null);
  const [selectedViewUser, setSelectedViewUser] = useState(null);

  const handleDeleteClick = (id) => {
    setUserToDelete(id);
  };

  const confirmDelete = async () => {
    if (!userToDelete) return;

    setDeletingId(userToDelete);

    try {
      await deleteUser(userToDelete);

      const updatedUsers = users.filter(
        (u) => u._id !== userToDelete
      );

      setUsers(updatedUsers);
      setUserToDelete(null);

      toast.success("User deleted successfully", {
        toastId: "user-delete-success",
      });
    } catch (error) {
      console.error("Error deleting user:", error);

      toast.error("Failed to delete user", {
        toastId: "user-delete-error",
      });
    } finally {
      setDeletingId(null);
    }
  };

  const handleToggleVerify = async (id, currentStatus) => {
    setUpdatingId(id);

    try {
      await updateUser(id, {
        isVerified: !currentStatus,
      });

      const updatedUsers = users.map((u) =>
        u._id === id
          ? { ...u, isVerified: !currentStatus }
          : u
      );

      setUsers(updatedUsers);

      toast.success(
        !currentStatus
          ? "User verified successfully"
          : "User verification removed",
        {
          toastId: "user-verification-success",
        }
      );
    } catch (error) {
      console.error("Error updating verification:", error);

      toast.error("Failed to update user verification", {
        toastId: "user-verification-error",
      });
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="text-slate-500 text-sm bg-slate-100">
            <th className="p-4 font-medium">User</th>
            <th className="p-4 font-medium">Role</th>
            <th className="p-4 font-medium">Verified</th>
            <th className="p-4 font-medium">Actions</th>
          </tr>
        </thead>

        <tbody>
          {users.map((user) => (
            <tr
              key={user._id || user.id}
              className="hover:bg-slate-50/50 transition-colors border-b border-slate-100 last:border-none"
            >
              {/* User */}
              <td className="p-4">
                <div
                  className="flex items-center gap-4 cursor-pointer group"
                  onClick={() => setSelectedViewUser(user)}
                >
                  {user?.avatar ? (
                    <img
                      src={user.avatar}
                      alt={user.username}
                      className="w-12 h-12 rounded-full object-cover border border-slate-200 shadow-sm group-hover:opacity-80 transition-opacity"
                    />
                  ) : (
                    <div className="w-12 h-12 bg-slate-800 text-white rounded-full flex items-center justify-center font-bold text-lg shadow-sm group-hover:opacity-80 transition-opacity">
                      {user?.username?.charAt(0).toUpperCase()}
                    </div>
                  )}

                  <div>
                    <p className="font-bold text-slate-800 group-hover:text-indigo-600 transition-colors">
                      {user?.username}
                    </p>

                    <p className="text-sm text-slate-500">
                      {user?.email}
                    </p>
                  </div>
                </div>
              </td>

              {/* Role */}
              <td className="p-4">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${
                    user?.role?.toLowerCase() === "customer"
                      ? "bg-emerald-50 text-emerald-700"
                      : "bg-purple-50 text-purple-700"
                  }`}
                >
                  {user?.role}
                </span>
              </td>

              {/* Verification */}
              <td className="p-4">
                {user?.isVerified ? (
                  <span className="text-emerald-600 font-semibold flex items-center gap-1 text-sm">
                    Verified
                  </span>
                ) : (
                  <span className="text-rose-500 font-semibold flex items-center gap-1 text-sm">
                    Not Verified
                  </span>
                )}
              </td>

              {/* Actions */}
              <td className="p-4">
                <div className="flex gap-2">
                  {/* Edit */}
                  <button
                    onClick={() => onEditClick(user)}
                    title="Edit User"
                    className="text-white w-9 h-9 rounded-xl bg-sky-500 hover:bg-sky-600 flex items-center justify-center transition-colors shadow-sm cursor-pointer"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={2}
                      stroke="currentColor"
                      className="w-4 h-4"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8a4.5 4.5 0 01-1.13-1.897l.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125"
                      />
                    </svg>
                  </button>

                  {/* Verify / Unverify */}
                  <button
                    onClick={() =>
                      handleToggleVerify(user._id, user.isVerified)
                    }
                    disabled={updatingId === user._id}
                    title={
                      user.isVerified
                        ? "Remove Verification"
                        : "Verify User"
                    }
                    className={`text-white w-9 h-9 rounded-xl flex items-center justify-center transition-colors shadow-sm cursor-pointer ${
                      updatingId === user._id
                        ? "bg-emerald-400 cursor-wait"
                        : "bg-emerald-500 hover:bg-emerald-600"
                    }`}
                  >
                    {updatingId === user._id ? (
                      <svg
                        className="animate-spin w-4 h-4 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        />

                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                      </svg>
                    ) : (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={2}
                        stroke="currentColor"
                        className="w-4 h-4"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z"
                        />
                      </svg>
                    )}
                  </button>

                  {/* Delete */}
                  <button
                    onClick={() => handleDeleteClick(user._id)}
                    title="Delete User"
                    className="text-white w-9 h-9 rounded-xl flex items-center justify-center transition-colors shadow-sm bg-rose-500 hover:bg-rose-600 cursor-pointer"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={2}
                      stroke="currentColor"
                      className="w-4 h-4"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                      />
                    </svg>
                  </button>
                </div>
              </td>
            </tr>
          ))}

          {users.length === 0 && (
            <tr>
              <td
                colSpan="4"
                className="text-center p-8 text-slate-500 text-sm"
              >
                No users found!
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Sidebar / Aside Overlay */}
      {selectedViewUser && (
        <div className="fixed inset-0 z-[60] flex justify-end overflow-hidden">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
            onClick={() => setSelectedViewUser(null)}
          />

          <aside className="relative w-full md:w-1/2 h-screen bg-white shadow-2xl z-[70] flex flex-col overflow-y-auto">
            <div className="flex justify-between items-start p-6 border-b border-slate-100 bg-white sticky top-0 z-10">
              <div className="flex items-center gap-4">
                <img
                  src={
                    selectedViewUser?.avatar ||
                    "https://cdn-icons-png.flaticon.com/512/149/149071.png"
                  }
                  alt="avatar"
                  className="w-16 h-16 rounded-full object-cover border-2 border-slate-100 shadow-sm"
                />

                <div>
                  <h2 className="text-2xl font-bold text-slate-800">
                    {selectedViewUser?.username}
                  </h2>

                  <span
                    className={`mt-1 inline-block px-3 py-0.5 rounded-full text-xs font-bold uppercase ${
                      selectedViewUser?.role?.toLowerCase() === "admin"
                        ? "bg-purple-100 text-purple-700"
                        : "bg-slate-100 text-slate-700"
                    }`}
                  >
                    {selectedViewUser?.role}
                  </span>
                </div>
              </div>

              <button
                onClick={() => setSelectedViewUser(null)}
                className="text-slate-400 hover:text-slate-700 hover:bg-slate-100 p-2 rounded-full transition-colors cursor-pointer"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                  className="w-6 h-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <div className="p-6 space-y-8 flex-1 bg-slate-50/30">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl border border-slate-100 bg-white shadow-sm">
                  <div className="text-slate-500 text-sm font-medium flex items-center gap-2 mb-2">
                    Total Orders
                  </div>
                  <div className="text-2xl font-extrabold text-slate-800">
                    0
                  </div>
                </div>

                <div className="p-4 rounded-2xl border border-slate-100 bg-white shadow-sm">
                  <div className="text-slate-500 text-sm font-medium flex items-center gap-2 mb-2">
                    Current
                  </div>
                  <div className="text-2xl font-extrabold text-slate-800">
                    0
                  </div>
                </div>

                <div className="p-4 rounded-2xl border border-emerald-100 bg-emerald-50/50 shadow-sm">
                  <div className="text-emerald-600 text-sm font-medium flex items-center gap-2 mb-2">
                    Paid
                  </div>
                  <div className="text-2xl font-extrabold text-emerald-700">
                    0
                  </div>
                </div>

                <div className="p-4 rounded-2xl border border-rose-100 bg-rose-50/50 shadow-sm">
                  <div className="text-rose-500 text-sm font-medium flex items-center gap-2 mb-2">
                    Cancelled
                  </div>
                  <div className="text-2xl font-extrabold text-rose-600">
                    0
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-xs font-bold text-slate-400 mb-4 uppercase tracking-widest">
                  Contact Info
                </h3>

                <div className="space-y-4 bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
                  <div className="flex items-center gap-3 text-slate-700">
                    <span className="font-medium">
                      {selectedViewUser?.email}
                    </span>
                  </div>

                  <div className="flex items-center gap-3 text-slate-700">
                    <span className="font-medium">
                      {selectedViewUser?.phone || "—"}
                    </span>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-xs font-bold text-slate-400 mb-4 uppercase tracking-widest">
                  Addresses
                </h3>

                <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
                  <p className="text-slate-500 text-sm font-medium">
                    No saved addresses.
                  </p>
                </div>
              </div>
            </div>
          </aside>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {userToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm transition-opacity">
          <div className="bg-white rounded-2xl p-6 w-[400px] shadow-2xl transform transition-all text-center">
            <div className="w-16 h-16 bg-rose-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-8 h-8 text-rose-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
            </div>

            <h3 className="text-xl font-bold text-slate-800 mb-2">
              Are you sure you want to delete this user?
            </h3>

            <p className="text-slate-500 text-sm mb-6">
              If you delete it, you won't be able to recover its data.
              This step is final.
            </p>

            <div className="flex gap-3 justify-center">
              <button
                onClick={() => setUserToDelete(null)}
                disabled={deletingId !== null}
                className="px-5 py-2.5 bg-slate-100 text-slate-700 font-medium rounded-xl hover:bg-slate-200 transition-colors disabled:opacity-50 cursor-pointer"
              >
                Cancel
              </button>

              <button
                onClick={confirmDelete}
                disabled={deletingId !== null}
                className="px-5 py-2.5 bg-rose-500 text-white font-medium rounded-xl hover:bg-rose-600 transition-colors flex items-center gap-2 disabled:opacity-70 disabled:cursor-wait shadow-sm shadow-rose-200 cursor-pointer"
              >
                {deletingId !== null ? (
                  <>
                    <svg
                      className="animate-spin w-4 h-4 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />

                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>

                    Deleting...
                  </>
                ) : (
                  "Delete"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UsersTable;