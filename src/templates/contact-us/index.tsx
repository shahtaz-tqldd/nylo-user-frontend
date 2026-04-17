"use client";
import Button from "@/components/buttons/primary-button";
import { ChevronRight, MessagesSquare } from "lucide-react";
import React, { useState } from "react";
import { CONTACT_INFO } from "./data";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import IconButton from "@/components/buttons/icon-button";
import { Facebook, Instagram, WhatsApp } from "@/assets/algo-icons";
import Title from "@/components/ui/title";

export default function ContactUsPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = () => {
    console.log("Form submitted:", formData);
    // Handle form submission here
    alert("Thank you for your message! We'll get back to you soon.");
  };

  return (
    <div className="min-h-screen pt-32 px-6">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center max-w-2xl flex flex-col items-center gap-4 mx-auto">
          <p className="text-sm uppercase tracking-[3px] text-gray-400">
            Get in Touch
          </p>
          <Title>
            We'd <span className="text-primary">Love to Hear</span> From You
          </Title>
          <p className="text-gray-600 text-lg">
            Have a question about our products or need assistance? Our team is
            here to help you every step of the way.
          </p>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 mt-20">
          {/* Contact Info Sidebar */}
          <div className="space-y-8">
            <div>
              <h3 className="mb-8">Contact Information</h3>
              <div className="space-y-8">
                {CONTACT_INFO.map((info, index) => (
                  <div key={index} className="flex items-start gap-4 group">
                    <div className="w-11 h-11 rounded-full bg-gray-100 center text-primary/50">
                      {info.icon}
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 uppercase tracking-wide mb-1">
                        {info.label}
                      </p>
                      {info.link ? (
                        <a
                          href={info.link}
                          className="text-gray-900 hover:text-primary transition-colors duration-300"
                        >
                          {info.value}
                        </a>
                      ) : (
                        <p className="text-gray-900">{info.value}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Social Links */}
            <div className="pt-8 border-t border-gray-200">
              <h4 className="text-lg font-light mb-4">Follow Us</h4>
              <div className="flex -ml-3.5">
                <IconButton color="bg-primary/10" icon={Facebook} />
                <IconButton color="bg-primary/10" icon={WhatsApp} />
                <IconButton color="bg-primary/10" icon={Instagram} />
              </div>
            </div>

            {/* FAQ Link */}
            <div className="pt-8 border-t border-gray-200">
              <h4 className="text-lg font-light mb-2">Quick Help</h4>
              <p className="text-sm text-gray-600 mb-4">
                Looking for answers? Check our FAQ section for instant
                solutions.
              </p>
              <button className="text-primary text-sm font-medium flx gap-2 group">
                Visit FAQ
                <ChevronRight
                  size={14}
                  className="group-hover:translate-x-1 tr"
                />
              </button>
            </div>
          </div>

          {/* Contact Form */}
          <div className="">
            <div className="space-y-6">
              {/* Name Input */}
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm text-gray-700 mb-2"
                >
                  Full Name
                </label>
                <div className="relative">
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="John Doe"
                  />
                </div>
              </div>

              {/* Email Input */}
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm text-gray-700 mb-2"
                >
                  Email Address
                </label>
                <div className="relative">
                  <Input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="john@example.com"
                  />
                </div>
              </div>

              {/* Subject Input */}
              <div>
                <label
                  htmlFor="subject"
                  className="block text-sm text-gray-700 mb-2"
                >
                  Subject
                </label>
                <div className="relative">
                  <Input
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    placeholder="How can we help you?"
                  />
                </div>
              </div>

              {/* Message Textarea */}
              <div>
                <label
                  htmlFor="message"
                  className="block text-sm text-gray-700 mb-2"
                >
                  Message
                </label>
                <div className="relative">
                  <Textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    className="min-h-40 max-h-64"
                    placeholder="Tell us more about your inquiry..."
                  />
                </div>
              </div>

              {/* Submit Button */}
              <Button className="w-full">Send Message</Button>

              {/* Privacy Note */}
              <p className="text-xs text-gray-500 text-center pt-2">
                We respect your privacy and will never share your information
                with third parties.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom CTA Section */}
        <div className="mt-24 text-center py-16 border-t border-gray-200">
          <h3 className="text-3xl font-light mb-4">
            Need Immediate Assistance?
          </h3>
          <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
            Our customer support team is available to help you with any urgent
            inquiries.
          </p>
          <Button variant="accent" size="md" className="w-48">
            <div className="flx gap-3">
              <MessagesSquare className="w-5 h-5" />
              Chat Now
            </div>
          </Button>
        </div>
      </div>
    </div>
  );
}
