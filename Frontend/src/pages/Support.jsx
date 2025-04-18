import { ArrowLeft, HelpCircle, Mail, Phone, MessageCircle, MapPin } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Support = () => {
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate("/customer/dashboard");
  };

  return (
    <div className="min-h-screen p-6 bg-gradient-to-br from-blue-50 to-white">
      <div className="max-w-2xl p-8 mx-auto space-y-6 bg-white shadow-lg rounded-xl">
        <div className="flex items-center gap-4 pb-4 border-b">
          <button onClick={handleGoBack} className="text-blue-600 mt-[-60px] ml-[-20px]">
            <ArrowLeft size={24} />
          </button>
          <HelpCircle size={28} className="text-blue-600" />
          <h2 className="text-2xl font-semibold text-gray-800">Customer Support</h2>
        </div>

        <p className="text-gray-700">
          If you have any questions, issues, or need assistance with your account or transactions, feel free to reach out to us through the following support channels:
        </p>

        <div className="grid gap-6 text-gray-800 md:grid-cols-2">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-lg font-semibold">
              <Mail className="text-blue-600" size={20} />
              <span>Email Support</span>
            </div>
            <a href="mailto:support@bankapp.com" className="block text-blue-600 hover:underline">
              support@bankapp.com
            </a>
            <p>We respond within 24 hours on business days.</p>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2 text-lg font-semibold">
              <Phone className="text-blue-600" size={20} />
              <span>Phone Support</span>
            </div>
            <a href="tel:+919876543210" className="block text-blue-600 hover:underline">
              +91-9876543210
            </a>
            <p>Available Mon–Sat, 9 AM to 6 PM</p>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2 text-lg font-semibold">
              <MessageCircle className="text-blue-600" size={20} />
              <span>Live Chat</span>
            </div>
            <p>Coming soon to the customer dashboard.</p>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2 text-lg font-semibold">
              <MapPin className="text-blue-600" size={20} />
              <span>Visit Us</span>
            </div>
            <p>BankApp HQ, Mangalore</p>
            <p>Mon–Fri, 10 AM to 5 PM</p>
          </div>
        </div>

        <div className="p-4 text-sm text-blue-800 bg-blue-100 border border-blue-300 rounded">
          💡 <strong>Tip:</strong> You can also check our{" "}
          <span className="text-blue-700 underline cursor-pointer hover:text-blue-900">
            FAQs
          </span>{" "}
          for quick help on common topics like fund transfers, account updates, and security settings.
        </div>
      </div>
    </div>
  );
};

export default Support;
