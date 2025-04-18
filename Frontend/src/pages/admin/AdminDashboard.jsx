import { Link } from "react-router-dom";
import { useAuth } from "../../authContext";
import {
  Users,
  Briefcase,
  BarChart2,
  Shield,
  UserPlus,
  HandCoins,
} from "lucide-react";

const AdminDashboard = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen p-6 bg-gray-100">
      <div className="max-w-5xl mx-auto">
        <h1 className="mb-2 text-3xl font-bold text-center text-gray-800">
          Welcome Back
        </h1>
        <p className="mb-6 text-xl font-medium text-center text-blue-600">
          {user?.name}
        </p>

        <div className="grid grid-cols-1 gap-4 mb-8 sm:grid-cols-2 lg:grid-cols-4">
          <div className="flex items-center justify-between p-4 transition bg-white shadow-md group rounded-xl hover:bg-blue-100">
            <div>
              <h2 className="text-sm text-gray-500">Total Users</h2>
              <p className="text-2xl font-semibold text-blue-600 group-hover:text-blue-700">120</p>
            </div>
            <Users className="text-blue-500 group-hover:text-blue-700" size={32} />
          </div>

          <div className="flex items-center justify-between p-4 transition bg-white shadow-md group rounded-xl hover:bg-green-100">
            <div>
              <h2 className="text-sm text-gray-500">Employees</h2>
              <p className="text-2xl font-semibold text-green-600 group-hover:text-green-700">18</p>
            </div>
            <Briefcase className="text-green-500 group-hover:text-green-700" size={32} />
          </div>

          <div className="flex items-center justify-between p-4 transition bg-white shadow-md group rounded-xl hover:bg-yellow-100">
            <div>
              <h2 className="text-sm text-gray-500">Reports</h2>
              <p className="text-2xl font-semibold text-yellow-600 group-hover:text-yellow-700">47</p>
            </div>
            <BarChart2 className="text-yellow-500 group-hover:text-yellow-700" size={32} />
          </div>

          <div className="flex items-center justify-between p-4 transition bg-white shadow-md group rounded-xl hover:bg-purple-100">
            <div>
              <h2 className="text-sm text-gray-500">Roles</h2>
              <p className="text-2xl font-semibold text-purple-600 group-hover:text-purple-700">3</p>
            </div>
            <Shield className="text-purple-500 group-hover:text-purple-700" size={32} />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <Link
            to="/admin/users"
            className="p-6 text-center transition bg-blue-100 shadow-md hover:bg-blue-200 rounded-xl"
          >
            <Users size={40} className="mx-auto mb-2 text-blue-600" />
            <h2 className="text-lg font-semibold text-blue-800">Manage Users</h2>
            <p className="text-sm text-gray-600">Edit or remove users</p>
          </Link>

          <Link
            to="/admin/add-employees"
            className="p-6 text-center transition bg-orange-100 shadow-md hover:bg-orange-200 rounded-xl"
          >
            <UserPlus size={40} className="mx-auto mb-2 text-orange-600" />
            <h2 className="text-lg font-semibold text-orange-800">Add Employees</h2>
            <p className="text-sm text-gray-600">Add new employees</p>
          </Link>

          <Link
            to="/admin/employees"
            className="p-6 text-center transition bg-green-100 shadow-md hover:bg-green-200 rounded-xl"
          >
            <Briefcase size={40} className="mx-auto mb-2 text-green-600" />
            <h2 className="text-lg font-semibold text-green-800">Manage Employees</h2>
            <p className="text-sm text-gray-600">Update employee status</p>
          </Link>

          <Link
            to="/admin/manage-loans"
            className="p-6 text-center transition bg-purple-100 shadow-md hover:bg-purple-200 rounded-xl"
          >
            <HandCoins size={40} className="mx-auto mb-2 text-purple-600" />
            <h2 className="text-lg font-semibold text-purple-800">Manage Loans</h2>
            <p className="text-sm text-gray-600">View and update loan status</p>
          </Link>

          <Link
            to="/admin/reports"
            className="p-6 text-center transition bg-yellow-100 shadow-md hover:bg-yellow-200 rounded-xl"
          >
            <BarChart2 size={40} className="mx-auto mb-2 text-yellow-600" />
            <h2 className="text-lg font-semibold text-yellow-800">View Reports</h2>
            <p className="text-sm text-gray-600">Monitor system activity</p>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
