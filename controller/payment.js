import Razorpay from 'razorpay';
import crypto from 'crypto';
import Cart from '../model/Cart.js';

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret:process.env.RAZORPAY_KEY_SECRET,
});

// Create Order

export const createOrder = async (req,res)=>{
  try {
    const userId = req.user.id;
   
    // Always fetch the latest cart items from the database(not from the request body) to ensure accurate pricing

    const cart = await Cart.findOne({userId});

    if(!cart || cart.products.length === 0){
      return res.status(400).json({message:"Cart is empty",success:false});
    }

    const totalAmount = cart.products.reduce((sum,item)=>sum+item.price*item.quantity,0);

    const options = {
      amount:totalAmount*100, // Amount in paise
      currency:"INR",
      receipt:"order_"+Date.now(),
    };

    const order = await razorpay.orders.create(options);
    res.json({order,success:true});

  } catch (error) {
    res.status(500).json({message:"Internal server error",success:false});
  }
}

// Verify Payment

export const verifyPayment = async (req,res)=>{
  try {
      const {razorpay_order_id,razorpay_payment_id,razorpay_signature}=req.body;

      const body = razorpay_order_id + "|" + razorpay_payment_id;

      const expected = crypto
      .createHmac("sha256",process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest("hex");

      if(expected === razorpay_signature){
        //Payment Success Clear Cart
        const userId = req.user.id;
        await Cart.findOneAndUpdate({userId},{products:[]});
        res.json({message:"Payment verified successfully",success:true});
      }else{
        res.status(400).json({message:"Invalid signature",success:false});
      }
  } catch (error) {
    res.status(500).json({message:"Internal server error",success:false});
  }
}