import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../authContext";
import { User, CreditCard, HelpCircle, Banknote } from "lucide-react";
import api from "../../api/axios";

const EmployeeDashboard = () => {
  const { user } = useAuth();

  const [accounts, setAccounts] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [supportRequests, setSupportRequests] = useState([]);

  useEffect(() => {
    api.get("/employee/accounts").then(res => setAccounts(res.data)).catch(console.error);
    api.get("/employee/transactions").then(res => setTransactions(res.data)).catch(console.error);
    api.get("/employee/support").then(res => setSupportRequests(res.data)).catch(console.error);
  }, []);

  const dashboardItems = [
    {
      to: "/employee/accounts",
      icon: <User size={32} className="text-blue-600" />,
      label: "Manage Customer Accounts",
      description: "View and manage customer accounts",
      count: accounts.length,
      bg: "bg-blue-100",
      hover: "hover:bg-blue-200",
      text: "text-blue-800"
    },
    {
      to: "/employee/verify-accounts",
      icon: <User size={32} className="text-green-600" />,
      label: "Verify New Accounts",
      description: "Review and approve new customers",
      bg: "bg-green-100",
      hover: "hover:bg-green-200",
      text: "text-green-800"
    },
    {
      to: "/employee/add-balance",
      icon: <User size={32} className="text-orange-600" />,
      label: "Add Balance",
      description: "Deposit funds into accounts",
      bg: "bg-orange-100",
      hover: "hover:bg-orange-200",
      text: "text-orange-800"
    },
    {
      to: "/employee/transactions",
      icon: <CreditCard size={32} className="text-purple-600" />,
      label: "Verify Transactions",
      description: "Review pending transactions",
      count: transactions.length,
      bg: "bg-purple-100",
      hover: "hover:bg-purple-200",
      text: "text-purple-800"
    },
    {
      to: "/employee/loan-applications",
      icon: <CreditCard size={32} className="text-yellow-600" />,
      label: "Loan Applications",
      description: "Approve or reject loan requests",
      bg: "bg-yellow-100",
      hover: "hover:bg-yellow-200",
      text: "text-yellow-800"
    },
    {
      to: "/employee/loan-history",
      icon: <Banknote size={32} className="text-pink-600" />,
      label: "Loan History",
      description: "View past loan activities",
      bg: "bg-pink-100",
      hover: "hover:bg-pink-200",
      text: "text-pink-800"
    },
    {
      to: "/employee/support",
      icon: <HelpCircle size={32} className="text-red-600" />,
      label: "Support Requests",
      description: "Manage customer issues",
      count: supportRequests.length,
      bg: "bg-red-100",
      hover: "hover:bg-red-200",
      text: "text-red-800"
    },
  ];

  return (
    <div className="min-h-screen p-6 bg-gray-100">
      <div className="max-w-5xl mx-auto">
        <h1 className="mb-2 text-3xl font-bold text-center text-gray-800">
          Welcome Back
        </h1>
        <p className="mb-6 text-xl font-medium text-center text-blue-600">
          {user?.name}
        </p>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {dashboardItems.map(({ to, icon, label, description, count, bg, hover, text }, idx) => (
            <Link
              key={idx}
              to={to}
              className={`p-6 text-center transition shadow-md rounded-xl ${bg} ${hover} flex flex-col items-center`}
            >
              <div className="mb-3">{icon}</div>
              <h2 className={`text-lg font-semibold ${text}`}>{label}</h2>
              <p className="mt-1 text-sm text-gray-600">{description}</p>
              {typeof count === "number" && (
                <p className="mt-2 text-sm font-medium text-gray-700">
                  Total: <span className="font-bold">{count}</span>
                </p>
              )}
            </Link>
          ))}
        </div>

      </div>
    </div>
  );
};

export default EmployeeDashboard;
