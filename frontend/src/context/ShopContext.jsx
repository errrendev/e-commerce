import { createContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import Product from "../pages/Product";
import axios from "axios";

export const shopContext = createContext();

const shopContextProvider = (props) => {
  const currency = "$";
  const delivery_fee = 10;
  const backend_url = import.meta.env.VITE_BACKEND_URL;
  const [token, setToken] = useState('')
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const [cartItems, setCartItems] = useState({});

  const getProducts = async () => {
    try {
      const res = await axios.get(backend_url + "/api/product/list");
      if (res.data.success) {
        setProducts(res.data.products);
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
        toast.error(error.message)
    }
  };

  const getUserCart = async (token) => {
    try {
        const res = await axios.post(backend_url+'/api/cart/get',{},{headers:{token}})
        if(res.data.success){
            setCartItems(res.data.cartData)
        }
    } catch (error) {
        console.log(error)
        toast.error(error.message)
    }
  }

  useEffect(() => {
    getProducts()
  }, [token])

  useEffect(() => {
    if(!token && localStorage.getItem('token')){
        setToken(localStorage.getItem('token'))
        getUserCart(localStorage.getItem('token'))
    }
  }, [])

  // Refresh cart whenever token changes
  useEffect(() => {
    if(token){
      getUserCart(token)
    }
  }, [token])
  
  

  const addToCart = async (itemId, size) => {
    if (!size) {
      toast.error("Select product size");
      return;
    }
    if(token){
        try {
            const res = await axios.post(backend_url+'/api/cart/add',{itemId,size},{headers:{token}})
            if(res.data.success){
                // Refresh cart after adding item
                await getUserCart(token)
                toast.success("Item added to cart")
            }
        } catch (error) {
            console.log(error)
            toast.error(error.message)
        }
    }
  };

  const getCartCount = () => {
    let totalCount = 0;
    for (const items in cartItems) {
      for (const item in cartItems[items]) {
        try {
          if (cartItems[items][item] > 0) {
            totalCount += cartItems[items][item];
          }
        } catch (error) {}
      }
    }
    return totalCount;
  };

  const updateQuantity = async (itemId, size, quantity) => {
    if(token){
        try {
            const res = await axios.post(backend_url+'/api/cart/update',{itemId,size,quantity},{headers:{token}})
            if(res.data.success){
                // Refresh cart after updating quantity
                await getUserCart(token)
            }
        } catch (error) {
            console.log(error)
            toast.error(error.message)
        }
    }
  };

  const cartTotal = () => {
    let totalCost = 0;
    for (const items in cartItems) {
      let itemInfo = products.find((Product) => Product._id === items);
      for (const item in cartItems[items]) {
        try {
          if (cartItems[items][item] > 0) {
            totalCost += itemInfo.price * cartItems[items][item];
          }
        } catch (error) {}
      }
    }
    return totalCost;
  };

  const values = {
    products,
    currency,
    delivery_fee,
    search,
    setSearch,
    showSearch,
    setShowSearch,
    cartItems,
    addToCart,
    getCartCount,
    updateQuantity,
    cartTotal,
    backend_url,
    setToken,
    token,
    setCartItems,
    getUserCart
  };

  return (
    <shopContext.Provider value={values}>{props.children}</shopContext.Provider>
  );
};

export default shopContextProvider;
