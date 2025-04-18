import express from "express";
import { protect, authorizeRoles } from "../Middleware/authMiddleware.js";
import {
  getAllCustomers,
  acceptOrRejectAccount ,
  updateAccountStatus,
  searchCustomer,
  addBalanceToAccount ,
  getPendingTransactions,
  verifyTransaction,
  getSupportRequests,
  resolveSupportRequest,
  getAllLoans,
  updateLoanStatus,
  getCustomer
} from "../Controllers/employeeController.js";

const router = express.Router();

router.use(protect, authorizeRoles("employee"));

router.get("/accounts", getAllCustomers);
router.get("/accounts/search/:search", searchCustomer);
router.get("/accounts/:id",getCustomer);
router.put("/accounts/verify", acceptOrRejectAccount);
router.put("/accounts/add-balance", addBalanceToAccount);
router.put("/accounts/status", updateAccountStatus);
router.get("/transactions", getPendingTransactions);
router.put("/transactions/verify", verifyTransaction);
router.get("/support", getSupportRequests);
router.put("/support/resolve", resolveSupportRequest);
router.get("/loans", getAllLoans);
router.put("/loans/status", updateLoanStatus);



export default router;
