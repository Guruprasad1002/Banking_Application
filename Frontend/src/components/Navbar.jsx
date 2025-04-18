import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../authContext";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // Function to handle logo click and navigate to the user's dashboard
  const handleLogoClick = () => {
    if (user) {
      const userRole = user.role; // Assuming 'role' is a property in your user object
      navigate(`/${userRole}/dashboard`); // Navigate to the respective dashboard
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="flex items-center justify-between h-16 px-6 py-2 bg-white shadow-md">
      <div className="flex items-center gap-2" onClick={handleLogoClick}>
        <img src="../images/logo.png" alt="Bank Logo" className="w-auto cursor-pointer h-14" />
      </div>

      {user ? (
        <div className="flex items-center gap-4">
          <span className="font-medium text-gray-800">{user.name}</span>
          <button
            onClick={handleLogout}
            className="px-4 py-1.5 text-sm text-white bg-red-500 rounded-md hover:bg-red-600 transition"
          >
            Logout
          </button>
        </div>
      ) : (
        <Link
          to="/login"
          className="text-sm text-blue-600 transition hover:underline"
        >
          Login
        </Link>
      )}
    </nav>
  );
};

export default Navbar;
