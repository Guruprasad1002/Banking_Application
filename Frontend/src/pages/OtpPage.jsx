import React, { useEffect, useRef, useState } from "react";
import { LockIcon, Smartphone } from "lucide-react";
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../authContext"; // adjust the path if needed
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const OtpPage = () => {
  const OTP_Count = 6;
  const [inputArr, setInputArr] = useState(new Array(OTP_Count).fill(""));
  const ref = useRef([]);
  const [timer, setTimer] = useState(30);
  const [canResend, setCanResend] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { login } = useAuth(); 
  const [expectedOtp, setExpectedOtp] = useState("");

  useEffect(() => {
    const otpFromRegister = location.state?.otp?.toString(); 
    if (otpFromRegister) {
      setExpectedOtp(otpFromRegister); 
      setTimeout(() => {
        alert(`Your OTP is: ${otpFromRegister}`);
      }, 2000);
    }
  }, [location.state]);

  useEffect(() => {
    ref.current[0]?.focus();
  }, []);

  useEffect(() => {
    let countdown;
    if (timer > 0) {
      countdown = setTimeout(() => setTimer(timer - 1), 1000);
    } else {
      setCanResend(true);
    }
    return () => clearTimeout(countdown);
  }, [timer]);

  const handleChange = (value, index) => {
    if (isNaN(value)) return;
    const newVal = value.trim();
    const newArr = [...inputArr];
    newArr[index] = newVal.slice(-1);
    setInputArr(newArr);
    if (newVal && index < OTP_Count - 1) {
      ref.current[index + 1]?.focus();
    }
  };

  const handleBackspace = (e, i) => {
    if (!e.target.value && e.key === "Backspace") {
      const newArr = [...inputArr];
      newArr[i] = "";
      setInputArr(newArr);
      if (i > 0) ref.current[i - 1]?.focus();
    }
  };

  const handleResend = () => {
    setTimer(30);
    setCanResend(false);
    setInputArr(new Array(OTP_Count).fill(""));
    ref.current[0]?.focus();
    alert("OTP resent successfully!");
  };

  const isOtpComplete = inputArr.every((digit) => digit.trim() !== "");

  const handleSubmit = () => {
    const enteredOtp = inputArr.join("");
  
    if (enteredOtp === expectedOtp) {
      toast.success("Registration successful!", {
        position: "top-center",
        autoClose: 2000,
      });
  
      const userRole = "customer";
      const user = { role: userRole };
      login(user);
  
      setTimeout(() => {
        navigate(`/${userRole}/dashboard`);
      }, 2200);
    } else {
      toast.error("Invalid OTP. Please try again.", {
        position: "top-center",
        autoClose: 3000,
      });
    }
  };
  

  return (
    <div className="flex items-center justify-center min-h-screen p-4 bg-gradient-to-br from-blue-500 via-purple-600 to-pink-500 sm:p-6">
      <div className="w-full max-w-md p-6 shadow-2xl bg-white/90 backdrop-blur-xl rounded-3xl sm:p-8">
        <div className="flex flex-col items-center justify-center mb-8">
          <div className="p-3 mb-4 bg-blue-100 rounded-full">
            <LockIcon className="text-blue-600" size={32} />
          </div>
          <h1 className="mb-2 text-3xl font-bold text-gray-800">Verify Your Account</h1>
          <p className="max-w-xs text-sm text-center text-gray-600">
            We've sent a 6-digit code to your registered mobile number.
          </p>
        </div>

        <div className="flex justify-center gap-2 mb-8 sm:gap-4">
          {inputArr.map((_, i) => (
            <input
              key={i}
              type="text"
              value={inputArr[i]}
              onChange={(e) => handleChange(e.target.value, i)}
              onKeyDown={(e) => handleBackspace(e, i)}
              ref={(el) => (ref.current[i] = el)}
              maxLength={1}
              className="w-10 h-12 text-xl font-semibold text-center text-gray-800 transition duration-200 bg-white border-2 border-gray-300 rounded-lg shadow-sm sm:w-12 sm:h-14 sm:text-2xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none hover:border-blue-400"
            />
          ))}
        </div>

        <button
          onClick={handleSubmit}
          disabled={!isOtpComplete}
          className={`w-full px-6 py-3 rounded-full font-semibold text-lg transition duration-200 ${isOtpComplete
              ? "bg-blue-600 text-white hover:bg-blue-700 focus:ring-4 focus:ring-blue-300"
              : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }`}
        >
          Verify OTP
        </button>

        <div className="mt-6 text-center">
          <p className="mb-2 text-sm text-gray-600">Didn't receive the code?</p>
          <button
            onClick={handleResend}
            disabled={!canResend}
            className={`text-sm font-semibold transition duration-200 ${canResend
                ? "text-blue-600 hover:text-blue-800"
                : "text-gray-400 cursor-not-allowed"
              }`}
          >
            {canResend ? "Resend OTP" : `Resend OTP in ${timer}s`}
          </button>
        </div>

        <div className="flex items-center justify-center mt-8 text-gray-500">
          <Smartphone size={16} className="mr-2" />
          <span className="text-xs">Secure OTP Verification</span>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default OtpPage;
