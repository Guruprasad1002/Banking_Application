import { Route, Routes, useLocation } from "react-router-dom";
import { useAuth } from "./authContext";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import RoleBasedDashboard from "./components/RoleBasedDashboard";
import AccountDetails from "./pages/customer/AccountDetails";
import Transactions from "./pages/customer/Transactions";
import TransferFunds from "./pages/customer/TransferFunds";
import ApplyLoan from "./pages/customer/ApplyLoans";
import ManageAccounts from "./pages/employee/ManageAccounts";
import VerifyTransactions from "./pages/employee/VerifyTransactions";
import ManageUsers from "./pages/admin/ManageUsers";
import ManageEmployees from "./pages/admin/ManageEmployees";
import ViewReports from "./pages/admin/ViewReports";
import Settings from "./pages/Settings";
import Support from "./pages/Support";
import './App.css'
import OtpPage from "./pages/OtpPage";
import CardServices from "./pages/customer/CardServices.jsx";
import LoanHistory from "./pages/customer/loanHistory.jsx";
import LoanStatus from "./pages/customer/loanStatus.jsx";
import VerifyAccounts from "./pages/employee/VerifyAccounts.jsx";
import LoanApplications from "./pages/employee/LoanApplications.jsx";
import LoanHistories from "./pages/employee/LoanHistory.jsx";
import EmployeeSupport from "./pages/employee/EmployeeSupport.jsx";
import CustomerSupport from "./pages/customer/CustomerSupport.jsx";
import AddBalance from "./pages/employee/AddBalance.jsx";
import AddEmployee from "./pages/admin/AddEmployee.jsx";
import ManageLoans from "./pages/admin/ManageLoans.jsx";
import AdminLoans from "./pages/admin/AdminLoans.jsx";
function App() {
  const location = useLocation();
  const { user } = useAuth();
  const isRegisterPage = location.pathname === "/";

  return (
    <>
      {user && !isRegisterPage && !/^\/(login|register|otp)$/.test(location.pathname) && <Navbar />}
      <Routes>
        <Route path="/" element={<Register />} />
        <Route path="/otp" element={<OtpPage />} />
        <Route path="/login" element={<Login />} />
        <Route
          path="/:role/dashboard"
          element={
            <ProtectedRoute allowedRoles={["admin", "employee", "customer"]}>
              <RoleBasedDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/customer/account"
          element={
            <ProtectedRoute allowedRoles={["customer"]}>
              <AccountDetails />
            </ProtectedRoute>
          }
        />
        <Route
          path="/customer/transactions"
          element={
            <ProtectedRoute allowedRoles={["customer"]}>
              <Transactions />
            </ProtectedRoute>
          }
        />
        <Route
          path="/customer/transfer"
          element={
            <ProtectedRoute allowedRoles={["customer"]}>
              <TransferFunds />
            </ProtectedRoute>
          }
        />
        <Route
          path="/customer/loan"
          element={
            <ProtectedRoute allowedRoles={["customer"]}>
              <ApplyLoan />
            </ProtectedRoute>
          }
        />

        <Route
          path="/customer/loan-history"
          element={
            <ProtectedRoute allowedRoles={["customer"]}>
              <LoanHistory />
            </ProtectedRoute>
          }
        />

        <Route
          path="/customer/loan-status"
          element={
            <ProtectedRoute allowedRoles={["customer"]}>
              <LoanStatus />
            </ProtectedRoute>
          }
        />


        <Route path="/customer/card-services"
          element={
            <ProtectedRoute allowedRoles={["customer"]}>
              <CardServices />
            </ProtectedRoute>
          }
        />

        <Route
          path="/customer/support"
          element={
            <ProtectedRoute allowedRoles={["customer"]}>
              <CustomerSupport />
            </ProtectedRoute>
          }
        />

        <Route
          path="/employee/accounts"
          element={
            <ProtectedRoute allowedRoles={["employee"]}>
              <ManageAccounts />
            </ProtectedRoute>
          }
        />
        <Route
          path="/employee/verify-accounts"
          element={
            <ProtectedRoute allowedRoles={["employee"]}>
              <VerifyAccounts />
            </ProtectedRoute>
          }
        />
        <Route
          path="/employee/add-balance"
          element={
            <ProtectedRoute allowedRoles={["employee"]}>
              <AddBalance />
            </ProtectedRoute>
          }
        />
        <Route
          path="/employee/transactions"
          element={
            <ProtectedRoute allowedRoles={["employee"]}>
              <VerifyTransactions />
            </ProtectedRoute>
          }
        />
        <Route
          path="/employee/loan-applications"
          element={
            <ProtectedRoute allowedRoles={["employee"]}>
              <LoanApplications />
            </ProtectedRoute>
          }
        />
        <Route
          path="/employee/loan-history"
          element={
            <ProtectedRoute allowedRoles={["employee"]}>
              <LoanHistories />
            </ProtectedRoute>
          }
        />
        <Route
          path="/employee/support"
          element={
            <ProtectedRoute allowedRoles={["employee"]}>
              <EmployeeSupport />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/users"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <ManageUsers />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/employees"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <ManageEmployees />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/add-employees"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AddEmployee />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/manage-loans"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AdminLoans />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/reports"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <ViewReports />
            </ProtectedRoute>
          }
        />
      </Routes>
    </>

  );
}

export default App;
