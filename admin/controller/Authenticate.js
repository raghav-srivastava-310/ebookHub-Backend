import UserModel from "../../model/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken"
export const login = async (req,res)=>{
  try {
    const {email,password}=req.body;
    const user = await UserModel.findOne({email});
    if(!user){
      return res.status(404).json({message:"User not found",success:false});
    }
    if(user.role !== "admin"){
      return res.status(403).json({message:"Access denied. Admin privileges required.",success:false});
    }
    const isPasscheck = await bcrypt.compare(password,user.password);
    if(!isPasscheck){
      return res.status(400).json({message:"Invalid credentials",success:false});
    }
    const adminToken = jwt.sign({id:user._id,role:user.role},process.env.ACCESS_TOKEN_SECRET,{expiresIn:"1d"});
    const isProduction = process.env.NODE_ENV === "production";
    res.cookie("adminToken",adminToken,{
      httpOnly:true,
      secure:isProduction,
      sameSite:isProduction ? "none" : "lax",
      maxAge:24*60*60*1000
    });
    res.status(200).json({message:"Welcome To admin panel",success:true,token:adminToken});

  } catch (error) {
    res.status(500).json({ message: error.message,success:false  });
  }
}
export const getAdminDetails = async (req,res)=>{
  try {
    const userId = req.user.id;
    const user = await UserModel.findById(userId).select("-password");
    if(!user){
      return res.status(404).json({message:"Admin not found",success:false});
    }
    res.status(200).json({message:"Admin details retrieved successfully",success:true,data:user});
  } catch (error) {
    res.status(500).json({ message: error.message,success:false });
  }
}
export const logout = async (req,res)=>{
  try {
    res.clearCookie("adminToken",{
      httpOnly:true,
      secure:process.env.NODE_ENV === "production",
      sameSite:process.env.NODE_ENV === "production" ? "none" : "lax",
    });
    res.status(200).json({message:"Logged out successfully",success:true});
  }
    catch (error) { 
      res.status(500).json({ message: error.message,success:false });
    }
}