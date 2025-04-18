import { useEffect, useState } from "react";
import { CheckCircle, XCircle, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";

const VerifyAccounts = () => {
  const [accounts, setAccounts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        const res = await api.get("/employee/accounts");
        const inactiveAccounts = res.data.customers.filter(acc => acc.status === "Inactive");
        setAccounts(inactiveAccounts);
      } catch (err) {
        console.error("Failed to load accounts:", err);
      }
    };

    fetchAccounts();
  }, []);

  const handleAction = async (userId, action) => {
    try {
      await api.put("/employee/accounts/verify", { userId, action });
      setAccounts(prev => prev.filter(acc => acc.id !== userId));
    } catch (err) {
      console.error("Error verifying account:", err.response?.data || err.message);
      alert(err.response?.data?.message || "Failed to verify account.");
    }
  };  

  const handleGoBack = () => {
    navigate("/employee/dashboard");
  };

  return (
    <div className="min-h-screen p-6 bg-gradient-to-br from-blue-50 to-white">
      <div className="max-w-5xl p-8 mx-auto bg-white shadow-xl rounded-3xl">
        <div className="flex items-center gap-4 pb-4 border-b">
          <button onClick={handleGoBack} className="text-blue-600 mt-[-60px] ml-[-20px]">
            <ArrowLeft size={24} />
          </button>
          <h2 className="text-3xl font-semibold text-gray-800">Verify New Customer Accounts</h2>
        </div>

        {accounts.length === 0 ? (
          <p className="mt-6 text-gray-600">No pending accounts to verify.</p>
        ) : (
          <ul className="mt-6 space-y-4">
            {accounts.map(account => (
              <li key={account.id} className="flex items-center justify-between p-4 bg-gray-100 shadow rounded-xl">
                <div>
                  <p className="font-medium text-gray-800">{account.name}</p>
                  <p className="text-sm text-gray-500">{account.email}</p>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => handleAction(account.id, "accept")}
                    className="flex items-center px-4 py-2 text-white bg-green-600 rounded hover:bg-green-700"
                  >
                    <CheckCircle size={18} className="mr-1" />
                    Accept
                  </button>
                  <button
                    onClick={() => handleAction(account.id, "reject")}
                    className="flex items-center px-4 py-2 text-white bg-red-500 rounded hover:bg-red-600"
                  >
                    <XCircle size={18} className="mr-1" />
                    Reject
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default VerifyAccounts;
