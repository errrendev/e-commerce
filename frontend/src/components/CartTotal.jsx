import React, { useContext } from "react";
import { shopContext } from "../context/ShopContext";

const cartTotal = () => {
  const { currency, delivery_fee, cartTotal } = useContext(shopContext);
  return (
    <div className="w-full">
      <div className="text-2xl">
        <div className="flex gap-2 pt-8 uppercase items-center justify-center">
          <h1 className="text-3xl font-semibold text-neutral-400">Cart</h1>
          <h1 className="text-3xl font-semibold text-neutral-700">total</h1>
          <p className="w-8 md:w-11 h-[2.5px] bg-neutral-700"></p>
        </div>
        <div className="flex flex-col gap-2 mt-2 text-sm">
            <div className="flex justify-between">
                <p>Subtotal</p>
                <p>{currency}{cartTotal()}.00</p>
            </div>
            <hr></hr>
            <div className="flex justify-between">
                <p>Shipping fee</p>
                <p>{currency}{delivery_fee}.00</p>
            </div>
            <hr></hr>
            <div className="flex justify-between">
                <p>Total</p>
                <p>{currency}{cartTotal() === 0? 0 : delivery_fee + cartTotal()}.00</p>
            </div>
        </div>
      </div>
    </div>
  );
};

export default cartTotal;
