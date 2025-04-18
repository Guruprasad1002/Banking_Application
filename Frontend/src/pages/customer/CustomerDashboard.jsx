import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../authContext";
import api from "../../api/axios";
import {
  UserCircle,
  Banknote,
  History,
  Send,
  HelpCircle,
  Home,
  Wallet,
  LogOut,
  EyeOff,
  Eye,
  CreditCard,
  TrendingUp,
  HandCoins,
} from "lucide-react";
import { useState, useEffect } from "react";

const CustomerDashboard = () => {
  const { user, logout } = useAuth();
  const [account, setAccount] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showBalance, setShowBalance] = useState(true);
  const [accountStatusMessage, setAccountStatusMessage] = useState("");
  const navigate = useNavigate();
  const linksDisabled = !account;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const accRes = await api.get("/customer/account");
        setAccount(accRes.data.account);

        if (accRes.data.account.status === "Inactive") {
          setAccountStatusMessage("Your account is under verification.");
        } else if (accRes.data.account.status === "Active") {
          setAccountStatusMessage("");
        }

        const txnRes = await api.get("/customer/transactions");
        setTransactions(txnRes.data.transactions.slice(0, 3));
      } catch (err) {
        console.error("Error loading dashboard:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="min-h-screen p-6 bg-gradient-to-r from-indigo-500 via-purple-600 to-pink-500">
      <div className="max-w-6xl mx-auto overflow-hidden bg-white shadow-xl rounded-3xl">
        <div className="md:flex">
          <div className="p-6 text-white bg-blue-600 md:w-64">
            <div className="flex items-center gap-4 mb-8">
              <UserCircle className="w-12 h-12" />
              <div>
                <h1 className="text-xl font-bold">Welcome back!</h1>
                <p className="text-sm opacity-80">{user.name || user.email}</p>
              </div>
            </div>
            <nav className="space-y-4 font-semibold text-md ">
              <Link to="/customer/account" className={`flex items-center gap-3 p-2 transition rounded ${linksDisabled ? "pointer-events-none text-white/40" : "hover:bg-blue-700"}`}>
                <Home size={20} />
                Account Details
              </Link>
              <Link to="/customer/transactions" className={`flex items-center gap-3 p-2 transition rounded ${linksDisabled ? "pointer-events-none text-white/40" : "hover:bg-blue-700"}`}>
                <History size={20} />
                Transactions
              </Link>
              <Link to="/customer/transfer" className={`flex items-center gap-3 p-2 transition rounded ${linksDisabled ? "pointer-events-none text-white/40" : "hover:bg-blue-700"}`}>
                <Send size={20} />
                Transfer Funds
              </Link>
              <Link to="/customer/loan" className={`flex items-center gap-3 p-2 transition rounded ${linksDisabled ? "pointer-events-none text-white/40" : "hover:bg-blue-700"}`}>
                <Banknote size={20} />
                Apply for Loan
              </Link>
              <Link to="/customer/loan-status" className={`flex items-center gap-3 p-2 transition rounded ${linksDisabled ? "pointer-events-none text-white/40" : "hover:bg-blue-700"}`}>
                <TrendingUp size={20} />
                Loan Status
              </Link>
              <Link to="/customer/loan-history" className={`flex items-center gap-3 p-2 transition rounded ${linksDisabled ? "pointer-events-none text-white/40" : "hover:bg-blue-700"}`}>
                <HandCoins size={20} />
                Loan History
              </Link>
            </nav>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 mt-8 font-bold cursor-pointer text-md opacity-80 hover:opacity-100">
              <LogOut size={18} />
              Logout
            </button>
          </div>

          <div className="flex-1 p-8">
            {!account && (
              <div className="p-6 mb-8 text-yellow-800 bg-yellow-100 rounded-2xl">
                <h2 className="text-xl font-semibold">Account verification under progress</h2>
                <p>Please try again later.</p>
              </div>
            )}

            {account && (
              <div className="p-6 mb-8 text-white shadow-lg bg-gradient-to-r from-blue-500 to-blue-400 rounded-2xl">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-2xl font-semibold">Total Balance</h2>
                  <button onClick={() => setShowBalance((prev) => !prev)} className="focus:outline-none">
                    {showBalance ? <EyeOff size={24} /> : <Eye size={24} />}
                  </button>
                </div>
                <div className="flex items-center gap-4">
                  <Wallet size={32} />
                  <h2 className="text-4xl font-bold">
                    {showBalance ? `₹${account?.balance?.toLocaleString() || 0}` : "••••••"}
                  </h2>
                </div>
              </div>
            )}

            {account && account.status === "Under Verification" && (
              <div className="p-6 mb-8 text-yellow-800 bg-yellow-100 rounded-2xl">
                <h2 className="text-xl font-semibold">Account Under Verification</h2>
                <p>{accountStatusMessage}</p>
              </div>
            )}

            <h2 className="mb-4 text-2xl font-semibold text-gray-800">Quick Actions</h2>
            <div className="grid grid-cols-2 gap-4 mb-8">
              <Link to="/customer/card-services"
                className={linksDisabled ? "pointer-events-none opacity-40" : ""}>
                <div className="flex items-center gap-4 p-4 bg-green-100 rounded-xl">
                  <div className="p-3 bg-green-200 rounded-full">
                    <CreditCard className="text-green-600" size={24} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-green-800">Card Services</h3>
                    <p className="text-sm text-green-600">Manage your cards</p>
                  </div>
                </div>
              </Link>
            </div>

            <h2 className="mb-4 text-2xl font-semibold text-gray-800">Recent Transactions</h2>
            <ul className="divide-y divide-gray-200 shadow bg-gray-50 rounded-xl">
              {transactions.map((txn, index) => (
                <li key={index} className="flex justify-between p-4">
                  <div>
                    <p className="font-medium text-gray-800">{txn.note || "Transaction"}</p>
                    <p className="text-sm text-gray-500">{new Date(txn.createdAt).toLocaleDateString()}</p>
                  </div>
                  <span className={`font-semibold ${txn.status === "Rejected" || txn.amount < 0 ? "text-red-500" : "text-green-600"}`}>
                    ₹{txn.amount}
                  </span>
                </li>
              ))}
            </ul>

            <div className="mt-8 text-center">
              <Link to="/customer/support" className="inline-flex items-center gap-2 text-blue-600 hover:underline">
                <HelpCircle size={18} />
                Need help? Contact Support
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerDashboard;
