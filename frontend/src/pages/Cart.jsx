import React, { useContext, useEffect, useState } from "react";
import { shopContext } from "../context/ShopContext";
import { assets } from "../assets/frontend_assets/assets";
import CartTotal from "../components/CartTotal";
import { useNavigate } from "react-router-dom";

const Cart = () => {
  const navigate = useNavigate();
  const { products, currency, cartItems, updateQuantity, token, getUserCart } =
    useContext(shopContext);
  const [cartData, setcartData] = useState([]);

  // Refresh cart when component mounts
  useEffect(() => {
    if (token) {
      getUserCart(token)
    }
  }, [token, getUserCart])

  useEffect(() => {
    if (products.length > 0) {
      const tempData = [];
      for (const items in cartItems) {
        for (const item in cartItems[items]) {
          if (cartItems[items][item] > 0) {
            tempData.push({
              _id: items,
              size: item,
              quantity: cartItems[items][item],
            });
          }
        }
      }
      setcartData(tempData);
    }
  }, [cartItems, products]);

  return (
    <div className="border-t pt-14">
      <div className="text-2xl mb-3">
        <div className="w-full flex items-center justify-start">
          <div className="flex gap-2 pt-8 uppercase items-center justify-center">
            <h1 className="text-3xl font-semibold text-neutral-400">your</h1>
            <h1 className="text-3xl font-semibold text-neutral-700">cart</h1>
            <p className="w-8 md:w-11 h-[2.5px] bg-neutral-700"></p>
          </div>
        </div>
      </div>
      <div>
        {cartData.length === 0 ? (
          <div className="py-16 text-center">
            <p className="text-xl text-gray-500 font-medium">No products available in cart</p>
            <button
              onClick={() => navigate("/collection")}
              className="mt-4 bg-black text-white uppercase px-8 py-3 text-sm rounded cursor-pointer hover:bg-neutral-700 transition-colors"
            >
              Browse Products
            </button>
          </div>
        ) : (
          cartData.map((item, idx) => {
            const productData = products.find(
              (product) => item._id === product._id
            );
            return (
              <div
                key={idx}
                className="py-4 border-b border-t text-gray-700 grid grid-cols-[4fr_0.5fr_0.5fr] sm:grid-cols-[4fr_2fr_0.5fr] items-center gap-4"
              >
                <div className="flex items-start gap-6">
                  <img src={productData.image[0]} className="w-16 sm:w-20"></img>
                  <div>
                    <p className="text-sm sm:text-lg font-medium">
                      {productData.name}
                    </p>
                    <div className="flex items-center gap-5 mt-2">
                      <p>
                        {currency}
                        {productData.price}
                      </p>
                      <p className="px-2 sm:px-3 sm:py-1 border bg-slate-50">
                        {item.size}
                      </p>
                    </div>
                  </div>
                </div>
                <input
                  onChange={async (e) => {
                    if (e.target.value === "" || e.target.value === "0") {
                      return;
                    }
                    await updateQuantity(
                      item._id,
                      item.size,
                      Number(e.target.value)
                    );
                  }}
                  className="border max-w-10 sm:max-w-20 px-1 sm:px-2 py-1"
                  type="number"
                  min={1}
                  value={item.quantity}
                ></input>
                <img
                  onClick={async () => {
                    await updateQuantity(item._id, item.size, 0);
                  }}
                  src={assets.bin_icon}
                  className="w-4 mr-4 sm:w-5 cursor-pointer"
                ></img>
              </div>
            );
          })
        )}
      </div>
      {cartData.length > 0 && (
        <div className="flex justify-end my-20">
          <div className="w-full sm:w-[450px]">
            <CartTotal></CartTotal>
            <div className="w-full text-end">
              <button
                onClick={() => {
                  navigate("/place-order");
                }}
                className="bg-black text-white uppercase px-8 py-3 text-sm my-8 rounded cursor-pointer"
              >
                Procced to checkout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
