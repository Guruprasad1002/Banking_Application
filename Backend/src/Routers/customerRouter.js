import express from "express";
import {
  getAccountDetails,
  getTransactionHistory,
  transferFunds,
  applyLoan,
  submitSupportRequest,
  getMyLoans ,
  getCards, 
  addCard,
  blockCard,
  lookupUser
} from "../Controllers/customerController.js";
import verifyToken from "../Middleware/verifyToken.js";
import verifyRole from "../Middleware/verifyRole.js";
import { getSupportRequests } from "../Controllers/employeeController.js";

const router = express.Router();

router.use(verifyToken, verifyRole(["customer"]));

router.get("/account", getAccountDetails);
router.get("/transactions", getTransactionHistory);
router.get("/lookup", lookupUser);
router.post("/transfer", transferFunds);
router.post("/loan", applyLoan);
router.get("/support", getSupportRequests);
router.post("/support", submitSupportRequest);
router.get("/loans", getMyLoans);
router.get("/cards", getCards);
router.post("/cards", addCard);
router.put("/cards/:cardId/block", blockCard);

export default router;
