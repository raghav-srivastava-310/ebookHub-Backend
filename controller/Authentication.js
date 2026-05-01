import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken"
import UserModel from "../model/User.js"
import { OAuth2Client } from "google-auth-library"
import svgCaptcha from "svg-captcha"
export const signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    // if(userCaptcha !== req.session.captcha){
    //   return res.status(400).json({message:"Invalid Captcha",success:false})
    // }
    // req.session.captcha = null;
    const user = await UserModel.findOne({ email });
    if (user) {
      return res.status(403).json({ message: "User Already Exist", success: false });
    }
    const hasspass = await bcrypt.hash(password, 10);
    const newUser = await UserModel.create({
      name,
      email,
      password: hasspass
    });
    return res.status(201).json({ message: "Signup Successfully", success: true })
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ message: "Internal Server Error", success: false })
  }
}
export const signin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.status(403).json({ message: "User Not Found Please Signup", success: false })
    }
    const isPass = await bcrypt.compare(password, user.password);
    if (!isPass) {
      return res.status(401).json({ message: "The credential Are not matched", success: false });
    }
    const accessToken = jwt.sign({ id: user._id, email: user.email, name: user.name }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "1d" });
    const isProduction = process.env.NODE_ENV === "production";
    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? "none" : "lax",
      maxAge: 24 * 60 * 60 * 1000
    })
    return res.status(200).json({ message: "Signin Successfully", success: true, accessToken })
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ message: "Internal Server Error", success: false })
  }
}
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
export const googleAuth = async (req, res) => {
  try {
    const { token } = req.body;
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID
    })
    const { name, email } = ticket.getPayload();
    const user = await UserModel.findOne({ email });
    if (user) {
      const accessToken = jwt.sign({ id: user._id, email: user.email, name: user.name }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "1d" })
      const isProduction = process.env.NODE_ENV === "production";

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? "none" : "lax",
      maxAge: 24 * 60 * 60 * 1000
    });
      return res.status(200).json({ message: "Signin Successfully", success: true, accessToken })
    }
    const newUser = await UserModel.create({
      name,
      email,
      password: ""
    })
    const accessToken = jwt.sign({ email: newUser.email, name: newUser.name }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "1d" })
    const isProduction = process.env.NODE_ENV === "production";

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? "none" : "lax",
      maxAge: 24 * 60 * 60 * 1000
    });
    return res.status(201).json({ message: "Signup Successfully", success: true, accessToken })
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ message: "Internal Server Error", success: false })
  }
}
export const getUser = async (req, res) => {
  try {
    const { email, name } = req.user
    return res.status(203).json({
      message: "User fetched", success: true, userDetail: {
        userEmail: email,
        userName: name
      }
    })
  } catch (error) {
    console.log("Error while fetch user:", error.message);
    return res.status(500).json({ message: "Internal Server Error", success: false })
  }
}