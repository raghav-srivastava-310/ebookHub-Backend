import jwt from "jsonwebtoken";

const AuthenticateAdmin = (req,res,next)=>{
    try {
        const token = req.cookies.adminToken;
        if(!token){
            return res.status(401).json({message:"Unauthorized access. Admin token missing.",success:false});
        }
        const decoded = jwt.verify(token,process.env.ACCESS_TOKEN_SECRET);
        if(decoded.role !== "admin"){
            return res.status(403).json({message:"Access denied. Admin privileges required.",success:false});
        }
        req.user = decoded;
        next();
    } catch (error) {
        res.status(401).json({message:"Invalid token",success:false});
    }
}

export default AuthenticateAdmin;