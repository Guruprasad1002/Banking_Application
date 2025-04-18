import { useEffect, useState } from "react";
import api from "../../api/axios";
import { ArrowLeft, Banknote } from "lucide-react";
import { useNavigate } from "react-router-dom";

const LoanHistory = () => {
  const [loans, setLoans] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchLoans = async () => {
      try {
        const res = await api.get("/customer/loans");
        setLoans(res.data.loans);
      } catch (err) {
        console.error("Error fetching loans:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchLoans();
  }, []);

  return (
    <div className="min-h-screen p-6 bg-gradient-to-br from-blue-50 to-white">
      <div className="max-w-4xl p-8 mx-auto bg-white shadow-lg rounded-xl">
        <div className="flex items-center gap-4 pb-4 mb-6 border-b">
          <button onClick={() => navigate("/customer/dashboard")} className="text-blue-600 mt-[-60px] ml-[-20px]">
            <ArrowLeft size={24} />
          </button>
          <Banknote size={30} className="text-blue-600" />
          <h2 className="text-2xl font-semibold text-gray-800">Loan History</h2>
        </div>

        {loading ? (
          <p className="text-center text-gray-500">Loading...</p>
        ) : loans.length === 0 ? (
          <p className="text-center text-gray-600">You haven't applied for any loans yet.</p>
        ) : (
          <ul className="space-y-4">
            {loans.map((loan) => (
              <li
                key={loan._id}
                className="p-4 transition border shadow-sm rounded-xl bg-blue-50 hover:bg-blue-100"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-gray-800">{loan.loanType} Loan</p>
                    <p className="text-sm text-gray-600">₹{loan.amount?.toLocaleString()} - {loan.purpose}</p>
                  </div>
                  <span
                    className={`px-3 py-1 text-sm rounded-full font-medium ${
                      loan.status === "Pending"
                        ? "bg-yellow-100 text-yellow-800"
                        : loan.status === "Approved"
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-600"
                    }`}
                  >
                    {loan.status}
                  </span>
                </div>
                <p className="mt-2 text-sm text-gray-500">
                  Duration: {loan.durationMonths} months • Income: ₹{loan.income?.toLocaleString()}
                </p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default LoanHistory;
