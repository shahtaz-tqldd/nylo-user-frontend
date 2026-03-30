import Image from "next/image";
import React from "react";

const HERO_IMG = "https://images.unsplash.com/photo-1492133969098-09ba49699f47";

const AboutHero = () => {
  return (
    <div className="container mt-24 flex relative h-[600px]">
      <div className="w-1/4">
        <p className="text-xl w-full translate-y-[120%]">
          Our family's dedication to this noble material reflects a deep respect
          for its history and potential.
        </p>
        <div className="pl-10 py-10 w-1/3 absolute bg-white z-20 bottom-0 left-0">
          <h5 className="font-bold text-primary text-7xl">About</h5>
          <h5 className="font-bold text-primary text-7xl ml-32 mt-6">nyLo</h5>
        </div>
      </div>
      <div className="w-3/4 h-[600px] relative">
        <div className="w-4 h-full bg-white absolute z-10 left-1/4"></div>
        <div className="w-4 h-full bg-white absolute z-10 right-1/3"></div>
        <div className="w-[340px] p-8 bg-white absolute z-20 right-0 bottom-0">
          <p className="text-lg">
            we've been crafting the legacy of metal transforming it from a raw
            material into timeless art.
          </p>
        </div>
        <Image
          src={HERO_IMG}
          height={800}
          width={1000}
          alt=""
          className="w-full h-full object-cover"
        />
      </div>
    </div>
  );
};

export default AboutHero;
