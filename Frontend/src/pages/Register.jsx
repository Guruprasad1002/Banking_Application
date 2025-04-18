import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { UserPlus, Mail, Phone, Lock, MapPin, UserCheck } from "lucide-react";
import api from "../api/axios";
import { Link } from "react-router-dom";

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    role: "customer",
    address: ""
  });

  const [errors, setErrors] = useState({
    phoneError: "",
    passwordError: "",
  });

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value
    }));

    if (e.target.name === "phone") {
      setErrors((prev) => ({ ...prev, phoneError: "" }));
    }
    if (e.target.name === "password" || e.target.name === "confirmPassword") {
      setErrors((prev) => ({ ...prev, passwordError: "" }));
    }
  };

  const validatePhone = (phone) => {
    return phone.length === 10 && /^\d+$/.test(phone);
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    if (!validatePhone(formData.phone)) {
      setErrors((prev) => ({ ...prev, phoneError: "Phone number must be 10 digits." }));
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setErrors((prev) => ({ ...prev, passwordError: "Passwords do not match." }));
      return;
    }

    if (!formData.address.trim()) {
      toast.error("Address is required!", { position: "top-center" });
      return;
    }

    try {
      const response = await api.post("/users/register", {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
        role: formData.role,
        address: formData.address,
      });

      toast.info("OTP sent! Please verify to complete registration.", {
        position: "top-center",
        autoClose: 3000,
      });

      setTimeout(() => {
        navigate("/otp", {
          state: { otp: response.data.otp },
        });
      }, 2500);
    } catch (err) {
      console.error(err);
      if (err.response && err.response.data) {
        toast.error(err.response.data.message || "Registration failed. Please try again.", {
          position: "top-center",
          autoClose: 5000,
        });
      }
    }
  };

  return (
    <div className="relative flex items-center justify-center min-h-screen bg-center bg-cover" 
      style={{ backgroundImage: "url('https://images.unsplash.com/photo-1501167786227-4cba60f6d58f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80')" }}>
          <div className="absolute inset-0 bg-black opacity-50"></div>
      
      <nav className="absolute top-0 left-0 flex items-center justify-between w-full px-6 py-4 size-20 ">
      <Link to="/" className="flex items-center gap-2 text-2xl font-bold">
      <img src="./images/logo2.png" alt="Bank Logo" className="h-16" />
        </Link>
      </nav>

      <div className="w-full max-w-md p-8 bg-white shadow-2xl bg-opacity-90 rounded-xl backdrop-blur-sm">
        <h2 className="mb-6 text-3xl font-bold text-center text-gray-800">Create Your Account</h2>
        <form onSubmit={handleRegister} className="space-y-4">
          <div className="flex items-center py-2 border-b border-gray-300">
            <UserPlus className="mr-2 text-gray-400" />
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full px-2 py-1 mr-3 leading-tight text-gray-700 bg-transparent border-none appearance-none focus:outline-none"
            />
          </div>

          <div className="flex items-center py-2 border-b border-gray-300">
            <Mail className="mr-2 text-gray-400" />
            <input
              type="email"
              name="email"
              placeholder="Email Address"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full px-2 py-1 mr-3 leading-tight text-gray-700 bg-transparent border-none appearance-none focus:outline-none"
            />
          </div>

          <div className="flex items-center py-2 border-b border-gray-300">
            <Phone className="mr-2 text-gray-400" />
            <input
              type="tel"
              name="phone"
              placeholder="Phone Number"
              value={formData.phone}
              onChange={handleChange}
              required
              className="w-full px-2 py-1 mr-3 leading-tight text-gray-700 bg-transparent border-none appearance-none focus:outline-none"
            />
          </div>
          {errors.phoneError && <p className="text-sm text-red-500">{errors.phoneError}</p>}

          <div className="flex items-center py-2 border-b border-gray-300">
            <Lock className="mr-2 text-gray-400" />
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full px-2 py-1 mr-3 leading-tight text-gray-700 bg-transparent border-none appearance-none focus:outline-none"
            />
          </div>

          <div className="flex items-center py-2 border-b border-gray-300">
            <Lock className="mr-2 text-gray-400" />
            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm Password"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              className="w-full px-2 py-1 mr-3 leading-tight text-gray-700 bg-transparent border-none appearance-none focus:outline-none"
            />
          </div>
          {errors.passwordError && <p className="text-sm text-red-500">{errors.passwordError}</p>}

          <div className="flex items-center py-2 border-b border-gray-300">
            <UserCheck className="mr-2 text-gray-400" />
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="w-full px-2 py-1 mr-3 leading-tight text-gray-700 bg-transparent border-none appearance-none focus:outline-none"
            >
              <option value="customer">Customer</option>
            </select>
          </div>

          <div className="flex items-center py-2 border-b border-gray-300">
            <MapPin className="mr-2 text-gray-400" />
            <textarea
              name="address"
              placeholder="Address"
              value={formData.address}
              onChange={handleChange}
              required
              className={`w-full px-2 py-1 mr-3 leading-tight text-gray-700 bg-transparent border-none appearance-none focus:outline-none ${!formData.address.trim() ? "border-b-2 border-red-500" : ""
                }`}
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 text-white transition duration-300 ease-in-out transform bg-blue-600 rounded-full hover:bg-blue-700 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
          >
            Register
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-gray-600">
            Already have an account?{" "}
            <button
              onClick={() => navigate("/login")}
              className="font-semibold text-blue-600 hover:underline"
            >
              Login
            </button>
          </p>
        </div>
        <ToastContainer />
      </div>
    </div>
  );
};

export default Register;
