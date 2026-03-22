import React, { useContext, useState } from "react";
import CartTotal from "../components/CartTotal";
import { assets } from "../assets/frontend_assets/assets";
import { useNavigate } from "react-router-dom";
import { shopContext } from "../context/ShopContext";
import axios from "axios";
import { toast } from "react-toastify";

const PlaceOrder = () => {
  const navigate = useNavigate();
  const {
    backend_url,
    token,
    cartItems,
    setCartItems,
    cartTotal,
    delivery_fee,
    products,
  } = useContext(shopContext);
  const [method, setMethod] = useState("cod");
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    street: "",
    city: "",
    state: "",
    zipcode: "",
    country: "",
    phone: "",
  });
  const onChangeHandler = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setFormData((data) => ({ ...data, [name]: value }));
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      let orderItems = [];
      for (const items in cartItems) {
        for (const item in cartItems[items]) {
          if (cartItems[items][item] > 0) {
            const itemInfo = structuredClone(
              products.find((product) => product._id === items)
            );
            if (itemInfo) {
              itemInfo.size = item;
              itemInfo.quantity = cartItems[items][item];
              orderItems.push(itemInfo);
            }
          }
        }
      }
      let orderData = {
        address: formData,
        items: orderItems,
        amount: cartTotal() + delivery_fee,
      };
      switch (method) {
        // api call for cod
        case "cod":
          console.log(orderData);
          const res = await axios.post(
            backend_url + "/api/order/place",
            orderData,
            { headers: { token } }
          );
          console.log(res);
          if (res.data.success) {
            setCartItems({});
            navigate("/orders");
          } else {
            toast.error(res.data.message);
          }
          break;
        case "stripe":
          const responseStripe = await axios.post(backend_url+'/api/order/stripe',orderData,{headers:{token}})
          if(responseStripe.data.success){
            const {session_url} = responseStripe.data
            window.location.replace(session_url)
          }else{
            toast.error(responseStripe.data.message)
          }
          break;
        default:
          break;
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  return (
    <form
      onSubmit={submitHandler}
      className="flex flex-col sm:flex-row justify-between gap-4 pt-5 sm:pt-14 min-h-[80vh] border-t"
    >
      <div className="flex flex-col gap-4 w-full sm:max-w-[480px]">
        <div className="text-xl sm:text-2xl my-3">
          <div className="flex gap-2 pt-8 uppercase items-center justify-center">
            <h1 className="text-3xl font-semibold text-neutral-400">
              DELIVERY
            </h1>
            <h1 className="text-3xl font-semibold text-neutral-700">
              INFORMATION
            </h1>
            <p className="w-8 md:w-11 h-[2.5px] bg-neutral-700"></p>
          </div>
        </div>
        <div className="flex gap-3">
          <input
            onChange={onChangeHandler}
            name="firstName"
            value={formData.firstName}
            className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
            type="text"
            placeholder="First Name"
            required
          ></input>
          <input
            onChange={onChangeHandler}
            name="lastName"
            value={formData.lastName}
            className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
            type="text"
            placeholder="Last Name"
            required
          ></input>
        </div>
        <input
          onChange={onChangeHandler}
          name="email"
          value={formData.email}
          className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
          type="text"
          placeholder="Email address"
          required
        ></input>
        <input
          onChange={onChangeHandler}
          name="street"
          value={formData.street}
          className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
          type="text"
          placeholder="Street"
          required
        ></input>
        <div className="flex gap-3">
          <input
            onChange={onChangeHandler}
            name="city"
            value={formData.city}
            className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
            type="text"
            placeholder="City"
            required
          ></input>
          <input
            onChange={onChangeHandler}
            name="state"
            value={formData.state}
            className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
            type="text"
            placeholder="State"
            required
          ></input>
        </div>
        <div className="flex gap-3">
          <input
            onChange={onChangeHandler}
            name="country"
            value={formData.country}
            className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
            type="text"
            placeholder="Country"
            required
          ></input>
          <input
            onChange={onChangeHandler}
            name="zipcode"
            value={formData.zipcode}
            className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
            type="number"
            placeholder="Zip Code"
            required
          ></input>
        </div>
        <input
          onChange={onChangeHandler}
          name="phone"
          value={formData.phone}
          className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
          type="number"
          placeholder="Phone"
          required
        ></input>
      </div>
      <div className="mt-8">
        <div className="mt-8 min-w-[80]">
          <CartTotal></CartTotal>
        </div>
        <div className="mt-12">
          <div className="flex gap-2 pt-8 uppercase items-center justify-center">
            <h1 className="text-3xl font-semibold text-neutral-400">payment</h1>
            <h1 className="text-3xl font-semibold text-neutral-700">method</h1>
            <p className="w-8 md:w-11 h-[2.5px] bg-neutral-700"></p>
          </div>
          <div className="flex gap-3 flex-col lg:flex-row mt-5">
            <div
              onClick={() => {
                setMethod("stripe");
              }}
              className="flex items-center gap-3 border p-2 px-3 cursor-pointer"
            >
              <p
                className={`min-w-3.5 h-3.5 border rounded-full ${
                  method === "stripe" ? "bg-green-500" : ""
                }`}
              ></p>
              <img className="h-5 mx-4" src={assets.stripe_logo}></img>
            </div>
            <div
              onClick={() => {
                setMethod("razorPay");
              }}
              className="flex items-center gap-3 border p-2 px-3 cursor-pointer"
            >
              <p
                className={`min-w-3.5 h-3.5 border rounded-full ${
                  method === "razorPay" ? "bg-green-500" : ""
                }`}
              ></p>
              <img className="h-5 mx-4" src={assets.razorpay_logo}></img>
            </div>
            <div
              onClick={() => {
                setMethod("cod");
              }}
              className="flex items-center gap-3 border p-2 px-3 cursor-pointer"
            >
              <p
                className={`min-w-3.5 h-3.5 border rounded-full ${
                  method === "cod" ? "bg-green-500" : ""
                }`}
              ></p>
              <p className="text-gray-500 text-sm font-medium mx-4">
                CASH ON DELIVERY
              </p>
            </div>
          </div>
          <div className="w-full text-end mt-9">
            <button
              type="submit"
              className="bg-black text-white px-16 py-3 text-sm rounded uppercase cursor-pointer"
            >
              Place Order
            </button>
          </div>
        </div>
      </div>
    </form>
  );
};

export default PlaceOrder;
