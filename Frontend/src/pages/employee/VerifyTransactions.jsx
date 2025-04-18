import { useState, useEffect } from "react";
import { CheckCircle, XCircle, Clock, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";
const VerifyTransactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [toast, setToast] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const res = await api.get("/employee/transactions");
        setTransactions(res.data.transactions || []);
      } catch (err) {
        console.error("Error fetching transactions", err);
      }
    };
    fetchTransactions();
  }, []);

  useEffect(() => {
    if (toast) {
      const timeout = setTimeout(() => setToast(null), 3000);
      return () => clearTimeout(timeout);
    }
  }, [toast]);  

  const handleVerify = async (id, newStatus) => {
    try {
      const res = await api.put("/employee/transactions/verify", { transactionId: id, status: newStatus });

      if (res.data.success) {
        setTransactions(prev =>
          prev.map((t) => (t._id === id ? { ...t, status: newStatus } : t))
        );
        setToast(`Transaction ${newStatus}`);
      } else {
        setToast(res.data.message || "Failed to verify transaction");
      }
    } catch (err) {
      console.error("Error verifying transaction", err);
      const errorMsg = err.response?.data?.message || "Failed to verify transaction";
      setToast(errorMsg);
    }

  };

  const getStatusBadge = (status) => {
    const badgeStyles = {
      Pending: "bg-yellow-100 text-yellow-800",
      Approved: "bg-green-100 text-green-800",
      Rejected: "bg-red-100 text-red-800",
    };

    const icons = {
      Pending: <Clock size={16} className="inline mr-1" />,
      Approved: <CheckCircle size={16} className="inline mr-1" />,
      Rejected: <XCircle size={16} className="inline mr-1" />,
    };

    return (
      <span className={`inline-flex items-center px-2 py-1 text-sm font-semibold rounded ${badgeStyles[status]}`}>
        {icons[status]} {status}
      </span>
    );
  };

  const handleBack = () => {
    navigate("/employee/dashboard");
  };

  return (
    <div className="flex justify-center p-6 bg-gray-100">
      <div className="w-full max-w-5xl p-6 bg-white shadow-xl rounded-xl">
        <div className="relative mb-4">
          <button onClick={handleBack} className="absolute flex items-center gap-1 font-medium text-blue-600 text-md">
            <ArrowLeft size={20} />
          </button>
          <div className="flex items-center justify-center gap-2">
            <h2 className="text-3xl font-bold text-gray-800">Verify Transactions</h2>
          </div>
        </div>

        {toast && (
          <div className={`p-3 mb-4 font-medium text-center rounded shadow
            ${toast?.startsWith("Failed") || toast?.startsWith("Insufficient") ? "text-red-800 bg-red-100" : "text-green-800 bg-green-100"}
          `}>
            {toast?.startsWith("Failed") ? "❌" : "✅"} {toast}
          </div>
        )}

        {transactions.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-center border rounded-lg">
              <thead className="text-xs text-gray-700 uppercase bg-gray-100">
                <tr>
                  <th className="px-6 py-4">ID</th>
                  <th className="px-6 py-4">From</th>
                  <th className="px-6 py-4">To</th>
                  <th className="px-6 py-4">Amount</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((t) => (
                  <tr key={t._id}>
                    <td className="px-6 py-4">#{t._id}</td>
                    <td className="px-6 py-4">{t.fromUser.name}</td>
                    <td className="px-6 py-4">{t.toUser.name}</td>
                    <td className="px-6 py-4">{t.amount}</td>
                    <td className="px-6 py-4">{getStatusBadge(t.status)}</td>
                    <td className="px-6 py-4 space-x-2">
                      <button
                        onClick={() => handleVerify(t._id, "Approved")}
                        className="px-3 py-1 text-white bg-green-500 rounded hover:bg-green-600"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => handleVerify(t._id, "Rejected")}
                        className="px-3 py-1 text-white bg-red-500 rounded hover:bg-red-600"
                      >
                        Reject
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="py-12 text-lg font-medium text-center text-gray-600">
            No pending transactions found.
          </div>
        )}
      </div>
    </div>
  );
};

export default VerifyTransactions;
