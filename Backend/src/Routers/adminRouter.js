    import express from "express";
    import { protect, authorizeRoles } from "../Middleware/authMiddleware.js";
    import { getAllUsers,
            addEmployee,
            updateUserStatus,
            getAllEmployees, 
            deleteEmployee,
            getDashboardReport,
            getAllLoans, 
            updateLoanStatus,
            getWeeklyTransactions
           } from "../Controllers/adminController.js";

    const router = express.Router();

    router.use(protect, authorizeRoles("admin"));
    router.get("/users", getAllUsers);
    router.post("/employees/add", addEmployee);
    router.put("/users/update-status", updateUserStatus);
    router.get("/employees", getAllEmployees);
    router.delete("/employees", deleteEmployee);
    router.get("/reports", getDashboardReport);
    router.get("/reports/transactions", getWeeklyTransactions);
    router.get("/loans", getAllLoans);
    router.put("/loans/status", updateLoanStatus);

    export default router;
