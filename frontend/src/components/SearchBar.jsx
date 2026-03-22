import React, { useContext, useEffect, useState } from 'react'
import { shopContext } from '../context/ShopContext'
import { assets } from '../assets/frontend_assets/assets';
import { useLocation } from 'react-router-dom';

const SearchBar = () => {
    const location = useLocation();
    const {search, setSearch, showSearch, setShowSearch} = useContext(shopContext);
    const [visible, setvisible] = useState(false)
    useEffect(() => {
      if(location.pathname.includes('collection')){
        setvisible(true)
      }
      else{
        setvisible(false)
      }
    }, [location])
    

  return showSearch &&visible ? (
    <div className='border-t border-b bg-gray-50 text-center'>
        <div className='inline-flex justify-center items-center border border-gray-400 px-5 py-2 my-5 mx-3 rounded-full w-3/4 sm:w-1/2'>
            <input value={search} onChange={(e)=>setSearch(e.target.value)} type='text' placeholder='Search' className='flex-1 outline-none bg-inherit text-sm'></input>
            <img src={assets.search_icon} className='w-4 cursor-pointer'></img>
        </div>
        <img onClick={()=>setShowSearch(false)} src={assets.cross_icon} className='w-4 inline cursor-pointer'></img>
    </div>
  ) : null
}

export default SearchBar