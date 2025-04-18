import { useEffect, useState } from "react";
import { ArrowLeft, Trash2, Ban, CheckCircle2 } from "lucide-react";
import { useAuth } from "../../authContext";
import { Link } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import api from "../../api/axios";
const ManageEmployees = () => {
  const { user } = useAuth();
  const dashboardPath = `/${user?.role}/dashboard`;
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchEmployees = async () => {
    try {
      const { data } = await api.get("/admin/employees");
      setEmployees(data.employees || []);
    } catch (err) {
      toast.error("Failed to load employees");
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async (id) => {
    try {
      await api.delete("/admin/employees", {
        data: { employeeId: id }
      });
      setEmployees((prev) => prev.filter((e) => e._id !== id));
      toast.success("Employee removed successfully.");
    } catch (error) {
      toast.error("Failed to remove employee.");
      console.error("Delete error:", error);
    }
  };
  

  const handleStatusToggle = async (userId, currentStatus) => {
    const newStatus = currentStatus === "active" ? "inactive" : "active";
    try {
      const { data } = await api.put("/admin/users/update-status", {
        userId,
        status: newStatus,
      });
      setEmployees((prev) =>
        prev.map((e) =>
          e._id === userId ? { ...e, status: data.user.status } : e
      
        )
      );      
      toast.success(`Employee ${newStatus === "inactive" ? "deactivated" : "activated"}`);
    } catch (err) {
      toast.error("Failed to update employee status");
    }
  };  

  useEffect(() => {
    fetchEmployees();
  }, []);

  return (
    <div className="max-w-4xl p-6 mx-auto">
      <Link
        to={dashboardPath}
        className="flex items-center mb-4 text-blue-600 hover:underline"
      >
        <ArrowLeft className="mr-2" size={20} />
        Back to Dashboard
      </Link>

      <h2 className="mb-6 text-2xl font-bold text-gray-800">Manage Employees</h2>

      {loading ? (
        <p className="text-gray-500">Loading employees...</p>
      ) : employees.length === 0 ? (
        <p className="text-gray-500">No employees found.</p>
      ) : (
        <div className="space-y-4">
          {employees.map((e) => (
            <div
              key={e._id}
              className="flex items-center justify-between p-4 transition bg-white shadow rounded-xl hover:shadow-md"
            >
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{e.name}</h3>
                <p className="text-sm text-gray-600">
                  {e.department || "N/A"} — {e.position || e.role}
                </p>
                <p className="text-sm text-gray-500">{e.email}</p>
                <p className="text-sm text-gray-400">
                  Joined on: {new Date(e.createdAt).toLocaleDateString()}
                </p>
                <p className="mt-1 text-sm">
                  <span
                    className={`inline-block px-2 py-1 text-xs rounded-full font-semibold ${
                      e.status === "active"
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-600"
                    }`}
                  >
                    {e.status === "active" ? "Active" : "Inactive"}
                  </span>
                </p>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => handleStatusToggle(e._id, e.status)}
                  className={`flex items-center px-3 py-2 rounded-xl transition text-white ${
                    e.status === "active"
                      ? "bg-yellow-500 hover:bg-yellow-600"
                      : "bg-green-600 hover:bg-green-700"
                  }`}
                >
                  {e.status === "active" ? (
                    <>
                      <Ban className="mr-1" size={16} />
                      Deactivate
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="mr-1" size={16} />
                      Activate
                    </>
                  )}
                </button>

                <button
                  onClick={() => handleRemove(e._id)}
                  className="flex items-center px-3 py-2 text-white transition bg-red-500 hover:bg-red-600 rounded-xl"
                >
                  <Trash2 className="mr-1" size={16} />
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
      <ToastContainer/>
    </div>
  );
};

export default ManageEmployees;
