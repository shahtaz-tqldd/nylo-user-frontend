"use client";

import Image from "next/image";
import React from "react";

import Title from "@/components/ui/title";
import { useAboutPageContentQuery } from "@/features/store/storeApiSlice";

const Details = () => {
  const { data } = useAboutPageContentQuery({});

  const detailsData = [
    {
      img: data?.data?.detail_1_image || "/sdet1.webp",
      text:
        data?.data?.detail_1_title ||
        "Padded heel engineered for all terrain comfort and unmatched ankle support.",
      bg: "bg-teal-50",
      textPosition: "bottom",
      imageWidth: "78%",
      bgColorRGB: "20, 184, 166",
      color: "teal",
      number: "01",
    },

    {
      img: data?.data?.detail_2_image || "/sdet2.png",
      text:
        data?.data?.detail_2_title ||
        "The outsole pattern is inspired by metamorphosis to adapt with your every step.",
      bg: "bg-cyan-50",
      textPosition: "top",
      imageWidth: "90%",
      bgColorRGB: "6, 182, 212",
      color: "cyan",
      number: "02",
    },
    {
      img: data?.data?.detail_3_image || "/sdet3.png",
      text:
        data?.data?.detail_3_title ||
        "Engineered cushioning that hugs your feet all day, reducing fatigue with every step.",
      bg: "bg-rose-50",
      textPosition: "side",
      imageWidth: "60%",
      bgColorRGB: "244, 114, 182",
      color: "pink",
      number: "03",
    },
  ];

  return (
    <section className="py-24">
      <p className="uppercase tracking-[2px] text-lg text-center">
        Why choose us
      </p>
      <Title className="mt-2 text-center">
        {data?.data?.details_section_title || "Details Down to Sneaker Level"}
      </Title>

      <div className="container grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 relative z-10 mt-12">
        {detailsData.map((item, index) => (
          <div
            key={index}
            className={`${
              item.bg
            } rounded-3xl p-6 flex flex-col items-center relative overflow-hidden group ${
              item.textPosition === "top"
                ? "justify-between pb-0"
                : item.textPosition === "side"
                  ? "gap-6 justify-between"
                  : "pt-0"
            }`}
          >
            {/* Conditionally render Text */}
            {item.textPosition === "top" && (
              <p className="text-lg text-center max-w-xs z-10">{item.text}</p>
            )}

            {/* Image */}
            <Image
              src={item.img}
              alt="shoe"
              height={400}
              width={400}
              className={`z-10 ${"mx-auto pt-4"}`}
              style={{ width: item.imageWidth }}
            />

            {/* Conditionally render Text */}
            {item.textPosition === "bottom" && (
              <p className="text-lg text-right text-gray-700 dark:text-gray-200 max-w-xs">
                {item.text}
              </p>
            )}
            {item.textPosition === "side" && (
              <p className="text-lg max-w-xs">{item.text}</p>
            )}

            {/* bg shapes */}
            <div
              className={`absolute z-0 h-[400px] w-[400px] center rounded-full ${
                index === 0
                  ? "-top-48 -left-48"
                  : index === 1
                    ? "-bottom-48 -left-48"
                    : "-top-48 -right-48"
              }`}
            >
              <div
                className={`absolute h-[520px] w-[520px] center rounded-full border-2`}
                style={{
                  borderColor: `rgba(${item.bgColorRGB}, 0.05)`,
                }}
              >
                <div
                  className={`absolute h-[360px] w-[360px] center rounded-full border-2`}
                  style={{
                    borderColor: `rgba(${item.bgColorRGB}, 0.07)`,
                  }}
                >
                  <div
                    className={`absolute h-[240px] w-[240px] center rounded-full border-2`}
                    style={{
                      borderColor: `rgba(${item.bgColorRGB}, 0.10)`,
                    }}
                  >
                    <div
                      className={`absolute h-[120px] w-[120px] rounded-full border-2`}
                      style={{
                        borderColor: `rgba(${item.bgColorRGB}, 0.14)`,
                      }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Details;
