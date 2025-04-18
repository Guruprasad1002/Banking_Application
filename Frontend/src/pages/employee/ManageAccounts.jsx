import { useState, useRef, useEffect } from "react";
import { CheckCircle, XCircle, Eye, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import api from "../../api/axios";
const ManageAccounts = () => {
  const navigate = useNavigate();
  const [customers, setCustomers] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const modalRef = useRef(null);

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const res = await api.get("/employee/accounts");
        setCustomers(res.data.customers || []);
      } catch (err) {
        console.error("Failed to fetch customers", err);
      }
    };
    fetchCustomers();
  }, []);


  const handleAction = async (userId, newStatus) => {
    try {
      const res = await api.put("/employee/accounts/status", {
        userId,
        status: newStatus,
      });

      toast.success(`Account marked as ${newStatus}`);
      setCustomers((prev) =>
        prev.map((customer) =>
          customer.id === userId
            ? { ...customer, status: newStatus }
            : customer
        )
      );
    } catch (err) {
      console.error("Error updating status", err);
      toast.error("Failed to update status");
    }
  };

  const handleShowDetails = (customer) => {
    setSelectedCustomer(customer);
  };

  const handleCloseDetails = () => {
    setSelectedCustomer(null);
  };

  const handleBack = () => {
    navigate("/employee/dashboard");
  };

  return (
    <div className="min-h-screen p-6 bg-gradient-to-br from-blue-50 to-white">
      <div className="max-w-4xl p-8 mx-auto space-y-6 bg-white shadow-xl rounded-3xl">
        <div className="flex items-center gap-4 pb-4 border-b">
          <button onClick={handleBack} className="text-blue-600 mt-[-60px] ml-[-20px]">
            <ArrowLeft size={24} />
          </button>
          <h2 className="mb-6 text-3xl font-semibold text-gray-800">Manage Customer Accounts</h2>
        </div>

        <ul className="space-y-4">
          {customers
            .filter((customer) => customer.status !== "Not Created")
            .map((customer) => (
              <li key={customer.id} className="flex items-center justify-between p-4 bg-white rounded-lg shadow-md">
                <div>
                  <p className="text-xl font-semibold text-gray-800">{customer.name}</p>
                  <p className="text-sm text-gray-500">Status: {customer.status}</p>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={customer.status !== "Active" ? () => handleAction(customer.id, "Active") : () => { }}
                    className={`flex items-center px-4 py-2 text-white rounded-xl ${customer.status === "Active"
                        ? "bg-green-300 cursor-not-allowed opacity-60"
                        : "bg-green-500 hover:bg-green-600"
                      }`}
                  >
                    <CheckCircle size={18} className="mr-2" />
                    Activate
                  </button>

                  <button
                    onClick={customer.status !== "Inactive" ? () => handleAction(customer.id, "Inactive") : () => { }}
                    className={`flex items-center px-4 py-2 text-white rounded-xl ${customer.status === "Inactive"
                        ? "bg-red-300 cursor-not-allowed opacity-60"
                        : "bg-red-500 hover:bg-red-600"
                      }`}
                  >
                    <XCircle size={18} className="mr-2" />
                    Deactivate
                  </button>



                  <button
                    onClick={() => handleShowDetails(customer)}
                    className="flex items-center px-4 py-2 text-white bg-blue-500 hover:bg-blue-600 rounded-xl"
                  >
                    <Eye size={18} className="mr-2" />
                    View Details
                  </button>
                </div>

              </li>
            ))}
        </ul>
      </div>

      {selectedCustomer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div ref={modalRef} className="bg-white rounded-xl shadow-xl p-6 w-96 max-h-[90vh] overflow-y-auto relative">
            <h3 className="mb-4 text-2xl font-semibold text-gray-800">Customer Details</h3>
            <div className="space-y-4">

              <p><strong>Name:</strong> {selectedCustomer.name}</p>
              <p><strong>Status:</strong> {selectedCustomer.status}</p>
              <p><strong>Email:</strong> {selectedCustomer.email}</p>
              <p><strong>Phone:</strong> {selectedCustomer.phone}</p>
            </div>
            <div className="flex justify-end gap-4 mt-6">
              <button onClick={handleCloseDetails} className="px-4 py-2 ml-20 text-white bg-red-500 rounded-xl">Close</button>
            </div>
          </div>
        </div>
      )}
      <ToastContainer/>
    </div>
  );
};

export default ManageAccounts;
