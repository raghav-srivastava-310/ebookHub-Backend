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
    const isPasscheck = bcrypt.compare(password,user.password);
    if(!isPasscheck){
      return res.status(400).json({message:"Invalid credentials",success:false});
    }
    const adminToken = jwt.sign({id:user._id,role:user.role},process.env.ACCESS_TOKEN_SECRET,{expiresIn:"1d"});
    res.status(200).json({message:"Welcome To admin panel",success:true,token:adminToken});

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}