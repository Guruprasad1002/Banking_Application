import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, CreditCard, ArrowUpCircle, ArrowDownCircle, Wallet } from "lucide-react";
import API from "../../api/axios";

const Transactions = () => {
  const navigate = useNavigate();
  const [transactions, setTransactions] = useState([]);
  const [balance, setBalance] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const accountRes = await API.get("/customer/account");
        setBalance(accountRes.data.account.balance);

        const txnRes = await API.get("/customer/transactions");
        setTransactions(txnRes.data.transactions);
      } catch (err) {
        console.error("Failed to fetch transactions:", err);
      }
    };

    fetchData();
  }, []);

  const handleGoBack = () => {
    navigate("/customer/dashboard");
  };

  return (
    <div className="min-h-screen p-6 bg-gradient-to-br from-blue-50 to-white">
      <div className="max-w-4xl p-8 mx-auto space-y-6 bg-white shadow-lg rounded-xl">
        <div className="flex items-center gap-4 pb-4 border-b">
          <button onClick={handleGoBack} className="text-blue-600 mt-[-60px] ml-[-20px]">
            <ArrowLeft size={24} />
          </button>
          <CreditCard size={30} className="text-blue-600" />
          <h2 className="text-2xl font-semibold text-gray-800">Transaction History</h2>
        </div>

        <div className="flex items-center justify-between p-4 bg-blue-100 shadow rounded-xl">
          <div>
            <p className="text-sm text-gray-600">Current Balance</p>
            <h3 className="text-2xl font-bold text-gray-800">₹{balance?.toLocaleString()}</h3>
          </div>
          <Wallet className="w-8 h-8 text-blue-600" />
        </div>

        {transactions.length === 0 ? (
          <p className="mt-4 text-gray-600">No transactions found.</p>
        ) : (
          <ul className="space-y-4 divide-y">
            {transactions.map((txn) => (
              <li key={txn._id} className="flex items-center justify-between pt-4">
                <div className="flex flex-col">
                  <p className="font-medium text-gray-800">{txn.note || "Transaction"}</p>
                  <p className="text-sm text-gray-500">{new Date(txn.createdAt).toLocaleDateString()}</p>
                </div>
                <div className="flex items-center">
                  <span
                    className={`font-semibold text-lg ${
                      txn.fromUser === txn.toUser || txn.amount < 0
                        ? "text-red-500"
                        : "text-green-600"
                    }`}
                  >
                    ₹{txn.amount.toLocaleString()}
                  </span>
                  {txn.fromUser === txn.toUser || txn.amount < 0 ? (
                    <ArrowDownCircle className="ml-2 text-red-500" size={22} />
                  ) : (
                    <ArrowUpCircle className="ml-2 text-green-600" size={22} />
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Transactions;
