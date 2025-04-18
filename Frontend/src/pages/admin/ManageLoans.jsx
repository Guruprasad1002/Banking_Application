import { useEffect, useState } from "react";
import axios from "axios";
import { HandCoins } from "lucide-react";
import api from "../../api/axios";

const ManageLoans = () => {
  const [loans, setLoans] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchLoans = async () => {
    try {
      const res = await axios.get("/api/admin/loans");
      setLoans(res.data?.loans||[]);
      console.log(res.data);
      
    } catch (err) {
      console.error("Error fetching loans:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (loanId, newStatus) => {
    try {
      await axios.put("/api/admin/loans/status", { loanId, status: newStatus });
      fetchLoans();
    } catch (err) {
      console.error("Failed to update loan status:", err);
    }
  };

  useEffect(() => {
    fetchLoans();
  }, []);

  return (
    <div className="min-h-screen p-6 bg-gray-100">
      <div className="max-w-6xl mx-auto">
        <h1 className="flex items-center gap-2 mb-6 text-3xl font-bold">
          <HandCoins size={30} className="text-purple-600" />
          Loan Applications
        </h1>

        {loading ? (
          <p>Loading...</p>
        ) : (
          <div className="p-4 overflow-x-auto bg-white shadow-md rounded-xl">
            <table className="min-w-full table-auto">
              <thead>
                <tr className="text-left bg-gray-200">
                  <th className="p-2">Name</th>
                  <th className="p-2">Email</th>
                  <th className="p-2">Amount</th>
                  <th className="p-2">Type</th>
                  <th className="p-2">Status</th>
                  <th className="p-2">Action</th>
                </tr>
              </thead>
              <tbody>
                {loans.map((loan) => (
                  <tr key={loan._id} className="border-t hover:bg-gray-50">
                    <td className="p-2">{loan.userId?.name}</td>
                    <td className="p-2">{loan.userId?.email}</td>
                    <td className="p-2">${loan.amount}</td>
                    <td className="p-2">{loan.loanType}</td>
                    <td className="p-2">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-semibold ${
                          loan.status === "Approved"
                            ? "bg-green-100 text-green-700"
                            : loan.status === "Rejected"
                            ? "bg-red-100 text-red-700"
                            : "bg-yellow-100 text-yellow-700"
                        }`}
                      >
                        {loan.status}
                      </span>
                    </td>
                    <td className="p-2">
                      <select
                        className="px-2 py-1 border rounded"
                        value={loan.status}
                        onChange={(e) => handleStatusChange(loan._id, e.target.value)}
                      >
                        <option value="Pending">Pending</option>
                        <option value="Approved">Approve</option>
                        <option value="Rejected">Reject</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {loans.length === 0 && (
              <p className="mt-4 text-center text-gray-600">No loan applications found.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageLoans;
