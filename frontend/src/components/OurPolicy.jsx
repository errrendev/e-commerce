import React from "react";
import { assets } from "../assets/frontend_assets/assets";

const OurPolicy = () => {
  return (
    <div className="my-20 flex flex-col sm:flex-row items-center justify-around gap-12 sm:gap-2 text-center py-20 text-xs sm:text-sm md:text-base ">
      <div className="flex flex-col gap-2 items-center justify-between">
        <img src={assets.exchange_icon} className="w-12 m-auto mb-5"></img>
        <h3 className="font-semibold text-neutral-900 text-center">Easy Exchange Policy</h3>
        <p className="text-neutral-600 text-center">We offer hassle free exchange policy</p>
      </div>
      <div className="flex flex-col gap-2 items-center justify-between">
        <img src={assets.quality_icon} className="w-10 m-auto mb-5"></img>
        <h3 className="font-semibold text-neutral-900 text-center">7 Days Return Policy</h3>
        <p className="text-neutral-600 text-center">We provide 7 days free return policy</p>
      </div>
      <div className="flex flex-col gap-2 items-center justify-between">
        <img src={assets.support_img} className="w-10 m-auto mb-5"></img>
        <h3 className="font-semibold text-neutral-900 text-center">Best customer Support</h3>
        <p className="text-neutral-600 text-center">we provide 24/7 customer support</p>
      </div>
    </div>
  );
};

export default OurPolicy;