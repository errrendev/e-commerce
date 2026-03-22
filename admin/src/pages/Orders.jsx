import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import axios from "axios";
import { backendUrl, currency } from "../App";
import { toast } from "react-toastify";
import { assets } from "../assets/admin_assets/assets";

const Orders = ({ token }) => {
  const [orders, setOrders] = useState([]);
  const fetchAllOrders = async () => {
    try {
      if (!token) {
        return null;
      }
      const res = await axios.post(
        backendUrl + "/api/order/list",
        {},
        { headers: { token } }
      );
      if (res.data.success) {
        setOrders(res.data.orders);
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  const statusHandler = async (value, orderId) => {
    const res = await axios.post(backendUrl+'/api/order/status',{orderId, status:value},{headers:{token}})
    try {
      if(res.data.success){
        await fetchAllOrders()
      }
    } catch (error) {
      console.log(error);
      toast.error(res.data.message);
    }
  }

  const returnStatusHandler = async (value, orderId) => {
    try {
      const res = await axios.post(
        backendUrl + '/api/order/return-status',
        { orderId, returnStatus: value },
        { headers: { token } }
      );
      if (res.data.success) {
        toast.success(res.data.message);
        await fetchAllOrders();
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || error.message);
    }
  }

  useEffect(() => {
    fetchAllOrders();
  }, [token]);

  return (
    <div>
      <h3>Orders page</h3>
      <div>
        {orders.map((order, idx) => {
          return (
            <div className="grid grid-cols-1 sm:grid-cols-[0.5fr_2fr_1fr] lg:grid-cols-[0.5fr_2fr_1fr_1fr_1fr] gap-3 items-start border-2 border-gray-200 p-5 md:p-8 my-3 md:my-4 text-xs sm:text-sm text-gray-700" key={idx}>
              <img className="w-12" src={assets.parcel_icon}></img>
              <div>
                <div>
                  {order.items.map((item, idx) => {
                    if (idx === order.items.length - 1) {
                      return (
                        <p key={idx} className="py-0.5">
                          {item.name} X {item.quantity} <span>{item.size}</span>
                        </p>
                      );
                    } else {
                      return (
                        <p key={idx} className="py-0.5">
                          {item.name} X {item.quantity}{" "}
                          <span>{item.size},</span>
                        </p>
                      );
                    }
                  })}
                </div>
                <p className="mt-3 mb-2 font-medium">{order.address.firstName + " " + order.address.lastName}</p>
                <div>
                  <p>{order.address.street + ","}</p>
                  <p>
                    {order.address.city +
                      ", " +
                      order.address.state +
                      ", " +
                      order.address.country +
                      ", " +
                      order.address.zipcode}
                  </p>
                </div>
                <p>{order.address.phone}</p>
              </div>
              <div>
                <p className="text-sm sm:text-[15px]">items: {order.items.length}</p>
                <p className="mt-3">method: {order.paymentMethod}</p>
                <p>{order.payment ? "done" : "pending"}</p>
                <p>Date: {new Date(order.date).toLocaleDateString()}</p>
                {order.returnStatus && order.returnStatus !== 'none' && (
                  <div className="mt-2">
                    <p className="text-xs font-semibold text-orange-600">
                      Return: {order.returnStatus}
                    </p>
                    {order.returnReason && (
                      <p className="text-xs text-gray-600 mt-1">
                        Reason: {order.returnReason}
                      </p>
                    )}
                  </div>
                )}
                {order.status === 'cancelled' && (
                  <div className="mt-2">
                    <p className="text-xs font-semibold text-red-600">
                      Order Cancelled
                    </p>
                    {order.cancelReason && (
                      <p className="text-xs text-gray-600 mt-1">
                        Reason: {order.cancelReason}
                      </p>
                    )}
                  </div>
                )}
                {order.status === 'returned' && (
                  <div className="mt-2">
                    <p className="text-xs font-semibold text-blue-600">
                      Order Returned
                    </p>
                    {order.returnStatus === 'completed' && (
                      <p className="text-xs text-gray-600 mt-1">
                        Return Completed
                      </p>
                    )}
                  </div>
                )}
              </div>
              <p className="text-sm sm:text-[15px]">
                {currency} {order.amount}
              </p>
              <div className="flex flex-col gap-2">
                <select 
                  onChange={(e)=>{statusHandler(e.target.value,order._id)}} 
                  value={order.status} 
                  className="p-2 font-semibold"
                  disabled={order.status === 'delivered' || order.status === 'cancelled' || order.status === 'returned' || (order.returnStatus && order.returnStatus === 'completed')}
                >
                  <option value="Order Placed">Order Placed</option>
                  <option value="Packing">Packing</option>
                  <option value="Shipped">Shipped</option>
                  <option value="Out for delivery">Out for delivery</option>
                  <option value="delivered">delivered</option>
                  <option value="cancelled">cancelled</option>
                  <option value="returned">returned</option>
                </select>
                {order.returnStatus && order.returnStatus !== 'none' && (
                  <select 
                    onChange={(e) => {returnStatusHandler(e.target.value, order._id)}} 
                    value={order.returnStatus || 'none'} 
                    className="p-2 font-semibold text-sm border-2 border-orange-300"
                    disabled={order.returnStatus === 'completed'}
                  >
                    <option value="requested">Return Requested</option>
                    <option value="approved">Approve Return</option>
                    <option value="rejected">Reject Return</option>
                    <option value="completed">Return Completed</option>
                  </select>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Orders;
