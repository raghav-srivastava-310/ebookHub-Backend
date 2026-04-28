import cloudinary from "../config/cloudinary.js";
import BooksModel from "../model/Books.js"

export const createBooks = async(req,res)=>{
try {
  let pdfUrl = "";
  let imageUrl = "";
  //PDF Upload
  if(req.files?.pdf){
    const pdfFile = req.files.pdf[0];
    const b64 = Buffer.from(pdfFile.buffer).toString("base64");
    const dataURI = `data:${pdfFile.mimetype};base64,${b64}`;
    const result = await cloudinary.uploader.upload(dataURI,{
      resource_type:"raw",//For Pdf
      folder:"EbookHubBooks/pdf"
    });
    pdfUrl = result.secure_url;
  }
  if(req.files?.image){
    const imageFile = req.files.image[0];
    const b64 = Buffer.from(imageFile.buffer).toString("base64");
    const dataURI = `data:${imageFile.mimetype};base64,${b64}`;
    const result = await cloudinary.uploader.upload(dataURI,{
      folder:"EbookHubBooks/images"
    });
    imageUrl = result.secure_url;
  }
    const newBooks = await BooksModel.create({...req.body,
      pdf:pdfUrl,bookCover:imageUrl});
    return res.status(201).json({message:"Books Create Successfully",success:true,newBooks});
} catch (error) {
  console.log("Error:", error.message);
  res.status(500).json({message:"Internal Server Error",success:false})
}
}
export const getBooks = async(req,res)=>{
  try {
    const books = await BooksModel.find();
    res.status(200).json(books)
  } catch (error) {
      res.status(500).json({message:"Internal Server Error",success:false})
  }
}
export const deleteBooks = async(req,res)=>{
try {
    const {id} = req.params;
  const updatedBooks = await BooksModel.findByIdAndDelete(id);
  return res.status(200).json({message:"Book deleted successfully",success:true,updatedBooks})
} catch (error) {
  console.log(error.message)
      res.status(500).json({message:"Internal Server Error",success:false})
}
  
}
export const updateBook = async(req,res)=>{
  try {
    const updateBook = await BooksModel.findByIdAndUpdate(req.params.id,req.body,{new:true});
    return res.status(200).json({message:"Books Update successfully",updateBook,success:true})
  } catch (error) {
    console.log(error.message)
        res.status(500).json({message:"Internal Server Error",success:false})
  }
}