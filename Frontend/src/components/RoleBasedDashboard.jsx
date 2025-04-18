import CustomerDashboard from "../pages/customer/CustomerDashboard";
import EmployeeDashboard from "../pages/employee/EmployeeDashboard";
import AdminDashboard from "../pages/admin/AdminDashboard";
import { useAuth } from "../authContext";

const RoleBasedDashboard = () => {
  const { user } = useAuth();

  switch (user.role) {
    case "admin": return <AdminDashboard />;
    case "employee": return <EmployeeDashboard />;
    case "customer": return <CustomerDashboard />;
    default: return <div>Invalid Role</div>;
  }
};

export default RoleBasedDashboard;
