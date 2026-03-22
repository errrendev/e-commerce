import React from "react";
import { assets } from "../assets/frontend_assets/assets";
import NewsLetter from "../components/NewsLetter";

const Contact = () => {
  return (
    <div>
      <div className="text-center text-2xl pt-10 border-t">
        <div className="flex gap-2 pt-8 uppercase items-center justify-center">
          <h1 className="text-3xl font-semibold text-neutral-400">Contact</h1>
          <h1 className="text-3xl font-semibold text-neutral-700">us</h1>
          <p className="w-8 md:w-11 h-[2.5px] bg-neutral-700"></p>
        </div>
      </div>
      <div className="my-10 flex flex-col justify-center md:flex-row gap-10 mb-28">
        <img src={assets.contact_img} className="w-full md:max-w-[480px]"></img>
        <div className="flex flex-col justify-center items-start gap-6">
          <p className="font-semibold text-xl text-gray-600">Our Store</p>
          <p className="text-gray-500">54079 Willms Station <br></br> Suite 350, Washington</p>
          <p className="text-gray-500">Tel: (415) 555-0132 <br /> Email: admin@forever.com</p>
          <p className="font-semibold text-xl text-gray-600">Careers at Forever</p>
          <p className="text-gray-500">Learn more about out teams and job openeings</p>
          <button className="border border-black px-8 py-4 text-sm hover:bg-black hover:text-white font-medium transition-all duration-500 rounded">Explore Jobs</button>
        </div>
      </div>
      <NewsLetter></NewsLetter>
    </div>
  );
};

export default Contact;
