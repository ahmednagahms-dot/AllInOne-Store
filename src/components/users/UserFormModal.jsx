import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { uploadToCloudinary } from "../../api/cloudinary";
import { addUser, updateUser } from "../../api/user.api";

const UserFormModal = ({ closeModal, setUsers, editingUser }) => {
  const [showModal, setShowModal] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    role: "customer",
    verified: false,
    image: "",
  });

  useEffect(() => {
    setShowModal(true);
    if (editingUser) {
      setFormData({
        name: editingUser.username || "",
        email: editingUser.email || "",
        phone: editingUser.phone || "",
        password: "", 
        role: editingUser.role ? editingUser.role.toLowerCase() : "customer",
        verified: editingUser.isVerified || false,
        image: editingUser.avatar || "",
      });
    }
  }, [editingUser]);

  const handleCloseAnimation = () => {
    setShowModal(false);
    setTimeout(() => {
      closeModal();
    }, 300);
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setIsUploading(true);

    try {
      const imageUrl = await uploadToCloudinary(file);
      setFormData((prev) => ({ ...prev, image: imageUrl }));
      toast.success("Image uploaded successfully", {
        toastId: "avatar-upload-success",
      });
    } catch (error) {
      console.error(error);
      toast.error("Error uploading image!", {
        toastId: "avatar-upload-error",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);

    const payload = {
      username: formData.name,
      email: formData.email,
      role: formData.role.toLowerCase(),
      avatar: formData.image,
      phone: formData.phone || "01000000000",
    };
    
    if (!editingUser) {
      payload.password = formData.password || "Password123!";
    } else if (formData.password) {
      payload.password = formData.password;
    }

    try {
      if (editingUser) {
        const response = await updateUser(editingUser._id, payload);
        const updatedData =
          response.data?.user ||
          response.data?.data ||
          response.data ||
          payload;

        setUsers((prev) =>
          prev.map((u) =>
            u._id === editingUser._id ? { ...u, ...updatedData } : u
          )
        );

        toast.success("User updated successfully", {
          toastId: "user-update-success",
        });
      } else {
        const response = await addUser(payload);
        const createdUser =
          response.data?.user ||
          response.data?.data ||
          response.data ||
          payload;

        setUsers((prev) => [...prev, createdUser]);

        toast.success("User created successfully", {
          toastId: "user-create-success",
        });
      }
      handleCloseAnimation();
    } catch (error) {
      console.error("Error saving user:", error);
      const backendError =
        error.response?.data?.message ||
        error.response?.data?.error ||
        "There was a problem saving the user.";

      toast.error(backendError, {
        toastId: "user-save-error",
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div
      className={`fixed inset-0 backdrop-blur-sm flex justify-center items-center z-50 transition-all duration-300 ${
        showModal ? "bg-black/30 opacity-100" : "bg-black/0 opacity-0"
      }`}
    >
      <div
        className={`bg-white p-6 sm:p-8 rounded-2xl w-full max-w-md shadow-xl transition-all duration-300 transform max-h-[90vh] overflow-y-auto ${
          showModal ? "scale-100 translate-y-0" : "scale-95 translate-y-4"
        }`}
      >
        <h2 className="text-2xl font-bold mb-6 text-slate-900">
          {editingUser ? "Edit User" : "Add New User"}
        </h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* Avatar Upload */}
          <div className="flex flex-col items-center gap-3 mb-2">
            <div className="relative w-24 h-24 rounded-full border-2 border-dashed border-slate-300 flex items-center justify-center overflow-hidden bg-slate-50 group hover:border-indigo-500 transition-colors">
              {isUploading ? (
                <div className="text-slate-500 text-xs text-center flex flex-col items-center gap-1">
                  <span className="animate-spin text-lg">⏳</span>
                  Uploading...
                </div>
              ) : formData.image ? (
                <img
                  src={formData.image}
                  alt="Preview"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="text-slate-400 text-xs text-center px-2 group-hover:text-indigo-600 transition-colors">
                  <span className="text-2xl block mb-1">📸</span>
                  Click to Upload
                </div>
              )}

              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                disabled={isUploading}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
              />
            </div>
          </div>

          {/* Name Field */}
          <div>
            <label className="block text-sm font-medium text-slate-600 mb-1">
              Name
            </label>
            <input
              type="text"
              required
              className="w-full border border-slate-200 bg-slate-50/50 p-2.5 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
            />
          </div>

          {/* Email Field */}
          <div>
            <label className="block text-sm font-medium text-slate-600 mb-1">
              Email
            </label>
            <input
              type="email"
              required
              className="w-full border border-slate-200 bg-slate-50/50 p-2.5 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
            />
          </div>

          {/* Password Field (Only when adding or optionally updating) */}
          {!editingUser && (
            <div>
              <label className="block text-sm font-medium text-slate-600 mb-1">
                Password
              </label>
              <input
                type="password"
                placeholder="Password123!"
                className="w-full border border-slate-200 bg-slate-50/50 p-2.5 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
              />
            </div>
          )}

          {/* Role Selection */}
          <div>
            <label className="block text-sm font-medium text-slate-600 mb-1">
              Role
            </label>
            <select
              className="w-full border border-slate-200 bg-slate-50/50 p-2.5 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition"
              value={formData.role}
              onChange={(e) =>
                setFormData({ ...formData, role: e.target.value })
              }
            >
              <option value="customer">Customer</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          {/* Buttons */}
          <div className="flex gap-3 mt-4">
            <button
              type="button"
              onClick={handleCloseAnimation}
              className="w-1/2 bg-slate-100 text-slate-700 py-2.5 rounded-xl text-sm font-semibold hover:bg-slate-200 transition-colors cursor-pointer"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isUploading || isSaving}
              className="w-1/2 bg-indigo-600 hover:bg-indigo-700 text-white py-2.5 rounded-xl text-sm font-semibold transition-all shadow-xs disabled:opacity-70 disabled:cursor-wait flex justify-center items-center gap-2 cursor-pointer"
            >
              {isSaving ? (
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
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  {editingUser ? "Updating..." : "Adding..."}
                </>
              ) : editingUser ? (
                "Update User"
              ) : (
                "Save User"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserFormModal;