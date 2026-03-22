import React, { useContext, useEffect, useState } from "react";
import { shopContext } from "../context/ShopContext";
import { Link } from "react-router-dom";
import { assets } from "../assets/frontend_assets/assets";

const Collection = () => {
  const { products, currency, search, showSearch } = useContext(shopContext);
  const [showFIlter, setShowFIlter] = useState(false);
  const [filterProducts, setFilterProducts] = useState([]);
  const [category, setCategory] = useState([]);
  const [subCategory, setSubCategory] = useState([]);
  const [sortType, setSortType] = useState('relevant');

  const toggleCategory = (e) => {
    if (category.includes(e.target.value)) {
      setCategory((prev) => prev.filter((item) => item !== e.target.value));
    } else {
      setCategory((prev) => [...prev, e.target.value]);
    }
  };

  const toggleSubCategory = (e) => {
    if (subCategory.includes(e.target.value)) {
      setSubCategory((prev) => prev.filter((item) => item !== e.target.value));
    } else {
      setSubCategory((prev) => [...prev, e.target.value]);
    }
  };

  const applyFilter = () => {
    let productsCopy = products.slice();
    if(showSearch && search){
      productsCopy = productsCopy.filter((item)=>item.name.toLowerCase().includes(search.toLowerCase()))
    }
    if (category.length > 0) {
      productsCopy = productsCopy.filter((item) =>
        category.includes(item.category)
      );
    }
    if (subCategory.length > 0) {
      productsCopy = productsCopy.filter(
        (item) =>
          subCategory.includes(item.subCategory)
      );
    }
    setFilterProducts(productsCopy);
  };

  const sortProducts = ()=>{
    let productsCopy = filterProducts.slice();
    switch (sortType){
      case 'low-high':
        setFilterProducts(productsCopy.sort((a,b)=>a.price-b.price));
        break;
      case 'high-low':
        setFilterProducts(productsCopy.sort((a,b)=>b.price-a.price));
        break;
      default:
        applyFilter();
        break;
    }
  };

  useEffect(() => {
    applyFilter();
    // eslint-disable-next-line
  }, [category, subCategory, search, showSearch, products]);

  useEffect(()=>{
    sortProducts();
    // eslint-disable-next-line
  },[sortType, products]);

  return (
    <div className="flex flex-col sm:flex-row pt-10 gap-1 sm:gap-10 border-t">
      <div className="min-w-60">
        <p className="flex items-center text-xl my-2 cursor-pointer gap-2">
          FILTER
          <img
            onClick={() => setShowFIlter(!showFIlter)}
            src={assets.dropdown_icon}
            className={`h-3 sm:hidden ${showFIlter ? "rotate-90" : ""}`}
            alt="Dropdown"
          />
        </p>
        <div
          className={`border border-gray-300 pl-5 py-3 mt-6 ${
            showFIlter ? "" : "hidden"
          } sm:block`}
        >
          <p className="mb-3 text-sm font-medium">CATEGORIES</p>
          <div className="flex flex-col gap-2 text-sm font-light text-gray-700">
            <p className="flex gap-2">
              <input
                className="w-3"
                type="checkbox"
                value={"Men"}
                onChange={toggleCategory}
              />{" "}
              MEN
            </p>
            <p className="flex gap-2">
              <input
                className="w-3"
                type="checkbox"
                value={"Women"}
                onChange={toggleCategory}
              />
              WOMEN
            </p>
            <p className="flex gap-2">
              <input
                className="w-3"
                type="checkbox"
                value={"Kids"}
                onChange={toggleCategory}
              />
              KIDS
            </p>
          </div>
        </div>
        <div
          className={`border border-gray-300 pl-5 py-3 my-5 ${
            showFIlter ? "" : "hidden"
          } sm:block`}
        >
          <p className="mb-3 text-sm font-medium">TYPE</p>
          <div className="flex flex-col gap-2 text-sm font-light text-gray-700">
            <p className="flex gap-2">
              <input
                className="w-3"
                type="checkbox"
                value={"Topwear"}
                onChange={toggleSubCategory}
              />
              TOPWEAR
            </p>
            <p className="flex gap-2">
              <input
                className="w-3"
                type="checkbox"
                value={"Bottomwear"}
                onChange={toggleSubCategory}
              />
              BOTTOMWEAR
            </p>
            <p className="flex gap-2">
              <input
                className="w-3"
                type="checkbox"
                value={"Winterwear"}
                onChange={toggleSubCategory}
              />
              WINTERWEAR
            </p>
          </div>
        </div>
      </div>
      <div className="flex flex-col items-center justify-center sm:items-start w-full">
        {/* Responsive sort select for mobile (shows on mobile), moved above grid */}
        <div className="flex flex-col w-full">
          <div className="flex flex-col-reverse sm:flex-row sm:justify-between w-full text-base sm:text-2xl mb-2 sm:mb-4 gap-2">
            <div className="flex gap-2 pt-2 uppercase items-center">
              <h1 className="text-3xl font-semibold text-neutral-400">All</h1>
              <h1 className="text-3xl font-semibold text-neutral-700">
                collections
              </h1>
              <p className="w-8 md:w-11 h-[2.5px] bg-neutral-700"></p>
            </div>
            {/* Sort select - visible on all devices, default full width on mobile */}
            <div className="w-full sm:w-auto mb-2 sm:mb-0">
              <select
                className="border-2 cursor-pointer border-gray-300 text-sm px-2 py-2 w-full sm:w-auto rounded"
                onChange={(e) => setSortType(e.target.value)}
                value={sortType}
                aria-label="Sort collection"
              >
                <option value="relevant">Sort by: Relevant</option>
                <option value="low-high">Sort by: Low to High</option>
                <option value="high-low">Sort by: High to Low</option>
              </select>
            </div>
          </div>
        </div>
        {/* Product grid below the header and sort */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 gap-y-6 mt-5 w-full">
          {filterProducts.map((product) => {
            return (
              <Link key={product._id} to={`/product/${product._id}`}>
                <div className="flex flex-col gap-1 overflow-hidden">
                  <img
                    className="w-30 h-35 md:h-52 md:w-57 hover:scale-110 transition-all"
                    src={product.image[0]}
                    alt={product.name}
                  />
                  <p className="text-sm w-30 md:w-57 text-neutral-600 mt-2">
                    {product.name}
                  </p>
                  <p className="text-sm text-neutral-800 font-semibold">
                    {currency}
                    {product.price}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Collection;
