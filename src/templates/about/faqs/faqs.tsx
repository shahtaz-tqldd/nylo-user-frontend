"use client";

import React, { useState } from "react";
import { Plus, Minus } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { faqData } from "./data";
import Title from "@/components/ui/title";

interface FaqItem {
  question: string;
  answer: string;
}

interface FaqsProps {
  items?: FaqItem[];
}

const Faqs: React.FC<FaqsProps> = ({ items }) => {
  const [openIndex, setOpenIndex] = useState<number>(0);
  const faqItems = items?.length ? items : faqData;

  const toggleFAQ = (index: number) => {
    setOpenIndex((prev) => (prev === index ? -1 : index));
  };

  return (
    <div className="container pt-10 pb-32 max-w-3xl mx-auto">
      <Title className="text-center">Frequently Asked Questions</Title>
      <div className="space-y-4 max-w-3xl mx-auto mt-12">
        {faqItems.map((faq, index) => {
          const isOpen = openIndex === index;

          return (
            <div
              key={`${faq.question}-${index}`}
              className="border border-gray-200 rounded-2xl p-4 cursor-pointer bg-white/50 shadow-sm"
              onClick={() => toggleFAQ(index)}
            >
              <div className="flex justify-between items-center">
                <h4 className="text-lg font-medium">{faq.question}</h4>
                {isOpen ? <Minus size={20} /> : <Plus size={20} />}
              </div>

              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.25 }}
                    className="overflow-hidden"
                  >
                    <p className="mt-3 text-gray-600 leading-relaxed">
                      {faq.answer}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Faqs;
