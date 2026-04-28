
import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import connectDB from './config/db.js';
import authRoutes from './routes/Authentication.js';
import bookRoutes from './routes/Books.js'
import cookieParser from 'cookie-parser';
import cartRoutes from './routes/Cart.js';
import adminAuthRoutes from './admin/routes/Authenticate.js'
import cors from 'cors';
import session from 'express-session';


const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(session({
  secret:"captchaSecretKey",
  resave:false,
  saveUninitialized:true,
})
);
app.use(cors({
  origin:"http://localhost:3000",
  credentials:true
}))
app.use('/api/auth',authRoutes);
app.use('/api',bookRoutes);
app.use('/api/cart',cartRoutes);
app.use('/api/admin',adminAuthRoutes);
app.listen(process.env.PORT,()=>{
  connectDB();
  console.log(`Server is running on port ${process.env.PORT}`);
})