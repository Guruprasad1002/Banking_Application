import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";
import { ArrowLeft } from "lucide-react";

const AddBalance = () => {
    const [customerSearch, setCustomerSearch] = useState("");
    const [customer, setCustomer] = useState(null);
    const [balanceToAdd, setBalanceToAdd] = useState("");
    const [message, setMessage] = useState("");
    const navigate = useNavigate();

    const searchCustomer = async () => {
        try {
            const response = await api.get(`/employee/accounts/search/${customerSearch}`);
            setCustomer(response.data);
            setMessage("");
        } catch (error) {
            setCustomer(null);
            setMessage("Customer not found.");
        }
    };

    const addBalance = async () => {
        try {
            if (customer && balanceToAdd > 0) {
                const response = await api.put("/employee/accounts/add-balance", {
                    userId: customer.id,
                    amount: balanceToAdd,
                });
                setMessage(response.data.message);
                setCustomer(null);
                setBalanceToAdd("");
                setCustomerSearch("");
            } else {
                setMessage("Please enter a valid amount.");
            }
        } catch (error) {
            setMessage("Error adding balance.");
        }
    };

    return (
        <div className="min-h-screen p-6 bg-gradient-to-br from-slate-100 to-white">
            <div className="max-w-4xl p-8 mx-auto space-y-8 bg-white shadow-xl rounded-2xl">
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => navigate("/employee/dashboard")}
                        className="flex items-center gap-2 font-medium text-emerald-700 hover:underline"
                    >
                        <ArrowLeft size={20} />
                        Back to Dashboard
                    </button>
                </div>


                <h2 className="text-3xl font-bold text-gray-800">Add Balance to Customer Account</h2>

                <div className="space-y-2">
                    <label htmlFor="customer-search" className="block text-sm font-medium text-gray-700">
                        Search by Name, Account Number, Email, or Phone
                    </label>
                    <div className="flex gap-2">
                        <input
                            id="customer-search"
                            type="text"
                            value={customerSearch}
                            onChange={(e) => setCustomerSearch(e.target.value)}
                            className="flex-1 p-2 border border-gray-300 rounded-lg"
                            placeholder="Enter value"
                        />
                        <button
                            onClick={searchCustomer}
                            className="px-4 py-2 text-white rounded-lg bg-emerald-600 hover:bg-emerald-700"
                        >
                            Search
                        </button>
                    </div>
                </div>

                {customer && (
                    <div className="p-6 border rounded-lg shadow-inner bg-slate-50">
                        <h3 className="mb-2 text-lg font-semibold text-gray-700">Customer Details</h3>
                        <p><strong>Name:</strong> {customer.name}</p>
                        <p><strong>Email:</strong> {customer.email}</p>
                        <p><strong>Account Status:</strong> {customer.accountStatus || "Not Created"}</p>

                        <div className="mt-4 space-y-2">
                            <label htmlFor="balance" className="block text-sm font-medium text-gray-700">
                                Balance to Add
                            </label>
                            <input
                                id="balance"
                                type="number"
                                value={balanceToAdd}
                                min={0}
                                onChange={(e) => setBalanceToAdd(Number(e.target.value))}
                                className="w-full p-2 border border-gray-300 rounded-lg"
                                placeholder="Enter amount"
                            />
                            <button
                                onClick={addBalance}
                                className="w-full py-2 text-white rounded-lg bg-emerald-600 hover:bg-emerald-700"
                            >
                                Add Balance
                            </button>
                        </div>
                    </div>
                )}

                {message && (
                    <div className="mt-4 font-medium text-center text-red-600 text-md">
                        {message}
                    </div>
                )}
            </div>
        </div>
    );
};

export default AddBalance;
