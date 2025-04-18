import { useEffect, useState } from "react";
import { ArrowLeft, BarChart3 } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "../../authContext";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import api from "../../api/axios";

const ViewReports = () => {
  const { user } = useAuth();
  const dashboardPath = `/${user?.role}/dashboard`;

  const [summary, setSummary] = useState({});
  const [transactionData, setTransactionData] = useState([]);

  const summaryItems = [
    { label: "Total Customers", value: summary.totalCustomers, color: "text-blue-600" },
    { label: "Total Employees", value: summary.totalEmployees, color: "text-green-600" },
    { label: "Total Transactions", value: summary.totalTransactions, color: "text-purple-600" },
    { label: "Loans Issued", value: summary.totalLoansIssued, color: "text-yellow-600" },
    { label: "Support Tickets", value: summary.supportTickets, color: "text-red-600" },
  ];

  const fetchSummary = async () => {
    try {
      const { data } = await api.get("/admin/reports");
      setSummary(data);
    } catch (err) {
      toast.error("Failed to load summary stats");
    }
  };

  const fetchTransactionData = async () => {
    try {
      const { data } = await api.get("/admin/reports/transactions?period=week");
      setTransactionData(data);
    } catch (err) {
      toast.error("Failed to load transaction data");
    }
  };

  useEffect(() => {
    fetchSummary();
    fetchTransactionData();
  }, []);

  return (
    <div className="max-w-6xl p-6 mx-auto">
      <Link to={dashboardPath} className="flex items-center mb-6 text-blue-600 hover:underline">
        <ArrowLeft className="mr-2" size={20} />
        Back to Dashboard
      </Link>

      <h2 className="flex items-center mb-6 text-2xl font-bold text-gray-800">
        <BarChart3 className="mr-2" size={26} />
        Banking Activity Summary
      </h2>

      <div className="grid grid-cols-1 gap-4 mb-8 sm:grid-cols-2 lg:grid-cols-3">
        {summaryItems.map((item, index) => (
          <div
            key={index}
            className="p-4 transition bg-white shadow-md rounded-xl hover:shadow-lg"
          >
            <p className="text-sm text-gray-500">{item.label}</p>
            <p className={`text-2xl font-bold ${item.color}`}>
              {item.value !== undefined ? item.value : "—"}
            </p>
          </div>
        ))}
      </div>

      <div className="p-6 bg-white shadow-md rounded-xl">
        <h3 className="mb-4 text-lg font-semibold text-gray-700">Transactions This Week</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={transactionData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="day" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="transactions" fill="#4f46e5" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <ToastContainer/>
    </div>
  );
};

export default ViewReports;
