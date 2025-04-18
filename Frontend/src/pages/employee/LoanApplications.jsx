import { useEffect, useState } from "react";
import { CheckCircle, XCircle, ArrowLeft, Banknote } from "lucide-react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";

const LoanApplications = () => {
  const [loans, setLoans] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchLoans = async () => {
      try {
        const res = await api.get("/employee/loans");
        const pendingLoans = res.data.loans.filter(loan => loan.status === "Pending");
        setLoans(pendingLoans);      } catch (err) {
        console.error("Error fetching loans", err);
      }
    };

    fetchLoans();
  }, []);

  const handleAction = async (loanId, status) => {
    try {
      await api.put("/employee/loans/status", { loanId, status });
      setLoans(prev =>
        prev.map(loan => (loan._id === loanId ? { ...loan, status } : loan))
      );
    } catch (err) {
      console.error("Error updating loan status", err);
    }
  };

  const handleGoBack = () => {
    navigate("/employee/dashboard");
  };

  return (
    <div className="min-h-screen p-6 bg-gradient-to-br from-blue-50 to-white">
      <div className="max-w-6xl p-8 mx-auto bg-white shadow-xl rounded-3xl">
        <div className="flex items-center gap-4 pb-4 border-b">
          <button onClick={handleGoBack} className="text-blue-600 mt-[-60px] ml-[-20px]">
            <ArrowLeft size={24} />
          </button>
          <Banknote size={28} className="text-blue-600" />
          <h2 className="text-2xl font-semibold text-gray-800">Loan Applications</h2>
        </div>

        <div className="mt-6">
          {loans.length === 0 ? (
            <p className="text-gray-600">No loan applications found.</p>
          ) : (
            <ul className="space-y-4">
              {loans.map((loan) => (
                <li key={loan._id} className="p-4 bg-gray-100 shadow rounded-xl">
                  <div className="flex items-center justify-between">
                    <div>
                      <p><strong>Name:</strong> {loan.userId?.fullName || "N/A"}</p>
                      <p><strong>Email:</strong> {loan.userId?.email}</p>
                      <p><strong>Loan Type:</strong> {loan.loanType}</p>
                      <p><strong>Amount:</strong> ₹{loan.amount}</p>
                      <p><strong>Status:</strong> {loan.status}</p>
                    </div>
                    {loan.status === "Pending" && (
                      <div className="flex gap-3">
                        <button
                          onClick={() => handleAction(loan._id, "Approved")}
                          className="flex items-center px-4 py-2 text-white bg-green-600 rounded hover:bg-green-700"
                        >
                          <CheckCircle size={18} className="mr-1" /> Approve
                        </button>
                        <button
                          onClick={() => handleAction(loan._id, "Rejected")}
                          className="flex items-center px-4 py-2 text-white bg-red-500 rounded hover:bg-red-600"
                        >
                          <XCircle size={18} className="mr-1" /> Reject
                        </button>
                      </div>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default LoanApplications;
