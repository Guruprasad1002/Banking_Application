import mongoose from "mongoose";

const loanSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  amount: Number,
  purpose: String,
  loanType: {
    type: String,
    enum: ["Personal", "Home", "Education", "Vehicle", "Business"]
  },
  durationMonths: Number,
  employment: String,
  income: Number,
  status: {
    type: String,
    enum: ["Pending", "Approved", "Rejected"],
    default: "Pending"
  }
}, { timestamps: true });

export default mongoose.model("Loan", loanSchema);
