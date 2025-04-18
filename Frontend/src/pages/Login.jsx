import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Handshake } from 'lucide-react';
import { useAuth } from "../authContext";
import api from "../api/axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Login = () => {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const nav = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.post("/users/login", { email, password });
      login({
        name: res.data.user.name,        
        email: res.data.user.email,
        role: res.data.user.role,
        token: res.data.token,
      });
      
      toast.success("Login successful");
      setTimeout(() => {
        nav(`/${res.data.user.role}/dashboard`);
      }, 2000);
    } catch (err) {
      toast.error(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-100 to-blue-300">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md p-8 bg-white shadow-lg rounded-2xl"
      >
        <div className="flex items-center justify-center mb-6">
          <h2 className="mr-4 text-3xl font-semibold text-blue-800">Welcome Back</h2>
          <Handshake className="mt-2 mr-2 text-blue-600" size={28} />
        </div>

        <div className="mb-4">
          <label className="block mb-1 text-sm font-medium text-gray-600">Email</label>
          <input
            type="email"
            placeholder="Enter your email"
            className="w-full px-4 py-2 border rounded-lg focus:outline-none"
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="mb-6">
          <label className="block mb-1 text-sm font-medium text-gray-600">Password</label>
          <input
            type="password"
            placeholder="Enter your password"
            className="w-full px-4 py-2 border rounded-lg focus:outline-none"
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-2 font-semibold text-white transition duration-300 bg-blue-500 rounded-lg hover:bg-blue-600"
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        <ToastContainer />
      </form>
    </div>
  );
};

export default Login;
