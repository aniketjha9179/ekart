import Razorpay from "razorpay";
import Order from "../models/orderModel.js";
import crypto from "crypto";
import Transaction from "../models/transactionModel.js";
// import items from "razorpay/dist/types/items.js";
// import products from "razorpay/dist/types/products.js";

const createTransaction = async (req, res) => {
  const { amount, userId } = req.body;

  const razorpay = new Razorpay({
    key_id: process.env.RAZOR_PAY_KEY_ID,
    key_secret: process.env.RAZOR_PAY_SECRET,
  });
  const options = {
    amount: amount,
    currency: "INR",
    receipt: `receipt#${Date.now()}`,
  };
  try {
    if (!amount || !userId) {
      return res.status(400).json({
        success: false,
        message: "amount and user id required ",
        error: err.message,
      });
    }
    const razorpayOrder = await razorpay.orders.create(options);
    res.status(201).json({
      success: true,
      message: "Order created successfully",
      key: process.env.RAZOR_PAY_KEY_ID,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
      order_id: razorpayOrder.id,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to create order",
      error: err.message,
    });
  }
};

const createOrder = async (req, res) => {
  const {
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature,
    userId,
    cartItems,
    deliveryDate,
    address,
  } = req.body;

  const key_secret = process.env.RAZOR_PAY_SECRET;
  const generated_Signature = crypto
    .createHmac("sha256", key_secret)
    .update(razorpay_order_id + "|" + razorpay_payment_id).digest("hex")
    if(generated_Signature===razorpay_signature){
        try {
            const transaction= await Transaction.create({
                user:userId,
                orderId:razorpay_order_id,
                paymemtId:razorpay_payment_id,
                status:"Success",
                amount:cartItems.reduce((total,item)=>total+item?.quantity*item.price,0)

            })
            const order =  await Order.create({
                user:userId,
                address,
                deliveryDate,
                items:cartItems?.map((item)=>({
                     products:item?._id,
                     quantity:item?.quantity
                })),
                status:"Order Placed"
            })
            transaction.order= order._id
            await transaction.save();
            res.json({
                success:true,
                message:"Payment Verified and Order Created",
                order
            })
            
        } catch (error) {
            res.status(500).json({
                success:false,
                message:"Failed to create a transaction or order",
                error,
            })
        }
    }
};

const  getOrdersByUserId= async(req,res)=>{
    const {userId} = req.params;
    try {
        const orders = await order.find({user:userId})
        .populate("user","name email")
        .populate("item.product", "name price,image_uri ar_uri")
        .sort({createdAt:-1});


        if(!orders || orders.length===0){
            return res.status(404).json({
                success:false,
                message:"No order found for this user",

            });
        }else{
            res.json(200).json({
                success:true,
                orders,
            });
          
        }

        
    } catch (error) {
        
        res.status(500).json({
            success:false,
            message:"Failed to receive order",
            error:err.message
        })
    }


}
export { createTransaction,getOrdersByUserId , createOrder};
