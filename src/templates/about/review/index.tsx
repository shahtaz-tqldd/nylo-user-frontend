"use client";
import React, { useState } from "react";
import { REVIEWS_DATA } from "./demo-data";
import Title from "@/components/ui/title";

export default function Reviews() {
  const [hoveredId, setHoveredId] = useState<number | null>(null);

  return (
    <section className="py-24 container">
      {/* Header */}
      <div className="text-center mb-20">
        <p className="text-sm uppercase tracking-[3px] text-gray-400">
          Testimonials
        </p>
        <Title className="mt-2">
          What Our <span className="text-primary">Customers</span> Say
        </Title>
      </div>

      {/* Reviews Grid */}
      <div className="grid grid-cols-4 gap-6 mt-12">
        {REVIEWS_DATA.map((review) => {
          const isHovered = hoveredId === review.id;

          return (
            <div
              key={review.id}
              className={`h-full`}
              onMouseEnter={() => setHoveredId(review.id)}
              onMouseLeave={() => setHoveredId(null)}
            >
              {/* Content */}
              <div className="p-6 relative flex flex-col overflow-hidden justify-between h-full bg-white rounded-2xl shadow-lg">
                <div>
                  {/* Stars */}
                  <div className="flex gap-1 mb-4">
                    {[...Array(review.rating)].map((_, i) => (
                      <svg
                        key={i}
                        className="w-4 h-4 text-yellow-400 fill-current"
                        viewBox="0 0 20 20"
                      >
                        <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                      </svg>
                    ))}
                  </div>

                  {/* Review text */}
                  <p className="text-gray-600 text-sm leading-relaxed mb-6 flex-grow">
                    "{review.review}"
                  </p>
                </div>

                {/* Author */}
                <div className="border-t border-gray-100 pt-4">
                  <h5 className="mb-1">{review.name}</h5>
                  <p className="text-xs uppercase tracking-wide">
                    {review.role}
                  </p>
                </div>
                {/* Accent line */}
                <div
                  className="absolute top-0 left-0 right-0 h-1 transition-all duration-500"
                  style={{
                    background:
                      "linear-gradient(90deg, var(--theme-primary), color-mix(in srgb, var(--theme-primary) 40%, var(--theme-accent)))",
                    opacity: isHovered ? 1 : 0,
                    transform: isHovered ? "scaleX(1)" : "scaleX(0)",
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
