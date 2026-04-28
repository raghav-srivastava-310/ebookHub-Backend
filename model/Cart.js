import mongoose from "mongoose"

const cartSchema = new mongoose.Schema({
  userId:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"user",
    required:true,
  },
  products:[
   {
    productId:{
      type:mongoose.Schema.Types.ObjectId,
      ref:"books",
    },
    title:String,
    price:Number,
    quantity:{
      type:Number,
      default:1,
    },
   } ,
  ],
},{timestamps:true});

export default mongoose.model("cart",cartSchema);