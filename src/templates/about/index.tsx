"use client";

import React from "react";
import AboutHero from "./hero";
import DetailsBanner from "./banner/banner";
import Faqs from "./faqs/faqs";
import AboutStory from "./our-story";
import Reviews from "./review";
import {
  useAboutPageContentQuery,
  useFaqListQuery,
} from "@/features/store/storeApiSlice";

export interface AboutPageContent {
  cover_image: string | null;
  left_text_content: string | null;
  right_text_content: string | null;
  store_image: string | null;
  story_title: string | null;
  story_content: string | null;
  served_customer_count: number | null;
  sold_count: number | null;
  styles_count: number | null;
  detail_section_title: string | null;
  detail_1_image: string | null;
  detail_1_title: string | null;
  detail_2_image: string | null;
  detail_2_title: string | null;
  detail_3_image: string | null;
  detail_3_title: string | null;
}

export interface FaqEntry {
  id: string;
  question: string;
  answer: string;
}

const ABOUT_PLACEHOLDERS = {
  coverImage:
    "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=1400&q=80",
  storyImage:
    "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?auto=format&fit=crop&w=1200&q=80",
  details: [
    {
      image:
        "https://images.unsplash.com/photo-1543508282-6319a3e2621f?auto=format&fit=crop&w=900&q=80",
      title: "Breathable uppers that keep every stride light and easy.",
    },
    {
      image:
        "https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?auto=format&fit=crop&w=900&q=80",
      title: "Responsive cushioning built for long days on the move.",
    },
    {
      image:
        "https://images.unsplash.com/photo-1605348532760-6753d2c43329?auto=format&fit=crop&w=900&q=80",
      title: "Durable traction designed for reliable daily wear.",
    },
  ],
} as const;

const normalizeText = (value: string | null | undefined, fallback: string) => {
  const trimmed = value?.trim();
  return trimmed ? trimmed : fallback;
};

const formatCount = (value: number | null | undefined, suffix = "+") => {
  if (typeof value !== "number" || Number.isNaN(value)) return `0${suffix}`;
  return `${value}${suffix}`;
};

const buildDetailItems = (content?: AboutPageContent) => [
  {
    image:
      content?.detail_1_image || ABOUT_PLACEHOLDERS.details[0].image,
    title: normalizeText(
      content?.detail_1_title,
      ABOUT_PLACEHOLDERS.details[0].title,
    ),
    number: "01",
  },
  {
    image:
      content?.detail_2_image || ABOUT_PLACEHOLDERS.details[1].image,
    title: normalizeText(
      content?.detail_2_title,
      ABOUT_PLACEHOLDERS.details[1].title,
    ),
    number: "02",
  },
  {
    image:
      content?.detail_3_image || ABOUT_PLACEHOLDERS.details[2].image,
    title: normalizeText(
      content?.detail_3_title,
      ABOUT_PLACEHOLDERS.details[2].title,
    ),
    number: "03",
  },
];

const AboutPage = () => {
  const { data } = useAboutPageContentQuery({});
  const { data: faqs } = useFaqListQuery({});

  const content = data?.data as AboutPageContent | undefined;
  const faqItems = ((faqs?.data as FaqEntry[] | undefined) ?? []).filter(
    (item) => item.question?.trim() && item.answer?.trim(),
  );

  const storyParagraphs = normalizeText(
    content?.story_content,
    "Every pair we design is shaped by comfort, durability, and a clear point of view. We focus on materials, fit, and finish so the final result feels as good as it looks.",
  )
    .split(/\r?\n\r?\n/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);

  return (
    <div>
      <AboutHero
        coverImage={content?.cover_image || ABOUT_PLACEHOLDERS.coverImage}
        leftText={normalizeText(
          content?.left_text_content,
          "We build products with the same care we expect from the things we wear every day.",
        )}
        rightText={normalizeText(
          content?.right_text_content,
          "Our work combines modern comfort, sharp styling, and dependable craftsmanship.",
        )}
      />
      <AboutStory
        image={content?.store_image || ABOUT_PLACEHOLDERS.storyImage}
        title={normalizeText(
          content?.story_title,
          "Crafting Excellence Since Day One",
        )}
        paragraphs={storyParagraphs}
        stats={[
          {
            value: formatCount(content?.served_customer_count),
            label: "Happy Customers",
          },
          {
            value: formatCount(content?.sold_count),
            label: "Pairs Sold",
          },
          {
            value: formatCount(content?.styles_count),
            label: "Signature Styles",
          },
        ]}
      />
      <DetailsBanner
        title={normalizeText(
          content?.detail_section_title,
          "Details Down to Sneaker Level",
        )}
        items={buildDetailItems(content)}
      />
      <Reviews />
      <Faqs items={faqItems} />
    </div>
  );
};

export default AboutPage;
