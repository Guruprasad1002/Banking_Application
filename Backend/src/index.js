import http from 'http';
import 'dotenv/config';
import App from './App.js';
import connectDB from './Database/db.connect.js';
const server=http.createServer(App);

const PORT=process.env.PORT
 
connectDB().then(()=>{
server.listen(PORT,()=>{
    console.log(`Server is running on ${PORT}`)
})
})