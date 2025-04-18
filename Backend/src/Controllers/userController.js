import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../Models/userModel.js";
import Account from "../Models/accountModel.js"; 


const JWT_SECRET = process.env.JWT_SECRET;

const generateOTP = () => Math.floor(100000 + Math.random() * 900000); // 6-digit OTP

const generateAccountNumber = () => {
  return "AC" + Math.floor(Math.random() * 1000000000); 
};

export const register = async (req, res) => {
  const { name, email, phone, password, role,address } = req.body;

  try {
    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const otp = generateOTP();

    const user = await User.create({
      name,
      email,
      phone,
      password: hashedPassword,
      role,
      address,
      otp, 
      status: "inactive", 
    });

    // Send OTP in response for now (for development/testing)
    res.status(201).json({
      message: "User registered. OTP generated.",
      userId: user._id,
      otp, 
    });

     const account = await Account.create({
      userId: user._id,
      accountNumber: generateAccountNumber(),
      status: "Inactive", 
      balance: 0,
      type: "Savings", 
    });

  } catch (err) {
    res.status(500).json({ message: "Error in registration", error: err.message });
  }
};


export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, { expiresIn: "7d" });

    res.json({ message: "Login successful", token, user });
  } catch (err) {
    res.status(500).json({ message: "Login failed", error: err.message });
  }
};
