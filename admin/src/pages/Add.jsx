import React, { useState } from "react";
import { assets } from "../assets/admin_assets/assets";
import axios from "axios";
import { backendUrl } from "../App";
import { toast } from "react-toastify";

const Add = ({token}) => {
  const [image1, setImage1] = useState(false);
  const [image3, setImage3] = useState(false);
  const [image2, setImage2] = useState(false);
  const [image4, setImage4] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [subCategory, setSubCategory] = useState("");
  const [price, setPrice] = useState("");
  const [sizes, setsizes] = useState([]);
  const [bestseller, setbestseller] = useState(false);

  const submitHandler = async (e) => {
    try {
      e.preventDefault();
      const formData = new FormData();
      if (image1) formData.append("image1", image1);
      if (image2) formData.append("image2", image2);
      if (image3) formData.append("image3", image3);
      if (image4) formData.append("image4", image4);

      formData.append("name", name);
      formData.append("description", description);
      formData.append("category", category);
      formData.append("subCategory", subCategory);
      formData.append("price", price);
      formData.append("sizes", JSON.stringify(sizes));
      formData.append("bestseller", bestseller);

      const res = await axios.post(backendUrl + '/api/product/add',formData,{headers:{token}})
      if(res.data.success){
        toast.success(res.data.message)
        setName('')
        setDescription('')
        setCategory('')
        setSubCategory('')
        setImage1(false)
        setImage2(false)
        setImage3(false)
        setImage4(false)
        setPrice('')
        setsizes([])
        setbestseller(false)
      }
      else{
        toast.error(res.data.message)
      }

    } catch (error) {
      console.log(error)
      toast.error(error.message)
    }
  };

  return (
    <form onSubmit={submitHandler}>
      <div className="flex flex-col w-full items-start gap-3">
        <p className="mb-2">Upload Image</p>
        <div className="flex gap-2">
          <label htmlFor="image1">
            <img
              className="w-20"
              src={!image1 ? assets.upload_area : URL.createObjectURL(image1)}
            ></img>
            <input
              onChange={(e) => {
                setImage1(e.target.files[0]);
              }}
              type="file"
              id="image1"
              hidden
            ></input>
          </label>

          <label htmlFor="image2">
            <img
              className="w-20"
              src={!image2 ? assets.upload_area : URL.createObjectURL(image2)}
            ></img>
            <input
              onChange={(e) => {
                setImage2(e.target.files[0]);
              }}
              type="file"
              id="image2"
              hidden
            ></input>
          </label>

          <label htmlFor="image3">
            <img
              className="w-20"
              src={!image3 ? assets.upload_area : URL.createObjectURL(image3)}
            ></img>
            <input
              onChange={(e) => {
                setImage3(e.target.files[0]);
              }}
              type="file"
              id="image3"
              hidden
            ></input>
          </label>

          <label htmlFor="image4">
            <img
              className="w-20"
              src={!image4 ? assets.upload_area : URL.createObjectURL(image4)}
            ></img>
            <input
              onChange={(e) => {
                setImage4(e.target.files[0]);
              }}
              type="file"
              id="image4"
              hidden
            ></input>
          </label>
        </div>
      </div>
      <div className="w-full">
        <p className="my-2">Product name</p>
        <input
          value={name}
          onChange={(e) => {
            setName(e.target.value);
          }}
          className="w-full max-w-[500px] px-3 py-2"
          type="text"
          placeholder="Type here"
          required
        ></input>
      </div>
      <div className="w-full">
        <p className="my-2">Product description</p>
        <textarea
          value={description}
          onChange={(e) => {
            setDescription(e.target.value);
          }}
          className="w-full max-w-[500px] px-3 py-2"
          type="text"
          placeholder="Type here"
          required
        ></textarea>
      </div>
      <div className="flex flex-col sm:flex-row gap-2 w-full sm:gap-8">
        <div className="w-full">
          <p className="my-2">Product category</p>
          <select
            value={category}
            onChange={(e) => {
              setCategory(e.target.value);
            }}
            className="w-full px-3 py-2"
          >
            <option value="">Select category</option>
            <option value="Men">Men</option>
            <option value="Women">Women</option>
            <option value="Kids">Kids</option>
          </select>
        </div>
        <div className="w-full">
          <p className="my-2">Product sub-category</p>
          <select
            value={subCategory}
            onChange={(e) => {
              setSubCategory(e.target.value);
            }}
            className="w-full px-3 py-2"
          >
            <option value="">Select sub-category</option>
            <option value="Topwear">Topwear</option>
            <option value="Bottomwear">Bottomwear</option>
            <option value="Winterwear">Winterwear</option>
          </select>
        </div>
        <div className="w-full">
          <p className="my-2">Product Price</p>
          <input
            value={price}
            onChange={(e) => {
              setPrice(e.target.value);
            }}
            className="w-full sm:w-[120px] px-3 py-2"
            type="number"
            placeholder="25"
            required
          ></input>
        </div>
      </div>
      <div>
        <p className="my-2">Product sizess</p>
        <div className="flex gap-3">
          <div>
            <p
              onClick={() => {
                setsizes((prev) =>
                  prev.includes("S")
                    ? prev.filter((item) => item !== "S")
                    : [...prev, "S"]
                );
              }}
              className={`bg-slate-200 px-3 py-1 cursor-pointer ${
                sizes.includes("S") ? "border-2 border-pink-300" : ""
              }`}
            >
              S
            </p>
          </div>
          <div>
            <p
              onClick={() => {
                setsizes((prev) =>
                  prev.includes("M")
                    ? prev.filter((item) => item !== "M")
                    : [...prev, "M"]
                );
              }}
              className={`bg-slate-200 px-3 py-1 cursor-pointer ${
                sizes.includes("M") ? "border-2 border-pink-300" : ""
              }`}
            >
              M
            </p>
          </div>
          <div>
            <p
              onClick={() => {
                setsizes((prev) =>
                  prev.includes("L")
                    ? prev.filter((item) => item !== "L")
                    : [...prev, "L"]
                );
              }}
              className={`bg-slate-200 px-3 py-1 cursor-pointer ${
                sizes.includes("L") ? "border-2 border-pink-300" : ""
              }`}
            >
              L
            </p>
          </div>
          <div>
            <p
              onClick={() => {
                setsizes((prev) =>
                  prev.includes("XL")
                    ? prev.filter((item) => item !== "XL")
                    : [...prev, "XL"]
                );
              }}
              className={`bg-slate-200 px-3 py-1 cursor-pointer ${
                sizes.includes("XL") ? "border-2 border-pink-300" : ""
              }`}
            >
              XL
            </p>
          </div>
          <div>
            <p
              onClick={() => {
                setsizes((prev) =>
                  prev.includes("XXL")
                    ? prev.filter((item) => item !== "XXL")
                    : [...prev, "XXL"]
                );
              }}
              className={`bg-slate-200 px-3 py-1 cursor-pointer ${
                sizes.includes("XXL") ? "border-2 border-pink-300" : ""
              }`}
            >
              XXL
            </p>
          </div>
        </div>
      </div>
      <div className="flex gap-2 my-3">
        <input
          onChange={() => {
            setbestseller((prev) => !prev);
          }}
          checked={bestseller}
          type="checkbox"
          id="bestseller"
        ></input>
        <label className="cursor-pointer" htmlFor="bestseller">
          Add to bestseller
        </label>
      </div>
      <button className="px-8 py-2 uppercase font-medium bg-black text-white cursor-pointer rounded mt-4">
        Add
      </button>
    </form>
  );
};

export default Add;
