import { useEffect, useState } from "react";
import { ArrowLeft, CheckCircle, Clock } from "lucide-react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";

const EmployeeSupport = () => {
  const [requests, setRequests] = useState([]);
  const [history, setHistory] = useState([]);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  const fetchRequests = async () => {
    try {
      const res = await api.get("/employee/support");

      const open = res.data.requests.filter(req => req.status === "Open");
      const resolved = res.data.requests.filter(req => req.status === "Resolved");
      setRequests(open);
      setHistory(resolved);
    } catch (err) {
      console.error("Error fetching support requests", err);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleResolve = async (id) => {
    try {
      await api.put("/employee/support/resolve", { requestId: id });
      fetchRequests();
    } catch (err) {
      console.error("Error resolving request", err);
    }
  };

  const filteredRequests = requests.filter((req) =>
    req.query.toLowerCase().includes(search.toLowerCase()) ||
    req.userId.email.toLowerCase().includes(search.toLowerCase())
  );

  const openRequests = filteredRequests.filter(req => req.status === "Open");
  const resolvedRequests = filteredRequests.filter(req => req.status === "Resolved");

  return (
    <div className="min-h-screen p-6 bg-gradient-to-br from-blue-50 to-white">
      <div className="max-w-4xl p-8 mx-auto space-y-10 bg-white shadow-lg rounded-xl">
        <div className="flex items-center gap-4 pb-4 border-b">
          <button
            onClick={() => navigate("/employee/dashboard")}
            className="text-blue-600 mt-[-60px] ml-[-20px]"
          >
            <ArrowLeft size={24} />
          </button>
          <h2 className="text-2xl font-semibold text-gray-800">Open Support Requests</h2>
        </div>

        <input
          type="text"
          placeholder="Search by query or email"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full px-4 py-2 border rounded-md shadow-sm"
        />

        {requests.length === 0 ? (
          <p className="text-gray-600">No open support requests found.</p>
        ) : (
          <ul className="space-y-4">
            {requests.map((req) => (
              <li key={req._id} className="flex items-start justify-between p-4 bg-gray-100 shadow rounded-xl">
                <div>
                  <p className="text-gray-800">{req.query}</p>
                  <p className="mt-1 text-sm text-gray-500">
                    From: <span className="font-medium">{req.userId.name}</span> ({req.userId.email})
                  </p>
                </div>
                <button
                  onClick={() => handleResolve(req._id)}
                  className="flex items-center gap-1 px-4 py-2 text-white bg-green-600 rounded hover:bg-green-700"
                >
                  <CheckCircle size={18} />
                  Resolve
                </button>
              </li>
            ))}
          </ul>
        )}

        <div className="pt-6 mt-10 border-t">
          <h3 className="mb-4 text-xl font-semibold text-gray-800">Support Request History</h3>
          {history.length === 0 ? (
            <p className="text-gray-500">No resolved requests yet.</p>
          ) : (
            <ul className="space-y-4">
              {history.map((req) => (
                <li
                  key={req._id}
                  className="flex justify-between p-4 border shadow-sm bg-gray-50 rounded-xl"
                >
                  <div>
                    <p className="text-gray-800">{req.query}</p>
                    <p className="mt-1 text-sm text-gray-500">
                      From: <span className="font-medium">{req.userId?.name || "Unknown"}</span> ({req.userId?.email || "N/A"})
                    </p>
                  </div>
                  <div className="flex items-center gap-1 px-2 py-1 text-sm text-green-600 bg-green-100 rounded">
                    <CheckCircle size={16} />
                    Resolved
                  </div>
                  <p className="mt-1 text-sm text-gray-500">
                    Resolved On:{" "}
                    {new Date(req.updatedAt || req.resolvedAt || req.createdAt).toLocaleString()}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default EmployeeSupport;
