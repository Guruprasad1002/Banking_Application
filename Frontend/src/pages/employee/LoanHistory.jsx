import { useEffect, useState } from "react";
import { ArrowLeft, Banknote, CheckCircle, XCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { utils, writeFile } from "xlsx";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import api from "../../api/axios";

const LoanHistory = () => {
  const [history, setHistory] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchLoanHistory = async () => {
      try {
        const res = await api.get("/employee/loans");
        const approvedOrRejected = res.data.loans.filter(
          (loan) => loan.status !== "Pending"
        );
        setHistory(approvedOrRejected);
      } catch (err) {
        console.error("Error fetching loan history", err);
      }
    };

    fetchLoanHistory();
  }, []);

  const getBadge = (status) => {
    const style =
      status === "Approved"
        ? "bg-green-100 text-green-700"
        : "bg-red-100 text-red-700";
    const icon =
      status === "Approved" ? (
        <CheckCircle size={16} className="mr-1" />
      ) : (
        <XCircle size={16} className="mr-1" />
      );

    return (
      <span
        className={`inline-flex items-center px-2 py-1 text-sm font-semibold rounded ${style}`}
      >
        {icon}
        {status}
      </span>
    );
  };

  const exportToExcel = () => {
    const formatted = history.map((loan) => ({
      Name: loan.userId?.fullName || "N/A",
      Email: loan.userId?.email,
      Amount: loan.amount,
      Type: loan.loanType,
      Status: loan.status,
    }));
  
    const worksheet = utils.json_to_sheet(formatted);
    const workbook = utils.book_new();
    utils.book_append_sheet(workbook, worksheet, "LoanHistory");
  
    writeFile(workbook, "Loan_History.xlsx");
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.text("Loan History Report", 14, 15);
  
    const rows = history.map((loan) => [
      loan.userId?.fullName || "N/A",
      loan.userId?.email,
      `₹${loan.amount}`,
      loan.loanType,
      loan.status,
    ]);
  
    autoTable(doc, {
      head: [["Name", "Email", "Amount", "Type", "Status"]],
      body: rows,
      startY: 20,
    });
  
    doc.save("Loan_History.pdf");
  };
  

  return (
    <div className="min-h-screen p-6 bg-gradient-to-br from-blue-50 to-white">
      <div className="max-w-6xl p-8 mx-auto bg-white shadow-xl rounded-3xl">
        <div className="flex items-center gap-4 pb-4 border-b">
          <button
            onClick={() => navigate("/employee/dashboard")}
            className="text-blue-600 mt-[-60px] ml-[-20px]"
          >
            <ArrowLeft size={24} />
          </button>
          <Banknote size={28} className="text-blue-600" />
          <h2 className="text-2xl font-semibold text-gray-800">
            Loan History
          </h2>
        </div>

        {history.length === 0 ? (
          <p className="mt-6 text-gray-600">No approved or rejected loans found.</p>
        ) : (
          <ul className="mt-6 space-y-4">
            {history.map((loan) => (
              <li key={loan._id} className="p-4 bg-gray-100 shadow rounded-xl">
                <div className="flex items-center justify-between">
                  <div>
                    <p>
                      <strong>Name:</strong>{" "}
                      {loan.userId?.fullName || "N/A"}
                    </p>
                    <p>
                      <strong>Email:</strong> {loan.userId?.email}
                    </p>
                    <p>
                      <strong>Amount:</strong> ₹{loan.amount}
                    </p>
                    <p>
                      <strong>Type:</strong> {loan.loanType}
                    </p>
                  </div>
                  <div className="text-right">{getBadge(loan.status)}</div>
                </div>
              </li>
            ))}
          </ul>
        )}
        <div className="flex self-center justify-center gap-6 mt-6 ">
  <button
    onClick={exportToExcel}
    className="px-4 py-2 text-white bg-green-600 rounded hover:bg-green-700"
  >
    Export to Excel
  </button>
  <button
    onClick={exportToPDF}
    className="px-4 py-2 text-white bg-red-500 rounded hover:bg-red-600"
  >
    Export to PDF
  </button>
</div>
      </div>
      
    </div>
  );
};

export default LoanHistory;
