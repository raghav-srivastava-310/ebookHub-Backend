

//Add to cart functionality

import Cart from "../model/Cart.js";

export const addToCart = async(req,res)=>{
  try {
    const userId = req.user.id;
    const item = req.body;
    let cart = await Cart.findOne({userId});
    if(!cart){
      cart = new Cart({userId,products:[item]})
    }
    else{
      const existing = cart.products.find((p)=>p.productId.toString()===item.productId);
      if(existing){
        existing.quantity += 1;
      }
      else{
        cart.products.push(item);
      }
    }
    await cart.save();
    res.json({message:"Item added to cart",cart});
  } catch (error) {
    console.error(error);
    res.status(500).json({message:"Internal server error"});
  }
}

//Get Cart Functionality

export const getCart = async (req,res)=>{
  try {
    const userId = req.user.id;
    const cart = await Cart.findOne({userId}).populate("products.productId");
    res.status(200).json(cart||{products:[]});
  } catch (error) {
    console.error(error);
    res.status(500).json({message:"Internal server error"});
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