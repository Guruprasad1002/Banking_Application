import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Banknote, CheckCircle, Clipboard, X, ArrowLeft } from "lucide-react";
import API from "../../api/axios";

const AccountDetails = () => {
  const [account, setAccount] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAccount = async () => {
      try {
        const accRes = await API.get("/customer/account");
        setAccount(accRes.data.account);
      } catch (err) {
        console.error("Failed to load account:", err);
      }
    };

    const fetchTransactions = async () => {
      try {
        const txnRes = await API.get("/customer/transactions");
        setTransactions(txnRes.data.transactions.slice(0, 5));
      } catch (err) {
        console.error("Failed to load transactions:", err);
      }
    };

    fetchAccount();
    fetchTransactions();
  }, []);

  const handleGoBack = () => {
    navigate("/customer/dashboard");
  };

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

    if (!account) {
    return (
      <div className="min-h-screen p-6 bg-gradient-to-br from-blue-50 to-white">
        <div className="max-w-4xl p-8 mx-auto space-y-6 bg-white shadow-lg rounded-xl">
          <div className="flex items-center gap-4 pb-4 border-b">
            <button onClick={handleGoBack} className="text-blue-600 mt-[-60px] ml-[-20px]">
              <ArrowLeft size={24} />
            </button>
            <h2 className="text-xl font-semibold text-gray-800">Account verification under progress...</h2>
          </div>
          <p className="p-6 text-gray-700">Account details not available.</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen p-6 bg-gradient-to-br from-blue-50 to-white">
      <div className="max-w-4xl p-8 mx-auto space-y-6 bg-white shadow-lg rounded-xl">
        <div className="flex items-center gap-4 pb-4 border-b">
          <button onClick={handleGoBack} className="text-blue-600 mt-[-60px] ml-[-20px]">
            <ArrowLeft size={24} />
          </button>
          <Banknote size={30} className="text-blue-600" />
          <h2 className="text-2xl font-semibold text-gray-800">Account Details</h2>
        </div>

        <div className="space-y-4 text-gray-700">
          <div className="flex justify-between">
            <p><strong>Account Number:</strong> {account.accountNumber}</p>
            <p className="font-semibold">{account.type}</p>
          </div>
          <div className="flex justify-between">
            <p><strong>Branch:</strong> {account.branch}</p>
            <p className="flex items-center gap-1 text-green-600">
              <CheckCircle size={18} />
              {account.status}
            </p>
          </div>
          <div className="flex justify-between">
            <p><strong>Balance:</strong> ₹{account.balance?.toLocaleString()}</p>
            <p className="text-xl font-semibold text-blue-600">₹{account.balance}</p>
          </div>
        </div>

        <div className="pt-4 border-t">
          <h3 className="text-lg font-semibold text-gray-800">Recent Transaction</h3>
          {transactions.length > 0 ? (
            <div className="flex items-center justify-between mt-2">
              <p className="text-gray-600">{transactions[0].note || "Transaction"}</p>
              <span className="text-sm text-gray-500">
                {new Date(transactions[0].createdAt).toLocaleDateString()}
              </span>
            </div>
          ) : (
            <p className="mt-2 text-gray-500">No recent transactions</p>
          )}
        </div>

        <div className="pt-4 space-y-4 border-t">
          <h3 className="text-lg font-semibold text-gray-800">Account Actions</h3>
          <div
            className="flex items-center gap-3 p-4 transition cursor-pointer bg-blue-50 hover:bg-blue-100 rounded-xl"
            onClick={openModal}
          >
            <Clipboard size={22} className="text-blue-600" />
            <span>View Statements</span>
          </div>
        </div>

        <div className="pt-4 border-t">
          <h3 className="text-lg font-semibold text-gray-800">Account Information</h3>
          <div className="space-y-2">
            <p><strong>Account Type:</strong> {account.type}</p>
            <p><strong>Account Status:</strong> {account.status}</p>
            <p><strong>Branch:</strong> {account.branch}</p>
          </div>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
          <div className="p-6 bg-white rounded-xl w-96">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-semibold text-gray-800">Recent Transactions</h3>
              <button onClick={closeModal}>
                <X size={20} className="text-gray-600 hover:text-gray-800" />
              </button>
            </div>
            <ul className="mt-4 space-y-4">
              {transactions.map((txn, index) => (
                <li key={index} className="flex justify-between">
                  <div>
                    <p className="font-medium text-gray-800">{txn.note || "Transaction"}</p>
                    <p className="text-sm text-gray-500">{new Date(txn.createdAt).toLocaleDateString()}</p>
                  </div>
                  <span className={`font-semibold ${txn.amount < 0 ? "text-red-500" : "text-green-600"}`}>
                    ₹{txn.amount}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default AccountDetails;
