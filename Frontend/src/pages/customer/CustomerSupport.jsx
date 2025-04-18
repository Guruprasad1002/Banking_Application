import { useEffect, useState } from "react";
import { ArrowLeft, HelpCircle, MessageSquare } from "lucide-react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";

const CustomerSupport = () => {
    const [query, setQuery] = useState("");
    const [requests, setRequests] = useState([]);
    const [error, setError] = useState("");
    const navigate = useNavigate();
  
    const fetchRequests = async () => {
      try {
        const res = await api.get("/customer/support");
        setRequests(res.data.requests || []);
      } catch (err) {
        console.error("Failed to fetch support requests:", err);
      }
    };
  
    useEffect(() => {
      fetchRequests();
    }, []);
  
    const handleGoBack = () => {
      navigate("/customer/dashboard");
    };
  
    const handleSubmit = async (e) => {
      e.preventDefault();
      if (!query.trim()) {
        setError("Please enter a support query.");
        return;
      }
      try {
        await api.post("/customer/support", { query });
        setQuery("");
        setError("");
        fetchRequests();
      } catch (err) {
        console.error("Failed to submit request:", err);
        setError("Something went wrong!");
      }
    };
  
    return (
      <div className="min-h-screen p-6 bg-gradient-to-br from-blue-50 to-white">
        <div className="max-w-4xl p-8 mx-auto space-y-6 bg-white shadow-lg rounded-xl">
          <div className="flex items-center gap-4 pb-4 border-b">
            <button onClick={handleGoBack} className="text-blue-600 mt-[-60px] ml-[-20px]">
              <ArrowLeft size={24} />
            </button>
            <HelpCircle size={28} className="text-blue-600" />
            <h2 className="text-2xl font-semibold text-gray-800">Support Requests</h2>
          </div>
  
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && <p className="text-red-500">{error}</p>}
            <textarea
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Describe your issue..."
              rows={3}
              className="w-full p-3 border rounded"
            ></textarea>
            <button
              type="submit"
              className="px-6 py-2 text-white bg-blue-600 rounded hover:bg-blue-700"
            >
              Submit Request
            </button>
          </form>
  
          <div>
            <h3 className="mt-6 text-xl font-semibold text-gray-800">Your Previous Requests</h3>
            {requests.length === 0 ? (
              <p className="mt-2 text-gray-500">No support requests found.</p>
            ) : (
              <ul className="mt-4 space-y-4">
                {requests.map((req) => (
                  <li key={req._id} className="flex items-start justify-between p-4 bg-gray-100 shadow rounded-xl">
                    <div>
                      <p className="text-gray-800">{req.query}</p>
                      <p className="mt-1 text-sm text-gray-500">
                        Submitted: {new Date(req.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <span
                      className={`text-sm px-3 py-1 rounded font-medium ${
                        req.status === "Resolved"
                          ? "bg-green-100 text-green-600"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {req.status}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    );
  };

export default CustomerSupport
