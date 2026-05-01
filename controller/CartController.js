

//Add to cart functionality

import Cart from "../model/Cart.js";

export const addToCart = async(req,res)=>{
  try {
    const userId = req.user.id;
    const item = req.body;
    // console.log("Add to cart item:", item);
    let cart = await Cart.findOne({userId});
    if(!cart){
      cart = new Cart({userId,products:[{productId:item._id,title:item.title,price:item.price}]});
    }
    else{
      const existing = cart.products.find((p)=>p.productId.toString()===item._id);
      
      if(existing){
        existing.quantity += 1;
      } 
      else{
        cart.products.push({productId:item._id,title:item.title,price:item.price});
      } 
    }
    await cart.save();
    res.json({message:"Item added to cart",cart,success:true});
  } catch (error) {
    console.error(error);
    res.status(500).json({message:"Internal server error",success:false });
  }
}

//Get Cart Functionality

export const getCart = async (req,res)=>{
  try {
    const userId = req.user.id;
    const cart = await Cart.findOne({userId}).populate("products.productId");
    res.status(200).json({cart,success:true}||{products:[],success:true});
  } catch (error) {
    console.error(error);
    res.status(500).json({message:"Internal server error",success:false});
  }
}

//Remove Item 

export const removeItem = async (req,res)=>{
  try {
    const userId = req.user.id;
    const {id} = req.params;
    const cart = await Cart.findOne({userId});
    cart.products = cart.products.filter((p)=>p.productId.toString() !== id);
    await cart.save();
    res.json({message:"Remove Item",cart});
  } catch (error) {
    res.status(500).json({error:error.message});
  }
}

export const updateQuantity = async (req,res)=>{
  try {
    const userId = req.user.id;
    const {id} = req.params;
    const {quantity} = req.body;
    const cart = await Cart.findOne({userId});
    const item = cart.products.find((p)=>p.productId.toString() === id);
    if (item) {
      item.quantity = quantity;
      await cart.save();
      res.json({message:"Quantity updated",cart});
    } else {
      res.status(404).json({message:"Item not found"});
    }
  } catch (error) {
    console.log("Error updating quantity:", error.message);
    res.status(500).json({error:error.message});
  }
}