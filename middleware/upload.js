import multer from "multer";

const storage = multer.memoryStorage();

const upload = multer({
  storage,
  fileFilter:(req,file,cb)=>{
    if(file.mimetype === "application/pdf"||file.mimetype.startsWith("image/")){
      cb(null,true);
    }else{
      cb(new Error("Only Pdf allowed and Images allowed"),false)
    }
  },
  limits:{fileSize:20*1024*1024} //20MB
});

export default upload;