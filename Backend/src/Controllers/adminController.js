import User from "../Models/userModel.js";
import Employee from "../Models/employeeModel.js";
import Transaction from "../Models/transactionModel.js";
import Loan from "../Models/loanModel.js";
import SupportRequest from "../Models/supportModel.js";
import bcrypt from "bcryptjs";

export const addEmployee = async (req, res) => {
  const { name, email, phone, password, position, salary, age, address } = req.body;
  try {
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      phone,
      password,
      role: "employee",
    });

    await Employee.create({
      userId: user._id,
      position,
      salary,
      address,
      age
    });    

    res.status(201).json({ message: "Employee added", Employee });
  } catch (err) {
    res.status(500).json({ message: "Failed to add employee", error: err.message });
  }  
};

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json({ message: "All users", users });
  } catch (err) {
    res.status(500).json({ message: "Error fetching users", error: err.message });
  }
};

export const updateUserStatus = async (req, res) => {
  const { userId, status } = req.body;

  if (!["active", "inactive"].includes(status)) {
    return res.status(400).json({ message: "Invalid status value" });
  }

  try {
    const user = await User.findByIdAndUpdate(
      userId,
      { status },
      { new: true }
    );

    if (!user) return res.status(404).json({ message: "User not found" });

    res.json({ message: `User ${status}`, user });
  } catch (err) {
    res.status(500).json({ message: "Failed to update user status", error: err.message });
  }
};


export const getAllEmployees = async (req, res) => {
  try {
    const employees = await User.find({ role: "employee" }).select("-password");
    res.json({ message: "All employees", employees });
  } catch (err) {
    res.status(500).json({ message: "Error fetching employees", error: err.message });
  }
};

export const deleteEmployee = async (req, res) => {
  const { employeeId } = req.body;

  try {
    await Employee.findOneAndDelete({ userId: employeeId });

    const user = await User.findOneAndDelete({ _id: employeeId, role: "employee" });

    if (!user) return res.status(404).json({ message: "Employee not found" });

    res.json({ message: "Employee deleted", user });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete employee", error: err.message });
  }
};


export const getDashboardReport = async (req, res) => {
    try {
      const totalCustomers = await User.countDocuments({ role: "customer" });
      const totalEmployees = await User.countDocuments({ role: "employee" });
      const totalTransactions = await Transaction.countDocuments();
      const totalLoansIssued = await Loan.countDocuments();
      const supportTickets = await SupportRequest.countDocuments({ status: "Open" });
  
      res.json({
        totalCustomers,
        totalEmployees,
        totalTransactions,
        totalLoansIssued,
        supportTickets
      });
    } catch (err) {
      res.status(500).json({ message: "Failed to fetch reports", error: err.message });
    }
  };

export const getWeeklyTransactions = async (req, res) => {
  try {
    const today = new Date();
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - 6); // last 7 days

    const transactions = await Transaction.aggregate([
      {
        $match: {
          createdAt: { $gte: startOfWeek },
        },
      },
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$createdAt" },
          },
          count: { $sum: 1 },
        },
      },
      {
        $sort: { _id: 1 },
      },
    ]);

    // Fill in missing days
    const formattedData = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dayStr = date.toISOString().split("T")[0];

      const match = transactions.find((t) => t._id === dayStr);
      formattedData.push({
        day: date.toLocaleDateString("en-US", { weekday: "short" }),
        transactions: match ? match.count : 0,
      });
    }

    res.json(formattedData);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch weekly transactions", error: err.message });
  }
};

export const getAllLoans = async (req, res) => {
  try {
    const loans = await Loan.find().populate("userId", "name email");
    res.json({ message: "All loan applications", loans });
  } catch (err) {
    res.status(500).json({ message: "Error fetching loans", error: err.message });
  }
};

export const updateLoanStatus = async (req, res) => {
  const { loanId, status } = req.body;

  try {
    const loan = await Loan.findById(loanId);
    if (!loan) return res.status(404).json({ message: "Loan not found" });

    loan.status = status;
    await loan.save();

    res.json({ message: `Loan marked as ${status}`, loan });
  } catch (err) {
    res.status(500).json({ message: "Loan update failed", error: err.message });
  }
};

  

