import React, { useContext, useEffect, useState } from "react";
import { shopContext } from "../context/ShopContext";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const Orders = () => {
  const navigate = useNavigate();
  const {backend_url, token, currency } = useContext(shopContext);
  const [orderData, setOrderData] = useState([])
  const [showReturnModal, setShowReturnModal] = useState(false)
  const [showCancelModal, setShowCancelModal] = useState(false)
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [returnReason, setReturnReason] = useState('')
  const [cancelReason, setCancelReason] = useState('')
  const [modalType, setModalType] = useState('return') // 'return' or 'cancel'
  const [userId, setUserId] = useState('')

  // Decode JWT token to get userId
  const decodeToken = (token) => {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(atob(base64).split('').map((c) => {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(''));
      return JSON.parse(jsonPayload);
    } catch (error) {
      console.log('Error decoding token:', error);
      return null;
    }
  };
  
  const fetchOrderData = async () => {
    try {
      if(!token){
        return null
      }
      // Decode token to get userId
      const decoded = decodeToken(token)
      if (decoded && decoded.id) {
        setUserId(decoded.id)
      }
      
      const res = await axios.post(backend_url+'/api/order/userorders',{},{headers:{token}})
      if(res.data.success){
        // Group orders by orderId, keeping order-level info with each order
        const ordersWithItems = res.data.orders.reverse().map((order) => ({
          orderId: order._id,
          status: order.status,
          payment: order.payment,
          paymentMethod: order.paymentMethod,
          date: order.date,
          amount: order.amount,
          address: order.address,
          returnStatus: order.returnStatus || 'none',
          returnRequestDate: order.returnRequestDate,
          returnReason: order.returnReason,
          items: order.items.map((item) => ({
            ...item,
            orderId: order._id,
            status: order.status,
            payment: order.payment,
            paymentMethod: order.paymentMethod,
            date: order.date,
            returnStatus: order.returnStatus || 'none',
            returnRequestDate: order.returnRequestDate,
            returnReason: order.returnReason,
          }))
        }))
        setOrderData(ordersWithItems)
      }
    } catch (error) {
      console.log(error)
      toast.error(error.message)
    }
  }
  
  useEffect(() => {
    fetchOrderData()
  }, [token])

  // Check if order is eligible for return (within 7 days)
  const isEligibleForReturn = (orderDate) => {
    const orderDateObj = new Date(orderDate)
    const currentDate = new Date()
    const daysDifference = Math.floor((currentDate - orderDateObj) / (1000 * 60 * 60 * 24))
    return daysDifference <= 7
  }

  // Handle return request
  const handleReturnRequest = async () => {
    if (!returnReason.trim()) {
      toast.error("Please provide a reason for return")
      return
    }

    try {
      const res = await axios.post(
        backend_url + '/api/order/return',
        {
          orderId: selectedOrder.orderId,
          itemId: selectedOrder._id,
          reason: returnReason,
          userId: userId
        },
        { headers: { token } }
      )

      if (res.data.success) {
        toast.success(res.data.message)
        setShowReturnModal(false)
        setReturnReason('')
        setSelectedOrder(null)
        fetchOrderData() // Refresh orders
      } else {
        toast.error(res.data.message)
      }
    } catch (error) {
      console.log(error)
      toast.error(error.response?.data?.message || error.message)
    }
  }

  // Handle order cancellation
  const handleOrderCancellation = async () => {
    if (!cancelReason.trim()) {
      toast.error("Please provide a reason for cancellation")
      return
    }

    try {
      const res = await axios.post(
        backend_url + '/api/order/cancel',
        {
          orderId: selectedOrder.orderId,
          itemId: selectedOrder._id,
          reason: cancelReason,
          userId: userId
        },
        { headers: { token } }
      )

      if (res.data.success) {
        toast.success(res.data.message)
        setShowCancelModal(false)
        setCancelReason('')
        setSelectedOrder(null)
        fetchOrderData() // Refresh orders
      } else {
        toast.error(res.data.message)
      }
    } catch (error) {
      console.log(error)
      toast.error(error.response?.data?.message || error.message)
    }
  }

  const openReturnModal = (order) => {
    setSelectedOrder(order)
    setModalType('return')
    setShowReturnModal(true)
  }

  const openCancelModal = (order) => {
    setSelectedOrder(order)
    setModalType('cancel')
    setShowCancelModal(true)
  }
  
  return (
    <div className="border-t pt-16">
      <div className="text-2xl">
        <div className="flex justify-start">
          <div className="flex gap-2 pt-8 uppercase items-center justify-center">
            <h1 className="text-3xl font-semibold text-neutral-400">My</h1>
            <h1 className="text-3xl font-semibold text-neutral-700">orders</h1>
            <p className="w-8 md:w-11 h-[2.5px] bg-neutral-700"></p>
          </div>
        </div>
      </div>
      <div>
        {orderData.length === 0 ? (
          <div className="py-16 text-center">
            <p className="text-xl text-gray-500 font-medium">No orders</p>
            <button
              onClick={() => navigate("/collection")}
              className="mt-4 bg-black text-white uppercase px-8 py-3 text-sm rounded cursor-pointer hover:bg-neutral-700 transition-colors"
            >
              Start Shopping
            </button>
          </div>
        ) : (
          orderData.map((order, orderIdx) => {
          const canReturn = isEligibleForReturn(order.date) && order.returnStatus === 'none'
          const returnStatusLabels = {
            'none': '',
            'requested': 'Return Requested',
            'approved': 'Return Approved',
            'rejected': 'Return Rejected',
            'completed': 'Return Completed'
          }
          
          return (
            <div key={order.orderId} className="mb-6 border-2 border-gray-200 rounded-lg p-4">
              {/* Order Header */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 pb-4 border-b">
                <div>
                  <p className="text-sm text-gray-500">Order ID: <span className="font-medium text-gray-700">{order.orderId.slice(-8)}</span></p>
                  <p className="text-sm text-gray-500 mt-1">Date: <span className="text-gray-700">{new Date(order.date).toDateString()}</span></p>
                  <p className="text-sm text-gray-500 mt-1">Payment: <span className="text-gray-700">{order.paymentMethod}</span></p>
                  <p className="text-sm text-gray-500 mt-1">Total: <span className="font-semibold text-gray-900">{currency}{order.amount}</span></p>
                </div>
                <div className="mt-2 sm:mt-0 flex items-center gap-2">
                  <p className={`min-w-2 h-2 rounded-full ${
                    order.status === 'cancelled' || order.status === 'returned' ? 'bg-red-500' : 'bg-green-500'
                  }`}></p>
                  <p className="text-sm md:text-base font-medium">{order.status}</p>
                  {order.returnStatus !== 'none' && (
                    <span className={`ml-2 px-2 py-1 text-xs rounded ${
                      order.returnStatus === 'approved' ? 'bg-green-100 text-green-700' :
                      order.returnStatus === 'rejected' ? 'bg-red-100 text-red-700' :
                      order.returnStatus === 'completed' ? 'bg-blue-100 text-blue-700' :
                      'bg-yellow-100 text-yellow-700'
                    }`}>
                      {returnStatusLabels[order.returnStatus]}
                    </span>
                  )}
                  {order.status === 'cancelled' && (
                    <span className="ml-2 px-2 py-1 text-xs bg-red-100 text-red-700 rounded">
                      Cancelled
                    </span>
                  )}
                  {order.status === 'returned' && (
                    <span className="ml-2 px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded">
                      Returned
                    </span>
                  )}
                </div>
              </div>
              
              {/* Order Items */}
              <div className="space-y-3">
                {order.items.map((item, itemIdx) => (
                  <div key={`${order.orderId}-${itemIdx}`} className="py-3 border-b last:border-b-0 text-gray-700 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div className="flex items-start gap-6 text-sm">
                      <img className="w-16" src={item.image[0]} alt={item.name}></img>
                      <div>
                        <p className="sm:text-base font-medium">{item.name}</p>
                        <div className="flex items-center gap-3 mt-2 text-base text-gray-700">
                          <p>{currency}{item.price}</p>
                          <p>Quantity: {item.quantity}</p>
                          <p>Size: {item.size}</p>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      {order.status !== 'delivered' && order.status !== 'cancelled' && order.returnStatus === 'none' && (
                        <button 
                          onClick={() => openCancelModal({...item, orderId: order.orderId, date: order.date})}
                          className="border border-gray-400 text-gray-600 px-4 py-2 text-sm font-medium rounded-sm hover:bg-gray-50 transition-colors"
                        >
                          Cancel
                        </button>
                      )}
                      {order.status === 'delivered' && canReturn && order.returnStatus === 'none' && (
                        <button 
                          onClick={() => openReturnModal({...item, orderId: order.orderId, date: order.date})}
                          className="border border-red-500 text-red-500 px-4 py-2 text-sm font-medium rounded-sm hover:bg-red-50 transition-colors"
                        >
                          Return
                        </button>
                      )}
                      {!canReturn && order.returnStatus === 'none' && order.status === 'delivered' && (
                        <p className="text-xs text-gray-400 self-center">Return period expired</p>
                      )}
                      <button className="border px-4 py-2 text-sm font-medium rounded-sm">Tracking live</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )
        }))}
      </div>

      {/* Return Request Modal */}
      {showReturnModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h2 className="text-2xl font-semibold mb-4">Request Return</h2>
            {selectedOrder && (
              <div className="mb-4">
                <div className="flex gap-4 mb-4">
                  <img className="w-20 h-20 object-cover" src={selectedOrder.image[0]} alt={selectedOrder.name} />
                  <div>
                    <p className="font-medium">{selectedOrder.name}</p>
                    <p className="text-sm text-gray-600">Size: {selectedOrder.size}</p>
                    <p className="text-sm text-gray-600">Quantity: {selectedOrder.quantity}</p>
                    <p className="text-sm text-gray-600">{currency}{selectedOrder.price}</p>
                  </div>
                </div>
                <p className="text-sm text-gray-600 mb-2">
                  Order Date: {new Date(selectedOrder.date).toDateString()}
                </p>
                <p className="text-xs text-gray-500 mb-4">
                  Return Policy: 7 days from order date
                </p>
              </div>
            )}
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Reason for Return *</label>
              <textarea
                value={returnReason}
                onChange={(e) => setReturnReason(e.target.value)}
                className="w-full border rounded-md p-2 h-24 resize-none"
                placeholder="Please provide a reason for your return request..."
              />
            </div>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => {
                  setShowReturnModal(false)
                  setReturnReason('')
                  setSelectedOrder(null)
                }}
                className="px-4 py-2 border rounded-md hover:bg-gray-50"
              >
                Close
              </button>
              <button
                onClick={handleReturnRequest}
                className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
              >
                Submit Return Request
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Cancel Order Modal */}
      {showCancelModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h2 className="text-2xl font-semibold mb-4">Cancel Order</h2>
            {selectedOrder && (
              <div className="mb-4">
                <div className="flex gap-4 mb-4">
                  <img className="w-20 h-20 object-cover" src={selectedOrder.image[0]} alt={selectedOrder.name} />
                  <div>
                    <p className="font-medium">{selectedOrder.name}</p>
                    <p className="text-sm text-gray-600">Size: {selectedOrder.size}</p>
                    <p className="text-sm text-gray-600">Quantity: {selectedOrder.quantity}</p>
                    <p className="text-sm text-gray-600">{currency}{selectedOrder.price}</p>
                  </div>
                </div>
                <p className="text-sm text-gray-600 mb-2">
                  Order Date: {new Date(selectedOrder.date).toDateString()}
                </p>
              </div>
            )}
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Reason for Cancellation *</label>
              <textarea
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                className="w-full border rounded-md p-2 h-24 resize-none"
                placeholder="Please provide a reason for cancelling your order..."
              />
            </div>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => {
                  setShowCancelModal(false)
                  setCancelReason('')
                  setSelectedOrder(null)
                }}
                className="px-4 py-2 border rounded-md hover:bg-gray-50"
              >
                Close
              </button>
              <button
                onClick={handleOrderCancellation}
                className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
              >
                Cancel Order
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Orders;
