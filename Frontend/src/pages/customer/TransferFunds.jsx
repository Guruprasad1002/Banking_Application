import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, SendHorizontal, IndianRupee, Loader2 } from "lucide-react";
import { toast, ToastContainer } from "react-toastify";
import API from "../../api/axios";
import 'react-toastify/dist/ReactToastify.css';

const TransferFunds = () => {
  const navigate = useNavigate();
  const [recipientEmail, setRecipientEmail] = useState("");
  const [recipientInfo, setRecipientInfo] = useState(null);
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLookup = async () => {
    if (!recipientEmail) return;

    setLoading(true);
    setRecipientInfo(null);
    setErrorMessage("");

    try {
      const res = await API.get(`/customer/lookup?email=${recipientEmail}`);
      setRecipientInfo(res.data);
      toast.success("Account found!");
    } catch (err) {
      setErrorMessage("Account not found");
      toast.error("User not found: " + (err.response?.data?.message || "Lookup failed."));
    } finally {
      setLoading(false);
    }
  };

  const handleTransfer = async (e) => {
    e.preventDefault();

    const numericAmount = parseFloat(amount);
    if (!recipientInfo || !numericAmount || numericAmount <= 0) {
      return toast.error("Please enter valid details.");
    }

    try {
      await API.post("/customer/transfer", {
        toUserId: recipientInfo.userId,
        amount: numericAmount,
        note,
      });
      toast.success("Transfer initiated successfully.");
      navigate("/customer/transactions");
    } catch (err) {
      toast.error("Transfer failed: " + (err.response?.data?.message || "Server error"));
    }
  };

  const handleGoBack = () => navigate("/customer/dashboard");

  return (
    <div className="min-h-screen p-6 bg-gradient-to-br from-blue-50 to-white">
      <div className="max-w-xl p-8 mx-auto space-y-6 bg-white shadow-md rounded-xl">
        <div className="flex items-center gap-4 pb-4 border-b">
          <button onClick={handleGoBack} className="text-blue-600 mt-[-60px] ml-[-20px]">
            <ArrowLeft size={24} />
          </button>
          <SendHorizontal size={28} className="text-blue-600" />
          <h2 className="text-2xl font-semibold text-gray-800">Transfer Funds</h2>
        </div>

        <div>
          <label className="block mb-1 font-medium text-gray-700">Recipient Email</label>
          <div className="flex gap-2">
            <input
              type="email"
              placeholder="Enter email"
              className="w-full px-4 py-2 border rounded focus:outline-none"
              value={recipientEmail}
              onChange={(e) => {
                setRecipientEmail(e.target.value);
                setRecipientInfo(null);
                setErrorMessage("");
              }}
            />
            <button
              type="button"
              onClick={handleLookup}
              className="flex items-center gap-2 px-4 py-2 text-white bg-blue-600 rounded hover:bg-blue-700"
            >
              {loading ? <Loader2 size={18} className="animate-spin" /> : "Lookup"}
            </button>
          </div>
          {errorMessage && <p className="mt-2 text-red-600">{errorMessage}</p>}
        </div>

        {recipientInfo && (
          <div className="p-4 text-blue-800 border border-blue-300 rounded bg-blue-50">
            <p><strong>Name:</strong> {recipientInfo.name}</p>
            <p><strong>Account No:</strong> {recipientInfo.accountNumber}</p>
            <p><strong>Branch:</strong> {recipientInfo.branch}</p>
          </div>
        )}

        <div>
          <label className="block mb-1 font-medium text-gray-700">Amount (INR)</label>
          <div className="flex items-center px-3 border rounded">
            <IndianRupee className="mr-2 text-gray-500" />
            <input
              type="number"
              min="1"
              step="0.01"
              placeholder="Enter amount"
              className="w-full py-2 focus:outline-none"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
          </div>
        </div>

        <div>
          <label className="block mb-1 font-medium text-gray-700">Transfer Note (Optional)</label>
          <textarea
            placeholder="e.g. Rent, bill payment..."
            className="w-full px-3 py-2 border rounded focus:outline-none"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            rows={3}
          />
        </div>

        <button
          type="submit"
          disabled={!recipientInfo || !amount}
          onClick={handleTransfer}
          className={`w-full py-2 font-semibold text-white rounded ${!recipientInfo || !amount
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-green-600 hover:bg-green-700"
            }`}
        >
          Transfer Now
        </button>
      </div>
      <ToastContainer />
    </div>
  );
};

export default TransferFunds;
