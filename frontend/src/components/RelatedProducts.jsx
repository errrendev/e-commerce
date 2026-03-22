import React, { useContext, useEffect, useState } from "react";
import { shopContext } from "../context/ShopContext";
import { Link } from "react-router-dom";

const RelatedProducts = ({ category, subCategory }) => {
  const { products, currency } = useContext(shopContext);
  const [relatedProducts, setRelatedProducts] = useState([]);
  useEffect(() => {
    let productsCopy = products.slice();
    setRelatedProducts(
      productsCopy
        .filter(
          (item) =>
            item.category === category && item.subCategory === subCategory
        )
        .slice(0, 5)
    );
  }, [products]);

  // Handler to scroll to top
  const handleImageClick = () => {
    window.scrollTo({ top: 0 });
  };

  return (
    <div className="flex flex-col gap-6 my-24">
      <div className="w-full flex items-center justify-start">
        <div className="flex gap-2 pt-8 uppercase items-center justify-center">
          <h1 className="text-3xl font-semibold text-neutral-400">Related</h1>
          <h1 className="text-3xl font-semibold text-neutral-700">Products</h1>
          <p className="w-8 md:w-11 h-[2.5px] bg-neutral-700"></p>
        </div>
      </div>
      <div className="flex gap-3">
        {relatedProducts.map((product) => {
          return (
            <Link key={product._id} to={`/product/${product._id}`}>
              <div className="flex flex-col gap-1 overflow-hidden">
                <img
                  className="w-30 h-35 md:h-52 md:w-57 hover:scale-110 transition-all"
                  src={product.image[0]}
                  onClick={handleImageClick}
                  style={{ cursor: "pointer" }}
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
  );
};

export default RelatedProducts;
