import React from "react";
import { assets } from "../assets/frontend_assets/assets";
import NewsLetter from '../components/NewsLetter'

const About = () => {
  return (
    <div>
      <div className="text-2xl text-center pt-8 border-t">
        <div className="flex gap-2 pt-8 uppercase items-center justify-center">
          <h1 className="text-3xl font-semibold text-neutral-400">About</h1>
          <h1 className="text-3xl font-semibold text-neutral-700">us</h1>
          <p className="w-8 md:w-11 h-[2.5px] bg-neutral-700"></p>
        </div>
      </div>
      <div className="my-10 flex flex-col md:flex-row gap-16">
        <img className="w-full md:max-w-[450px]" src={assets.about_img}></img>
        <div className="flex flex-col justify-center gap-6 md:w-2/4 text-gray-600">
          <p>
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Amet
            assumenda rerum exercitationem nostrum ducimus veritatis, ad beatae
            minima, adipisci ex aperiam unde excepturi quae porro itaque soluta
            autem consequatur atque expedita provident qui laborum facilis! Nisi
            nostrum numquam ipsam ex dignissimos at fuga, sit, corporis
            voluptatibus reprehenderit porro ipsa in. Illo exercitationem sed
            minus quaerat? Asperiores, corrupti sunt! Tenetur, eos?
          </p>
          <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Dicta harum
            rem aliquam ex ut eaque! Distinctio quas maiores laudantium optio
            deserunt inventore sit esse accusantium veritatis iusto! Dolorem
            dolore at laudantium, natus minus impedit labore, quas eaque harum
            placeat in?
          </p>
          <b className="text-gray-800">Our Mission</b>
          <p>
            Lorem ipsum, dolor sit amet consectetur adipisicing elit. Explicabo
            praesentium perspiciatis recusandae. Magnam blanditiis nihil, eum,
            iure corrupti omnis ut quasi reprehenderit, a sint ea at possimus.
            Voluptas eius iste pariatur mollitia labore optio praesentium
            placeat cupiditate aliquid ratione consectetur perferendis,
            voluptatem hic sint rerum quia at inventore, nobis consequatur?
          </p>
        </div>
      </div>
      <div className="text-4xl py-4 flex justify-start">
        <div className="flex gap-2 pt-8 uppercase items-center justify-center">
          <h1 className="text-3xl font-semibold text-neutral-400">Why</h1>
          <h1 className="text-3xl font-semibold text-neutral-700">Choose us?</h1>
          <p className="w-8 md:w-11 h-[2.5px] bg-neutral-700"></p>
        </div>
      </div>
      <div className="flex flex-col md:flex-row text-sm mb-20">
        <div className="border px-10 md:px-16 py-8 sm:py-20 flex flex-col gap-5">
          <b>Quality Assurance</b>
          <p className="text-gray-600">Lorem, ipsum dolor sit amet consectetur adipisicing elit. Ratione pariatur facilis recusandae tempore natus minima?</p>
        </div>
        <div className="border px-10 md:px-16 py-8 sm:py-20 flex flex-col gap-5">
          <b>Convenience</b>
          <p className="text-gray-600">Lorem, ipsum dolor sit amet consectetur adipisicing elit. Ratione pariatur facilis recusandae tempore natus minima?</p>
        </div>
        <div className="border px-10 md:px-16 py-8 sm:py-20 flex flex-col gap-5">
          <b>Exceptional Customer Service</b>
          <p className="text-gray-600">Lorem, ipsum dolor sit amet consectetur adipisicing elit. Ratione pariatur facilis recusandae tempore natus minima?</p>
        </div>
      </div>
      <NewsLetter></NewsLetter>
    </div>
  );
};

export default About;
