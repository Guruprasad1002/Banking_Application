import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { ArrowLeft, Trash2, UserCheck } from "lucide-react";
import api from "../../api/axios";
import "react-toastify/dist/ReactToastify.css";
import { toast, ToastContainer } from "react-toastify";

const ManageUsers = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const { data } = await api.get("/admin/users");
        setUsers(data.users);
      } catch (error) {
        toast.error("Failed to fetch users");
      }
    };
    fetchUsers();
  }, []);

  const handleStatusChange = async (userId, newStatus) => {
    try {
      await api.put("/admin/users/update-status", { userId, status: newStatus });
      setUsers((prev) =>
        prev.map((u) =>
          u._id === userId ? { ...u, status: newStatus } : u
        )
      );
      toast.success(`User ${newStatus === "active" ? "activated" : "deactivated"}`);
    } catch (error) {
      toast.error("Status update failed");
    }
  };  

  return (
    <div className="min-h-screen p-6 bg-gray-100">
      <div className="max-w-6xl p-6 mx-auto bg-white shadow-lg rounded-xl">
        <div className="mb-6">
          <Link
            to="/admin/dashboard"
            className="flex items-center mb-4 text-blue-600 hover:underline">
            <ArrowLeft className="mr-2" size={20} />
            Back to Dashboard
          </Link>
          <h2 className="ml-6 text-3xl font-semibold text-gray-800">Manage Users</h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm border rounded-lg">
            <thead className="text-gray-700 bg-gray-200">
              <tr>
                <th className="px-4 py-2 text-left">Name</th>
                <th className="px-4 py-2 text-left">Email</th>
                <th className="px-4 py-2 text-left">Role</th>
                <th className="px-4 py-2 text-left">Status</th>
                <th className="px-4 py-2 text-left">Joined</th>
                <th className="px-4 py-2 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u._id} className="transition border-t hover:bg-gray-50">
                  <td className="px-4 py-2 font-medium">{u.name}</td>
                  <td className="px-4 py-2">{u.email}</td>
                  <td className="px-4 py-2 capitalize">{u.role}</td>
                  <td className="px-4 py-2">
                    <span
                      className={`inline-block px-2 py-1 rounded text-xs font-semibold ${u.status === "active"
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                        }`}
                    >
                      {u.status}
                    </span>
                  </td>
                  <td className="px-4 py-2">
                    {new Date(u.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-2 space-x-2">
                    {u.status === "active" ? (
                      <button
                        onClick={() => handleStatusChange(u._id, "inactive")}
                        className="flex items-center px-3 py-1 text-sm text-white transition bg-red-500 rounded-md hover:bg-red-600"
                      >
                        <Trash2 size={16} className="mr-1" />
                        Deactivate
                      </button>
                    ) : (
                      <button
                        onClick={() => handleStatusChange(u._id, "active")}
                        className="flex items-center px-3 py-1 text-sm text-white transition bg-green-500 rounded-md hover:bg-green-600"
                      >
                        <UserCheck size={16} className="mr-1" />
                        Activate
                      </button>
                    )}
                  </td>
                </tr>
              ))}
              {users.length === 0 && (
                <tr>
                  <td colSpan="6" className="py-6 text-center text-gray-500">
                    No users found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default ManageUsers;
