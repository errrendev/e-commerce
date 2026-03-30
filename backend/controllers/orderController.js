import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";
import Stripe from "stripe";
// global variables
const currency = 'inr'
const delivery_charges = 10

// gateway initialized
// const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Placing order using COD method
const placeOrder = async (req, res) => {
  try {
    const { userId, items, amount, address } = req.body;
    const orderData = {
      userId,
      items,
      amount,
      address,
      paymentMethod: "cod",
      payment: false,
      date: Date.now(),
    };

    const newOrder = new orderModel(orderData);
    await newOrder.save();

    await userModel.findByIdAndUpdate(userId, { cartData: {} });

    res.json({ success: true, message: "order Placed" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// place order using stripe
const placeOrderStripe = async (req, res) => {
  try {
    const { userId, items, amount, address } = req.body;
    const { origin } = req.headers;
    const orderData = {
      userId,
      items,
      amount,
      address,
      paymentMethod: "Stripe",
      payment: false,
      date: Date.now(),
    };

    const newOrder = new orderModel(orderData);
    await newOrder.save();

    const line_items = items.map((item) => ({
      price_data:{
        currency:currency,
        product_data:{
          name:item.name
        },
        unit_amount:item.price * 100
      },
      quantity:item.quantity 
    }))

    line_items.push({
      price_data:{
        currency:currency,
        product_data:{
          name:"Delivery Charges"
        },
        unit_amount:delivery_charges * 100
      },
      quantity:1
    })

    const session = await stripe.checkout.sessions.create({
      success_url:`${origin}/verify?success=true&orderId=${newOrder._id}`,
      cancel_url:`${origin}/verify?success=false&orderId=${newOrder._id}`,
      line_items,
      mode:'payment',
    })

    res.json({success:true, session_url:session.url})

  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// place order using razorpay
const placeOrderRazorpay = async (req, res) => {};

// All orders data for admin panel
const allOrders = async (req, res) => {
  try {
    const orders = await orderModel.find({}).sort({ date: -1 });
    res.json({ success: true, orders });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// user order data for frontend
const userOrders = async (req, res) => {
  try {
    const { userId } = req.body;
    const orders = await orderModel.find({ userId });
    res.json({ success: true, orders });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// update order status from admin panel
const updateStatus = async (req, res) => {
  try {
    const { orderId, status } = req.body;
    await orderModel.findByIdAndUpdate(orderId, { status });
    res.json({ success: true, message: "status updated" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// Request return for an order item (7-day policy)
const requestReturn = async (req, res) => {
  try {
    const { orderId, itemId, reason, userId } = req.body;

    // Find the order
    const order = await orderModel.findById(orderId);
    if (!order) {
      return res.json({ success: false, message: "Order not found" });
    }

    // Verify user owns the order
    if (order.userId !== userId) {
      return res.json({ success: false, message: "Unauthorized access" });
    }

    // Check if return is already requested
    if (order.returnStatus !== 'none') {
      return res.json({ success: false, message: "Return already requested for this order" });
    }

    // Check 7-day return policy
    const orderDate = new Date(order.date);
    const currentDate = new Date();
    const daysDifference = Math.floor((currentDate - orderDate) / (1000 * 60 * 60 * 24));

    if (daysDifference > 7) {
      return res.json({ 
        success: false, 
        message: `Return request cannot be processed. Order is ${daysDifference} days old. Return policy is 7 days.` 
      });
    }

    // Update order with return request
    await orderModel.findByIdAndUpdate(orderId, {
      returnStatus: 'requested',
      returnRequestDate: Date.now(),
      returnReason: reason || 'No reason provided'
    });

    res.json({ success: true, message: "Return request submitted successfully" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// Update return status (admin function)
const updateReturnStatus = async (req, res) => {
  try {
    const { orderId, returnStatus } = req.body;
    
    if (!['requested', 'approved', 'rejected', 'completed'].includes(returnStatus)) {
      return res.json({ success: false, message: "Invalid return status" });
    }

    // If return is completed, also update order status to 'returned'
    const updateData = { returnStatus };
    if (returnStatus === 'completed') {
      updateData.status = 'returned';
    }

    await orderModel.findByIdAndUpdate(orderId, updateData);
    res.json({ success: true, message: "Return status updated" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// Cancel order directly (before delivery)
const cancelOrder = async (req, res) => {
  try {
    const { orderId, itemId, reason, userId } = req.body;

    // Find the order
    const order = await orderModel.findById(orderId);
    if (!order) {
      return res.json({ success: false, message: "Order not found" });
    }

    // Verify user owns the order
    if (order.userId !== userId) {
      return res.json({ success: false, message: "Unauthorized access" });
    }

    // Check if order is already delivered
    if (order.status === 'delivered') {
      return res.json({ success: false, message: "Cannot cancel delivered orders. Please use return instead." });
    }

    // Check if order is already cancelled
    if (order.status === 'cancelled') {
      return res.json({ success: false, message: "Order is already cancelled" });
    }

    // Directly cancel the order
    await orderModel.findByIdAndUpdate(orderId, {
      status: 'cancelled',
      cancelRequestDate: Date.now(),
      cancelReason: reason || 'No reason provided'
    });

    res.json({ success: true, message: "Order cancelled successfully" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

export {
  placeOrder,
  placeOrderStripe,
  placeOrderRazorpay,
  allOrders,
  userOrders,
  updateStatus,
  requestReturn,
  updateReturnStatus,
  cancelOrder,
};