import Image from "next/image";
import React from "react";

interface AboutHeroProps {
  coverImage: string;
  leftText: string;
  rightText: string;
}

const AboutHero = ({ coverImage, leftText, rightText }: AboutHeroProps) => {
  return (
    <div className="container mt-24 flex relative h-[600px]">
      <div className="w-1/4">
        <p className="text-xl w-full translate-y-[120%]">
          {leftText}
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
          <p className="text-lg">{rightText}</p>
        </div>
        <Image
          src={coverImage}
          height={800}
          width={1000}
          alt="About nyLo cover"
          className="w-full h-full object-cover"
        />
      </div>
    </div>
  );
};

export default AboutHero;
