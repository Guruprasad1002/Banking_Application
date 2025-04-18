import mongoose from "mongoose";

const supportSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  query: String,
  status: {
    type: String,
    enum: ["Open", "Resolved"],
    default: "Open"
  }
}, { timestamps: true });

export default mongoose.model("SupportRequest", supportSchema);
