import Account from "../Models/accountModel.js";
import Transaction from "../Models/transactionModel.js";
import Loan from "../Models/loanModel.js";
import SupportRequest from "../Models/supportModel.js";
import Card from "../Models/cardModel.js";
import User from "../Models/userModel.js";


export const getAccountDetails = async (req, res) => {
  try {
    const account = await Account.findOne({ userId: req.user._id });

    if (!account) {
      return res.status(404).json({ message: "Account not found" });
    }

    res.json({ message: "Account fetched successfully", account });
  } catch (error) {
    res.status(500).json({ message: "Error fetching account", error: error.message });
  }
};

export const getTransactionHistory = async (req, res) => {
    try {
      const transactions = await Transaction.find({
        $or: [
          { fromUser: req.user._id },
          { toUser: req.user._id }
        ]
      }).sort({ createdAt: -1 });
  
      res.json({ message: "Transactions fetched", transactions });
    } catch (error) {
      res.status(500).json({ message: "Error fetching transactions", error: error.message });
    }
  };

  export const lookupUser = async (req, res) => {
    const { accountNumber, email } = req.query;
  
    try {
      let account, user;
  
      if (accountNumber) {
        account = await Account.findOne({ accountNumber });
        if (!account) return res.status(404).json({ message: "Account not found" });
  
        user = await User.findById(account.userId);
        if (!user) return res.status(404).json({ message: "User not found" });
      } else if (email) {
        user = await User.findOne({ email });
        if (!user) return res.status(404).json({ message: "User not found" });
  
        account = await Account.findOne({ userId: user._id });
        if (!account) return res.status(404).json({ message: "Account not found" });
      } else {
        return res.status(400).json({ message: "Please provide accountNumber or email" });
      }
  
      res.json({
        name: user.name,
        userId: user._id,
        accountNumber: account.accountNumber,
        branch: account.branch,
        email: user.email,
      });
    } catch (err) {
      res.status(500).json({ message: "Lookup failed", error: err.message });
    }
  };
   

export const transferFunds = async (req, res) => {
  const { toUserId, amount, note } = req.body;

  if (!amount || amount <= 0) {
    return res.status(400).json({ message: "Invalid transfer amount" });
  }

  try {
    const fromAcc = await Account.findOne({ userId: req.user._id });
    const toAcc = await Account.findOne({ userId: toUserId });

    if (!fromAcc || !toAcc) {
      return res.status(404).json({ message: "One or both accounts not found" });
    }

    if (fromAcc.balance < amount) {
      return res.status(400).json({ message: "Insufficient balance" });
    }

    fromAcc.balance -= amount;
    toAcc.balance += amount;

    await fromAcc.save();
    await toAcc.save();

    const transaction = await Transaction.create({
      fromUser: req.user._id,
      toUser: toUserId,
      amount,
      note,
      status: "Approved"
    });

    res.status(201).json({ message: "Transfer successful", transaction });
  } catch (error) {
    res.status(500).json({ message: "Transfer failed", error: error.message });
  }
};
  
  export const applyLoan = async (req, res) => {
    const { amount, purpose, loanType, durationMonths, employment, income } = req.body;
  
    try {
      const loan = await Loan.create({
        userId: req.user._id,
        amount,
        purpose,
        loanType,
        durationMonths,
        employment,
        income
      });
  
      res.status(201).json({ message: "Loan application submitted", loan });
    } catch (error) {
      res.status(500).json({ message: "Loan request failed", error: error.message });
    }
  };

  export const submitSupportRequest = async (req, res) => {
    const { query } = req.body;
  
    try {
      const request = await SupportRequest.create({
        userId: req.user._id,
        query
      });
  
      res.status(201).json({ message: "Support request submitted", request });
    } catch (error) {
      res.status(500).json({ message: "Failed to submit support request", error: error.message });
    }
  };

  export const getSupportRequests = async (req, res) => {
    try {
      const requests = await SupportRequest.find({ userId: req.user._id }).sort({ createdAt: -1 });
      res.json({ message: "Support requests fetched", requests });
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch support requests", error: error.message });
    }
  };

  export const getMyLoans = async (req, res) => {
    try {
      const loans = await Loan.find({ userId: req.user._id }).sort({ createdAt: -1 });
      res.json({ message: "Loan history fetched", loans });
    } catch (error) {
      res.status(500).json({ message: "Error fetching loans", error: error.message });
    }
  };

export const getCards = async (req, res) => {
    try {
      const cards = await Card.find({ userId: req.user._id });
      res.json({ message: "Cards fetched successfully", cards });
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch cards", error: error.message });
    }
  };
  
  export const addCard = async (req, res) => {
    const { type, number, expiry } = req.body;
  
    try {
      const newCard = await Card.create({
        userId: req.user._id,
        type,
        number,
        expiry
      });
  
      res.status(201).json({ message: "Card added successfully", card: newCard });
    } catch (error) {
      res.status(500).json({ message: "Failed to add card", error: error.message });
    }
  };
  

  export const blockCard = async (req, res) => {
    const { cardId } = req.params;
  
    try {
      const card = await Card.findOne({ _id: cardId, userId: req.user._id });
      if (!card) return res.status(404).json({ message: "Card not found" });
  
      card.status = "Blocked";
      await card.save();
  
      res.json({ message: "Card blocked successfully", card });
    } catch (error) {
      res.status(500).json({ message: "Failed to block card", error: error.message });
    }
  };
  
  