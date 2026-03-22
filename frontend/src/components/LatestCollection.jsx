import React, { useContext, useEffect, useState } from "react";
import { shopContext } from "../context/ShopContext";
import { Link } from "react-router-dom";

const LatestCollection = () => {
  const { products, currency } = useContext(shopContext);
  const [latestProducts, setLatestProducts] = useState([]);
  useEffect(() => {
    setLatestProducts(products.slice(0, 10));
  }, [products]);

  return (
    <div className="flex my-10 flex-col w-full">
      <div className="flex gap-2 pt-8 uppercase items-center justify-center">
        <h1 className="text-3xl font-semibold text-neutral-400">latest</h1>
        <h1 className="text-3xl font-semibold text-neutral-700">collections</h1>
        <p className="w-8 md:w-11 h-[2.5px] bg-neutral-700"></p>
      </div>
      <p className="text-center text-neutral-700 mt-2">
        Lorem ipsum dolor sit, amet consectetur adipisicing elit. Quos vel at
        veniam natus, ipsa mollitia?
      </p>
      <div className="flex items-center justify-center">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 gap-y-6 mt-8">
          {latestProducts.map((product) => {
            return (
              <Link key={product._id} to={`/product/${product._id}`}>
                <div className="flex flex-col gap-1 overflow-hidden">
                  <img
                    className="w-30 h-35 md:h-52 md:w-57 hover:scale-110 transition-all"
                    src={product.image[0]}
                  ></img>
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

export default LatestCollection;
