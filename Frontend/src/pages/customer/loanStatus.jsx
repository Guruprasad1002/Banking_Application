import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Banknote } from "lucide-react";
import api from "../../api/axios";

const LoanStatus = () => {
  const navigate = useNavigate();
  const [loans, setLoans] = useState([]);
  const [loading, setLoading] = useState(true);
  const pendingLoans = loans.filter((loan) => loan.status === "Pending");

  const handleGoBack = () => {
    navigate("/customer/dashboard");
  };

  useEffect(() => {
    const fetchLoans = async () => {
      try {
        const res = await api.get("/customer/loans");
        setLoans(res.data.loans);
      } catch (error) {
        console.error("Failed to fetch loan history:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchLoans();
  }, []);

  return (
    <div className="min-h-screen p-6 bg-gradient-to-br from-blue-50 to-white">
      <div className="max-w-4xl p-8 mx-auto space-y-6 bg-white shadow-lg rounded-xl">
        <div className="flex items-center gap-4 pb-4 border-b">
          <button onClick={handleGoBack} className="text-blue-600 mt-[-60px] ml-[-20px]">
            <ArrowLeft size={24} />
          </button>
          <Banknote size={30} className="text-blue-600" />
          <h2 className="text-2xl font-semibold text-gray-800">Loan Status</h2>
        </div>

        {loading ? (
          <p>Loading...</p>
        ) : loans.length === 0 ? (
          <p className="text-gray-600">You haven’t applied for any loans yet.</p>
        ) : pendingLoans.length === 0 ? (
          <p className="text-gray-600">No pending loans found.</p>
        ) : (
          <ul className="space-y-4">
            {pendingLoans.map((loan) => (
              <li key={loan._id} className="p-4 border shadow rounded-xl bg-gray-50">
                <div className="flex justify-between">
                  <p className="text-lg font-semibold text-gray-800">₹{loan.amount}</p>
                  <span
                    className={`px-2 py-1 text-sm rounded font-medium ${loan.status === "Approved"
                        ? "bg-green-100 text-green-600"
                        : loan.status === "Rejected"
                          ? "bg-red-100 text-red-600"
                          : "bg-yellow-100 text-yellow-600"
                      }`}
                  >
                    {loan.status}
                  </span>
                </div>
                <p className="mt-1 text-sm text-gray-600">Type: {loan.loanType}</p>
                <p className="text-sm text-gray-600">Duration: {loan.durationMonths} months</p>
                <p className="text-sm text-gray-600">Purpose: {loan.purpose}</p>
                <p className="mt-1 text-xs text-gray-400">
                  Applied on: {new Date(loan.createdAt).toLocaleDateString()}
                </p>
              </li>
            ))}
          </ul>
        )}

      </div>
    </div>
  );
};

export default LoanStatus;
