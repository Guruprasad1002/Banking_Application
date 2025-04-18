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

export const lookupUserByEmail = async (req, res) => {
  const { email } = req.query;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    const account = await Account.findOne({ userId: user._id });
    if (!account) return res.status(404).json({ message: "Account not found" });

    res.json({
      name: user.name,
      userId: user._id,
      accountNumber: account.accountNumber,
      branch: account.branch
    });
  } catch (err) {
    res.status(500).json({ message: "Lookup failed", error: err.message });
  }
};

  export const transferFunds = async (req, res) => {
    const { toUserId, amount, note } = req.body;
  
    try {
      const transaction = await Transaction.create({
        fromUser: req.user._id,
        toUser: toUserId,
        amount,
        note,
        status: "Pending"
      });
  
      res.status(201).json({ message: "Transfer initiated", transaction });
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
  
  