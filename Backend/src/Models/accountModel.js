import mongoose from "mongoose";

const accountSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  accountNumber: {
    type: String,
    required: true,
    unique: true
  },
  balance: {
    type: Number,
    default: 0
  },
  branch: String,
  type: {
    type: String,
    enum: ["Savings", "Current"],
    default: "Savings"
  },
  status: {
    type: String,
    enum: ["Active", "Inactive","Rejected"],
    default: "Active"
  }
}, { timestamps: true });

export default mongoose.model("Account", accountSchema);
