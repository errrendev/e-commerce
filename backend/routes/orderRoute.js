import express from 'express'
import { allOrders, placeOrder, placeOrderRazorpay, placeOrderStripe, updateStatus, userOrders, requestReturn, updateReturnStatus, cancelOrder } from '../controllers/orderController.js'
import adminAuth from '../middlewares/adminAuth.js'
import userAuth from '../middlewares/auth.js'

const orderRouter = express.Router()

// admin features
orderRouter.post('/list',adminAuth,allOrders)
orderRouter.post('/status',adminAuth, updateStatus)
orderRouter.post('/return-status',adminAuth, updateReturnStatus)

// payment featureed
orderRouter.post('/place',userAuth,placeOrder)
orderRouter.post('/stripe',userAuth,placeOrderStripe)
orderRouter.post('/razorpay',userAuth,placeOrderRazorpay)

// user features
orderRouter.post('/userorders',userAuth,userOrders)
orderRouter.post('/return',userAuth,requestReturn)
orderRouter.post('/cancel',userAuth,cancelOrder)

export default orderRouter