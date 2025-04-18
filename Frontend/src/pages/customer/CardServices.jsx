import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, CreditCard, Shield, PlusCircle  } from "lucide-react";
import api from "../../api/axios";

const CardServices = () => {
  const [cards, setCards] = useState([]);
  const [type, setType] = useState("Debit Card");
  const [number, setNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const fetchCards = async () => {
    try {
      const res = await api.get("/customer/cards");
      setCards(res.data.cards);
    } catch (err) {
      console.error("Failed to fetch cards:", err);
    }
  };

  useEffect(() => {
    fetchCards();
  }, []);

  const handleAddCard = async () => {
    if (!number || !expiry) {
      setError("Card number and expiry are required.");
      return;
    }

    if (number.length !== 16 || isNaN(number)) {
      setError("Card number must be 16 digits.");
      return;
    }

    if (!/^\d{2}\/\d{2}$/.test(expiry)) {
      setError("Expiry must be in MM/YY format.");
      return;
    }

    try {
      await api.post("/customer/cards", { type, number, expiry });
      setNumber("");
      setExpiry("");
      setError("");
      fetchCards();
      setSuccess("Card added successfully ✅");
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      console.error("Failed to add card:", err);
      setError("Could not add card.");
    }
  };

  const handleBlockCard = async (id) => {
    try {
      await api.put(`/customer/cards/${id}/block`);
      fetchCards();
    } catch (err) {
      console.error("Error blocking card:", err);
    }
  };

  return (
    <div className="min-h-screen p-6 bg-gradient-to-br from-blue-50 to-white">
      <div className="max-w-4xl p-8 mx-auto bg-white shadow-xl rounded-3xl">
        <Link to="/customer/dashboard" className="inline-flex items-center mb-6 text-blue-600 hover:underline">
          <ArrowLeft size={20} className="mr-2" />
          Back to Dashboard
        </Link>

        <h1 className="mb-6 text-3xl font-bold text-gray-800">Card Services</h1>

        <div className="space-y-6">
          {cards.map((card) => (
            <div key={card._id} className="p-6 bg-gray-100 shadow-md rounded-xl">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-800">{card.type}</h2>
                <CreditCard size={24} className="text-blue-600" />
              </div>
              <p className="mb-2 text-gray-600">Card Number: **** **** **** {card.number.slice(-4)}</p>
              <p className="text-gray-600">Expiry: {card.expiry}</p>
              <p className="mt-1 text-sm text-gray-500">Status: <strong>{card.status}</strong></p>
              <div className="mt-4 space-x-4">
                <button
                  onClick={() => handleBlockCard(card._id)}
                  disabled={card.status === "Blocked"}
                  className={`bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors ${card.status === "Blocked" ? "opacity-50 cursor-not-allowed" : ""}`}
                >
                  Block Card
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-10">
          <h2 className="flex items-center mb-4 text-2xl font-semibold text-gray-800">
            <PlusCircle size={24} className="mr-2" /> Add New Card
          </h2>

          {error && <p className="mb-2 text-red-500">{error}</p>}
          {success && <p className="mb-2 text-green-600">{success}</p>}


          <div className="grid gap-4 md:grid-cols-3">
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="p-2 border rounded"
            >
              <option value="Debit Card">Debit Card</option>
              <option value="Credit Card">Credit Card</option>
            </select>
            <input
              type="text"
              placeholder="Card Number"
              value={number}
              onChange={(e) => setNumber(e.target.value)}
              className="p-2 border rounded"
            />
            <input
              type="text"
              placeholder="MM/YY"
              value={expiry}
              onChange={(e) => setExpiry(e.target.value)}
              className="p-2 border rounded"
            />
          </div>
          <button
            onClick={handleAddCard}
            className="px-6 py-2 mt-4 text-white bg-blue-600 rounded hover:bg-blue-700"
          >
            Add Card
          </button>
        </div>

        <div className="p-6 mt-10 bg-blue-100 rounded-xl">
          <h2 className="flex items-center mb-2 text-xl font-semibold text-blue-800">
            <Shield size={24} className="mr-2" />
            Card Security Tips
          </h2>
          <ul className="space-y-2 text-blue-700 list-disc list-inside">
            <li>Never share your PIN with anyone</li>
            <li>Regularly monitor your transactions</li>
            <li>Use secure websites for online transactions</li>
            <li>Enable SMS alerts for all transactions</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default CardServices;
