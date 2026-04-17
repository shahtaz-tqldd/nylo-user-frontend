import Image from "next/image";
import Title from "@/components/ui/title";
import React from "react";

interface AboutStoryProps {
  image: string;
  title: string;
  paragraphs: string[];
  stats: Array<{
    value: string;
    label: string;
  }>;
}

export default function AboutStory({
  image,
  title,
  paragraphs,
  stats,
}: AboutStoryProps) {
  return (
    <section className="container py-40">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
        <div className="relative h-[600px] lg:h-[680px]">
          <div className="absolute -top-8 -left-8 w-full h-full border-2 border-gray-200 transition-all duration-700" />

          <div className="relative w-full h-full overflow-hidden">
            <Image
              src={image}
              alt="Our Story"
              fill
              className="w-full h-full object-cover object-top transition-transform duration-700"
            />

            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent transition-opacity duration-700" />
          </div>

          <div className="absolute -bottom-4 -right-4 w-32 h-32 border border-primary" />
        </div>

        <div className="space-y-8">
          <div className="flex items-center gap-4">
            <div className="w-12 h-[2px] bg-primary" />
            <span className="text-sm uppercase tracking-[3px] text-gray-400">
              Our Story
            </span>
          </div>

          <Title>{title}</Title>

          <div className="space-y-6 text-gray-600 text-lg leading-relaxed">
            {paragraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>

          <div className="grid grid-cols-3 gap-8 pt-8 border-t border-gray-200">
            {stats.map((stat) => (
              <div key={stat.label}>
                <div className="text-4xl font-bold text-primary mb-2">
                  {stat.value}
                </div>
                <div className="text-sm text-gray-500 uppercase tracking-wide">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
