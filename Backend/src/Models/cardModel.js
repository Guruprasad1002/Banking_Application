import mongoose from "mongoose";

const cardSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  type: {
    type: String,
    enum: ["Debit Card", "Credit Card"],
    required: true
  },
  number: {
    type: String,
    required: true,
    unique: true
  },
  expiry: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ["Active", "Blocked"],
    default: "Active"
  }
}, { timestamps: true });

export default mongoose.model("Card", cardSchema);
