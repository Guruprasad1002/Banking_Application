import { useEffect, useState } from "react";
import { ArrowLeft, CheckCircle, XCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AdminLoans = () => {
  const navigate = useNavigate();
  const [loans, setLoans] = useState([]);

  useEffect(() => {
    const fetchLoans = async () => {
      try {
        const res = await api.get("/admin/loans");
        setLoans(res.data.loans || []);
      } catch (err) {
        toast.error("Failed to fetch loans");
      }
    };

    fetchLoans();
  }, []);

  const updateStatus = async (loanId, status) => {
    try {
      await api.put("/admin/loans/status", { loanId, status });
      setLoans((prev) =>
        prev.map((loan) =>
          loan._id === loanId ? { ...loan, status } : loan
        )
      );
      toast.success(`Loan ${status}`);
    } catch (err) {
      toast.error("Failed to update loan status");
    }
  };

  const pendingLoans = loans.filter((loan) => loan.status === "Pending");
  const processedLoans = loans.filter((loan) => loan.status !== "Pending");

  return (
    <div className="max-w-5xl p-6 mx-auto">
      <button
        onClick={() => navigate("/admin/dashboard")}
        className="flex items-center gap-2 mb-6 text-blue-600"
      >
        <ArrowLeft /> Back to Dashboard
      </button>

      <h2 className="mb-6 text-3xl font-semibold text-gray-800">Loan Applications</h2>

      <section className="mb-8">
        <h3 className="mb-4 text-xl font-semibold text-gray-700">Pending Loans</h3>
        {pendingLoans.length === 0 ? (
          <p className="text-gray-500">No pending applications.</p>
        ) : (
          <ul className="space-y-4">
            {pendingLoans.map((loan) => (
              <li
                key={loan._id}
                className="flex items-center justify-between p-4 bg-white shadow rounded-xl"
              >
                <div>
                  <p><strong>User:</strong> {loan.userId?.name}</p>
                  <p><strong>Email:</strong> {loan.userId?.email}</p>
                  <p><strong>Loan Type:</strong> {loan.loanType}</p>
                  <p><strong>Amount:</strong> ₹{loan.amount}</p>
                  <p><strong>Status:</strong> {loan.status}</p>
                </div>
                <div className="flex gap-2">
                  <button
                    className="flex items-center px-3 py-2 text-white bg-green-600 rounded hover:bg-green-700"
                    onClick={() => updateStatus(loan._id, "Approved")}
                  >
                    <CheckCircle className="mr-1" size={18} /> Approve
                  </button>
                  <button
                    className="flex items-center px-3 py-2 text-white bg-red-600 rounded hover:bg-red-700"
                    onClick={() => updateStatus(loan._id, "Rejected")}
                  >
                    <XCircle className="mr-1" size={18} /> Reject
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section>
        <h3 className="mb-4 text-xl font-semibold text-gray-700">Processed Loans</h3>
        {processedLoans.length === 0 ? (
          <p className="text-gray-500">No approved or rejected loans.</p>
        ) : (
          <ul className="space-y-4">
            {processedLoans.map((loan) => (
              <li
                key={loan._id}
                className="flex justify-between p-4 border border-gray-200 bg-gray-50 rounded-xl"
              >
                <div>
                  <p><strong>User:</strong> {loan.userId?.name}</p>
                  <p><strong>Email:</strong> {loan.userId?.email}</p>
                  <p><strong>Loan Type:</strong> {loan.loanType}</p>
                  <p><strong>Amount:</strong> ₹{loan.amount}</p>
                  <p>
                    <strong>Status:</strong>{" "}
                    <span
                      className={`font-medium px-2 py-1 rounded ${
                        loan.status === "Approved"
                          ? "text-green-700 bg-green-100"
                          : "text-red-700 bg-red-100"
                      }`}
                    >
                      {loan.status}
                    </span>
                  </p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
      <ToastContainer />
    </div>
  );
};

export default AdminLoans;
