import mongoose from "mongoose";

const booksSchema = new mongoose.Schema({
  title:{
    type:String,
    required:true
  },
  description:{
    type:String
  },
  price:Number,
  maxPrice:Number,
  rating:{
    type:Number,
    min:0,
    max:5,
    default:3.8
  },
  pdf:String,
  category:String,
  bookCover:String
})
export default mongoose.model('books',booksSchema)