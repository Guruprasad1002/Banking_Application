import express from 'express';
import userRouter from './Routers/userRouter.js';  // Add this import
import customerRouter from './Routers/customerRouter.js';
import employeeRouter from './Routers/employeeRouter.js';
import adminRouter from "./Routers/adminRouter.js";
import cors from 'cors';

const App = express();
App.use(cors());
App.use(express.json())
App.use(express.urlencoded({extended:true}))

App.use("/api/users", userRouter); 
App.use("/api/customer", customerRouter);
App.use("/api/employee", employeeRouter);
App.use("/api/admin", adminRouter);


export default App