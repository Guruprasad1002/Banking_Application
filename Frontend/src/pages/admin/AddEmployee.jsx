import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import api from "../../api/axios";

const AddEmployee = () => {
  const [formData, setFormData] = useState({
    name: "",
    age: "",
    salary: "",
    position: "",
    address: "",
    phone: "",
    email: "",
    password: "",
  });

  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Sending to backend:", formData);
    try {

      const res = await api.post("/admin/employees/add", formData);
      toast.success("Employee added successfully!");
      setFormData({
        name: "",
        email: "",
        phone: "",
        password: "",
        age: "",
        salary: "",
        position: "",
        address: "",
      });
    } catch (err) {
      toast.error(err.response?.data?.message || "Error adding employee");
    }
  };

  return (
    <div className="p-6 bg-white shadow-md rounded-xl">
      <button
        onClick={() => navigate("/admin/dashboard")}
        className="flex items-center mb-4 text-blue-600 hover:underline"
      >
        <ArrowLeft size={24} className="mr-2" />
        Back to Dashboard
      </button>

      {message && <p className="font-semibold text-center text-green-600">{message}</p>}

      <h2 className="mb-4 text-2xl font-bold text-gray-700">Add New Employee</h2>
      <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Full Name"
          className="p-2 border border-gray-300 rounded-md"
          required
        />
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Email"
          className="p-2 border border-gray-300 rounded-md"
          required
        />
        <input
          type="text"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          placeholder="Phone Number"
          className="p-2 border border-gray-300 rounded-md"
          required
        />
        <input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="Password"
          className="p-2 border border-gray-300 rounded-md"
          required
        />
        <input
          type="number"
          name="age"
          value={formData.age}
          onChange={handleChange}
          placeholder="Age"
          min={18}
          className="p-2 border border-gray-300 rounded-md"
          required
        />
        <input
          type="number"
          name="salary"
          value={formData.salary}
          onChange={handleChange}
          placeholder="Salary"
          min={0}
          className="p-2 border border-gray-300 rounded-md"
          required
        />
        <input
          type="text"
          name="position"
          value={formData.position}
          onChange={handleChange}
          placeholder="Position"
          className="p-2 border border-gray-300 rounded-md"
          required
        />
        <input
          type="text"
          name="address"
          value={formData.address}
          onChange={handleChange}
          placeholder="Address"
          className="p-2 border border-gray-300 rounded-md"
          required
        />

        <div className="md:col-span-2">
          <button
            type="submit"
            className="w-full py-2 text-white transition bg-blue-600 rounded-md hover:bg-blue-700"
          >
            Add Employee
          </button>
        </div>
      </form>
      {message && (
        <p className="mt-4 font-medium text-center text-green-600">{message}</p>
      )}

      <ToastContainer />
    </div>
  );
};

export default AddEmployee;
