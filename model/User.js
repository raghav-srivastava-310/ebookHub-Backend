import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  name:{
    type:String
  },
  email:{
    type:String,
    unique:true
  },
  password:{
    type:String
  },
  role:{
    type:String,
    default:"user"
  }
})
const User = mongoose.model("user",UserSchema);
export default User;