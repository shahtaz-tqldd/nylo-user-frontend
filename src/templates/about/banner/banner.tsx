"use client";
import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";
import { colorMap } from "./data";
import Title from "@/components/ui/title";

interface DetailItem {
  image: string;
  title: string;
  number: string;
}

interface DetailsBannerProps {
  title: string;
  items: DetailItem[];
}

export default function DetailsBanner({ title, items }: DetailsBannerProps) {
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const sectionRefs = useRef<(HTMLDivElement | null)[]>([]);
  const paletteKeys = Object.keys(colorMap) as Array<keyof typeof colorMap>;

  useEffect(() => {
    const observers: IntersectionObserver[] = [];

    sectionRefs.current.forEach((ref, index) => {
      if (!ref) return;

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              setActiveIndex(index);
            }
          });
        },
        {
          threshold: 0.5,
          rootMargin: "-100px 0px -100px 0px",
        },
      );

      observer.observe(ref);
      observers.push(observer);
    });

    return () => {
      observers.forEach((observer) => observer.disconnect());
    };
  }, []);

  return (
    <section className="max-w-5xl mx-auto">
      {/* Header */}
      <div className="text-center mb-16">
        <p className="text-sm uppercase tracking-[3px] text-gray-400 mb-4">
          Why Choose Us
        </p>
        <Title>{title}</Title>
      </div>

      <div className="">
        {items.map((item, index) => {
          const isActive = activeIndex === index;
          const isEven = index % 2 === 0;
          const colors = colorMap[paletteKeys[index % paletteKeys.length]];

          return (
            <div
              key={index}
              ref={(el) => {
                sectionRefs.current[index] = el;
              }}
              className={`relative flex items-center gap-12 transition-all duration-700 ease-out ${
                isEven ? "flex-row" : "flex-row-reverse"
              }`}
              style={{
                opacity: isActive ? 1 : 1,
                transform: isActive ? "translateY(0)" : "translateY(24px)",
              }}
            >
              {/* Background number */}
              <div
                className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-12 text-[120px] font-bold opacity-5 pointer-events-none transition-opacity duration-700"
                style={{
                  color: colors.accent,
                  opacity: isActive ? 0.05 : 0.02,
                }}
              >
                {item.number}
              </div>

              {/* Image Side */}
              <div
                className="flex-1 relative transition-transform duration-700 ease-out"
                style={{
                  transform: isActive
                    ? `scale(1.05) ${
                        isEven ? "translateX(20px)" : "translateX(-20px)"
                      }`
                    : "scale(1) translateX(0)",
                }}
              >
                <div className="relative h-[400px] flex items-center justify-center">
                  <div
                    className="absolute inset-0 rounded-full transition-all duration-700"
                    style={{
                      background: `radial-gradient(circle, ${colors.light} 0%, transparent 70%)`,
                      transform: isActive ? "scale(1.2)" : "scale(1)",
                      opacity: isActive ? 0.6 : 0.3,
                    }}
                  />

                  <Image
                    src={item.image}
                    alt={item.title}
                    className="relative z-10 w-[320px] h-[320px] object-contain drop-shadow-2xl"
                    height={400}
                    width={400}
                  />
                </div>
              </div>

              {/* Text Side */}
              <div className="flex-1 relative">
                <div
                  className={`absolute top-1/2 ${
                    isEven ? "right-full mr-12" : "left-full ml-12"
                  } h-[2px] transition-all duration-700`}
                  style={{
                    background: colors.accent,
                    width: isActive ? "80px" : "40px",
                    opacity: isActive ? 1 : 0.3,
                  }}
                />

                <div
                  className={`absolute top-1/2 -translate-y-1/2 ${
                    isEven ? "-left-2" : "-right-2"
                  } w-4 h-4 rounded-full transition-all duration-700`}
                  style={{
                    backgroundColor: colors.accent,
                    transform: `translateY(-50%) scale(${isActive ? 1.5 : 1})`,
                    opacity: isActive ? 1 : 0.3,
                  }}
                />

                <div className={`${isEven ? "pl-8" : "pr-8"}`}>
                  <div
                    className="text-sm font-bold mb-4 transition-colors duration-700"
                    style={{ color: isActive ? colors.accent : "#9ca3af" }}
                  >
                    {item.number}
                  </div>

                  <p
                    className="text-xl leading-relaxed transition-all duration-700"
                    style={{
                      color: isActive ? "#1f2937" : "#4b5563",
                      transform: isActive
                        ? "translateY(-4px)"
                        : "translateY(0)",
                    }}
                  >
                    {item.title}
                  </p>

                  <div
                    className="h-1 mt-6 rounded-full transition-all duration-700"
                    style={{
                      backgroundColor: colors.accent,
                      width: isActive ? "120px" : "60px",
                      opacity: isActive ? 1 : 0.3,
                    }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
