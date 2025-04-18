import User from "../Models/userModel.js";
import Account from "../Models/accountModel.js";
import Transaction from "../Models/transactionModel.js";
import SupportRequest from "../Models/supportModel.js";
import Loan from "../Models/loanModel.js";

export const getAllCustomers = async (req, res) => {
  try {
    const customers = await User.find({ role: "customer" }).select("-password");
    const customerData = await Promise.all(
      customers.map(async (user) => {
        const account = await Account.findOne({ userId: user._id });
        return {
          id: user._id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          status: account?.status || "Not Created",
        };
      })
    );
    res.json({ message: "Customer accounts fetched", customers: customerData });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error fetching customers", error: err.message });
  }
};

export const getCustomer = async (req, res) => {
  try {
    const customer = await User.findById(req.params.id);
    if (!customer) {
      return res.status(404).json({ message: "Customer not found" });
    }
    res.json(customer);
  } catch (error) {
    res.status(500).json({ message: "Error fetching customer details", error });
  }
};

export const acceptOrRejectAccount = async (req, res) => {
  const { userId, action, balance } = req.body;

  try {
    const account = await Account.findOne({ userId });

    if (action === "accept") {
      if (!account)
        return res.status(404).json({ message: "Account not found" });

      account.status = "Active";
      if (balance !== undefined) {
        account.balance = balance;
      }
      await account.save();

      return res.json({
        message: "Account accepted and status set to Active",
        account,
      });
    }

    if (action === "reject") {
      if (account) {
        account.status = "Rejected";
        await account.save();
      }

      await User.findByIdAndUpdate(userId, { status: "inactive" });

      return res.json({
        message: "Account rejected",
      });
    }

    return res.status(400).json({
      message: "Invalid action. Action should be either 'accept' or 'reject'",
    });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to process action", error: err.message });
  }
};

export const searchCustomer = async (req, res) => {
  const search = req.params.search;

  try {
    const account = await Account.findOne({ accountNumber: search });

    let user = null;

    if (account) {
      user = await User.findOne({ _id: account.userId, role: "customer" });
    } else {
      user = await User.findOne({
        role: "customer",
        $or: [
          { email: search },
          { phone: search },
          { name: { $regex: new RegExp(search, "i") } },
        ],
      });
    }

    if (!user) {
      return res.status(404).json({ message: "Customer not found" });
    }
    const customerAccount = await Account.findOne({ userId: user._id });

    return res.json({
      id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      balance: customerAccount?.balance || 0,
      accountStatus: customerAccount ? customerAccount.status : "Not Created",
    });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error searching customer", error: err.message });
  }
};

export const addBalanceToAccount = async (req, res) => {
  const { userId, amount } = req.body;

  try {
    const account = await Account.findOne({ userId });

    if (!account) {
      return res.status(404).json({ message: "Account not found" });
    }

    account.balance += amount;
    await account.save();

    res.json({
      message: "Balance added successfully",
      account,
    });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error adding balance", error: err.message });
  }
};

export const updateAccountStatus = async (req, res) => {
  const { userId, status } = req.body;
  try {
    const account = await Account.findOneAndUpdate(
      { userId },
      { status },
      { new: true }
    );
    if (!account) return res.status(404).json({ message: "Account not found" });

    res.json({ message: `Account ${status}`, account });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to update status", error: err.message });
  }
};

export const getPendingTransactions = async (req, res) => {
  try {
    const pendingTxns = await Transaction.find({ status: "Pending" })
      .populate("fromUser", "name email")
      .populate("toUser", "name email")
      .sort({ createdAt: -1 });

    res.json({
      message: "Pending transactions fetched",
      transactions: pendingTxns,
    });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error fetching transactions", error: err.message });
  }
};

export const verifyTransaction = async (req, res) => {
  const { transactionId, status } = req.body;

  try {
    const transaction = await Transaction.findById(transactionId);
    if (!transaction)
      return res.status(404).json({ message: "Transaction not found" });
    if (transaction.status !== "Pending")
      return res.status(400).json({ message: "Already processed" });

    if (status === "Approved") {
      const fromAcc = await Account.findOne({ userId: transaction.fromUser });
      const toAcc = await Account.findOne({ userId: transaction.toUser });

      if (!fromAcc || !toAcc)
        return res.status(404).json({ message: "Account not found" });
      if (fromAcc.balance < transaction.amount)
        return res.status(400).json({ message: "Insufficient balance" });

      fromAcc.balance -= transaction.amount;
      toAcc.balance += transaction.amount;

      await fromAcc.save();
      await toAcc.save();
      transaction.status = "Approved";
    }

    if (status === "Rejected") {
      transaction.status = "Rejected";
    }
    await transaction.save();
    res.json({ message: `Transaction ${status}`, transaction });
  } catch (err) {
    res.status(500).json({ message: "Failed to verify", error: err.message });
  }
};

export const getSupportRequests = async (req, res) => {
  try {
    const requests = await SupportRequest.find()
      .populate("userId", "name email")
      .sort({ createdAt: -1 }); // Optional: latest first
    res.json({ message: "All support requests", requests });
  } catch (err) {
    res.status(500).json({
      message: "Failed to fetch support requests",
      error: err.message,
    });
  }
};

export const resolveSupportRequest = async (req, res) => {
  const { requestId } = req.body;

  try {
    const request = await SupportRequest.findByIdAndUpdate(
      requestId,
      { status: "Resolved" },
      { new: true }
    );

    if (!request) return res.status(404).json({ message: "Request not found" });

    res.json({ message: "Request resolved", request });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to resolve request", error: err.message });
  }
};

export const getAllLoans = async (req, res) => {
  try {
    const loans = await Loan.find().populate("userId", "name email");
    res.json({ message: "All loan applications", loans });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error fetching loans", error: err.message });
  }
};

export const updateLoanStatus = async (req, res) => {
  const { loanId, status } = req.body;

  if (!["Approved", "Rejected"].includes(status)) {
    return res.status(400).json({ message: "Invalid status value" });
  }

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
