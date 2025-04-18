import { ArrowLeft, Banknote, FileText, SendHorizontal } from "lucide-react";
import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import API from "../../api/axios";

const ApplyLoan = () => {
  const navigate = useNavigate();
  const [amount, setAmount] = useState("");
  const [purpose, setPurpose] = useState("");
  const [loanType, setLoanType] = useState("Personal");
  const [duration, setDuration] = useState("");
  const [employment, setEmployment] = useState("");
  const [income, setIncome] = useState("");

  const amountRef = useRef();
  const purposeRef = useRef();
  const durationRef = useRef();
  const employmentRef = useRef();
  const incomeRef = useRef();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!amount || !purpose || !duration || !employment || !income) return;
  
    try {
      await API.post("/customer/loan", {
        amount,
        purpose,
        loanType,
        durationMonths: duration,
        employment,
        income
      });
      toast.success("Loan application submitted successfully.");
      navigate("/customer/dashboard");
    } catch (err) {
      toast.error("Failed to apply loan: " + err.response?.data?. message);
    }
  };

  const handleGoBack = () => {
    navigate("/customer/dashboard");
  };

  return (
    <div className="flex items-center justify-center min-h-screen p-6 bg-gradient-to-br from-blue-50 to-white">
      <div className="w-full max-w-xl p-8 bg-white shadow-lg rounded-xl">
          <div className="flex items-center gap-4 pb-4 border-b">
          <button onClick={handleGoBack} className="text-blue-600 mt-[-60px] ml-[-20px]">
            <ArrowLeft size={24} />
          </button>
          <FileText size={28} className="text-blue-600" />
          <h2 className="text-2xl font-semibold text-gray-800"> Apply for a Loan</h2>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block mb-1 font-medium text-gray-700">Loan Amount (INR)</label>
            <input
              ref={amountRef}
              type="number"
              placeholder="Enter amount"
              min={0}
              className="w-full px-4 py-2 border rounded focus:outline-none"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
          </div>

          <div>
            <label className="block mb-1 font-medium text-gray-700">Purpose</label>
            <input
              ref={purposeRef}
              type="text"
              placeholder="e.g. Home renovation, medical..."
              className="w-full px-4 py-2 border rounded focus:outline-none"
              value={purpose}
              onChange={(e) => setPurpose(e.target.value)}
            />
          </div>

          <div>
            <label className="block mb-1 font-medium text-gray-700">Loan Type</label>
            <select
              className="w-full px-4 py-2 border rounded focus:outline-none"
              value={loanType}
              onChange={(e) => setLoanType(e.target.value)}
            >
              <option value="Personal">Personal</option>
              <option value="Home">Home</option>
              <option value="Education">Education</option>
              <option value="Vehicle">Vehicle</option>
              <option value="Business">Business</option>
            </select>
          </div>

          <div>
            <label className="block mb-1 font-medium text-gray-700">Loan Duration (Months)</label>
            <input
              ref={durationRef}
              type="number"
              placeholder="e.g. 12, 24, 36..."
              className="w-full px-4 py-2 border rounded focus:outline-none"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
            />
          </div>

          <div>
            <label className="block mb-1 font-medium text-gray-700">Employment Status</label>
            <input
              ref={employmentRef}
              type="text"
              placeholder="e.g. Salaried, Self-employed..."
              className="w-full px-4 py-2 border rounded focus:outline-none"
              value={employment}
              onChange={(e) => setEmployment(e.target.value)}
            />
          </div>

          <div>
            <label className="block mb-1 font-medium text-gray-700">Annual Income (INR)</label>
            <input
              ref={incomeRef}
              type="number"
              placeholder="e.g. 500000"
              className="w-full px-4 py-2 border rounded focus:outline-none"
              value={income}
              min={0}
              onChange={(e) => setIncome(e.target.value)}
            />
          </div>

          <button
            type="submit"
            className="w-full py-2 font-semibold text-white transition bg-blue-600 rounded hover:bg-blue-700"
          >
            Submit Application
          </button>
        </form>
      </div>
      <ToastContainer />
    </div>
  );
};

export default ApplyLoan;
