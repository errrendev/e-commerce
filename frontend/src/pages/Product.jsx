import React, { useContext, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { shopContext } from '../context/ShopContext'
import { assets } from '../assets/frontend_assets/assets';
import RelatedProducts from '../components/RelatedProducts';

const Product = () => {
  const {productId} = useParams();
  const {products,currency,addToCart} = useContext(shopContext);
  const [product, setProduct] = useState(false);
  const [image, setImage] = useState('')
  const [size, setSize] = useState('')
  useEffect(() => {
    products.map((item)=>{
      if(item._id === productId){
        setProduct(item);
        setImage(item.image[0])
        return null;
      }
    })
  }, [products, productId]);

  
  return product ? (
    <div className='border-t-2 pt-10 transition-opacity ease-in duration-500 opacity-100 '>
      <div className='flex gap-12 flex-col sm:flex-row'>
        <div className='flex-1 flex flex-col-reverse gap-3 sm:flex-row'>
          <div className='flex sm:flex-col overflow-x-auto sm:overflow-y-scroll justify-between sm:justify-normal sm:w-[18.7%] w-full'>
            {product.image.map((item,idx)=>{
              return <img onClick={()=>{setImage(item)}} key={idx} src={item} className='w-[24%] sm:w-full sm:mb-3 shrink-0 cursor-pointer'></img>
            })}
          </div>
          <div className='w-full sm:e-[80%]'>
            <img className='w-full h-auto' src={image}></img>
          </div>
        </div>
        <div className='flex-1'>
          <h1 className='font-medium text-2xl mt-2'>{product.name}</h1>
          <div className='flex items-center gap-1 mt-2'>
            <img src={assets.star_icon} alt="" className="w-3.5" />
            <img src={assets.star_icon} alt="" className="w-3.5" />
            <img src={assets.star_icon} alt="" className="w-3.5" />
            <img src={assets.star_icon} alt="" className="w-3.5" />
            <img src={assets.star_dull_icon} alt="" className="w-3.5" />
            <p className='pl-2'>(122)</p>
          </div>
          <p className='mt-5 text-3xl font-medium'>{currency}{product.price}</p>
          <p className='mt-5 text-gray-500 md:w-4/5'>{product.description}</p>
          <div className='flex flex-col gap-4 my-8'>
            <p className=''>Select size</p>
            <div className='flex gap-2'>
              {product.sizes.map((item,idx)=>{
                return <button onClick={()=>setSize(item)} key={idx} className={`border bg-gray-100 px-4 py-2 cursor-pointer ${size === item ? 'border-2 border-amber-400' : ''}`}>{item}</button>
              })}
            </div>
          </div>
          <button onClick={()=>{addToCart(productId,size)}} className='bg-black text-white px-8 py-3 text-sm rounded active:bg-neutral-700 cursor-pointer uppercase font-medium'>Add to Cart</button>
          <hr className='mt-8 sm:w-4/5'></hr>
          <div  className='mt-4 flex flex-col gap-1 text-sm text-neutral-600'>
            <p>100% Original product.</p>
            <p>Cash on delivery is available on this product.</p>
            <p>Easy return and exchange policy within 7 days.</p>
          </div>
        </div>
      </div>
      <div className='mt-20'>
        <div className='flex'>
          <b className='border px-5 py-3 text-sm'>Description</b>
          <p className='border px-5 py-3 text-sm'>Reviews (122)</p>
        </div>
        <div className='flex flex-col gap-4 border px-6 py-6 text-sm text-gray-500'>
          <p>Lorem ipsum dolor, sit amet consectetur adipisicing elit. Exercitationem earum officiis cum amet, laborum, placeat iste optio unde quos est voluptatum repudiandae reprehenderit eius illo doloremque quo minima dolorum iusto nisi, porro maxime quibusdam esse quia autem. Repellendus doloribus ut doloremque, voluptas eum optio animi esse unde voluptatum similique delectus.</p>
          <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Vero perferendis fugiat sequi adipisci ipsa quia suscipit neque numquam odit error fugit, eaque nostrum consectetur similique et facilis aspernatur itaque maiores.</p>
        </div>
      </div>
      <div>
        {<RelatedProducts category={product.category} subCategory={product.subCategory}></RelatedProducts>}
      </div>
    </div>
  ) : <div className='opacity-0'></div>
}

export default Product