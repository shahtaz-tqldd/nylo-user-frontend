"use client";

import Button from "@/components/buttons/primary-button";
import { Facebook, Instagram, WhatsApp } from "@/assets/algo-icons";
import { FloatingInput } from "@/components/ui/input";
import { FloatingTextarea } from "@/components/ui/textarea";
import Title from "@/components/ui/title";
import { useSendEmailMutation } from "@/features/store/storeApiSlice";
import { useAppSelector } from "@/hooks/redux";
import { ChevronRight, MessagesSquare } from "lucide-react";
import Link from "next/link";
import React, { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";

type ContactFormState = {
  name: string;
  email: string;
  subject: string;
  message: string;
};

type ContactFormErrors = Partial<Record<keyof ContactFormState, string>>;

const INITIAL_FORM_STATE: ContactFormState = {
  name: "",
  email: "",
  subject: "",
  message: "",
};

const getUserDisplayName = (user: Record<string, unknown> | null) => {
  if (!user) return "";

  const explicitName = typeof user.name === "string" ? user.name.trim() : "";
  if (explicitName) return explicitName;

  const firstName =
    typeof user.first_name === "string" ? user.first_name.trim() : "";
  const lastName =
    typeof user.last_name === "string" ? user.last_name.trim() : "";

  return [firstName, lastName].filter(Boolean).join(" ");
};

const createContactInfo = ({
  email,
  phone,
  address,
}: {
  email: string;
  phone: string;
  address: string;
}) => [
  {
    label: "Email",
    value: email,
    link: email ? `mailto:${email}` : "",
    icon: (
      <svg
        className="w-6 h-6"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1}
          d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
        />
      </svg>
    ),
  },
  {
    label: "Phone",
    value: phone,
    link: phone ? `tel:${phone}` : "",
    icon: (
      <svg
        className="w-6 h-6"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1}
          d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
        />
      </svg>
    ),
  },
  {
    label: "Address",
    value: address,
    link: "",
    icon: (
      <svg
        className="w-6 h-6"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1}
          d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
        />
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1}
          d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
        />
      </svg>
    ),
  },
  {
    label: "Hours",
    value: "Mon - Fri: 9AM - 6PM",
    link: "",
    icon: (
      <svg
        className="w-6 h-6"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1}
          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    ),
  },
];

const createSocialLinks = ({
  facebook,
  instagram,
  whatsapp,
}: {
  facebook: string;
  instagram: string;
  whatsapp: string;
}) => [
  { label: "Facebook", icon: Facebook, href: facebook },
  {
    label: "WhatsApp",
    icon: WhatsApp,
    href: whatsapp.startsWith("http")
      ? whatsapp
      : whatsapp
        ? `https://wa.me/${whatsapp.replace(/[^\d]/g, "")}`
        : "",
  },
  { label: "Instagram", icon: Instagram, href: instagram },
];

export default function ContactUsPage() {
  const { config } = useAppSelector((state) => state.store);
  const { isAuthenticated, user } = useAppSelector((state) => state.auth);
  const [sendEmail, { isLoading: isSending }] = useSendEmailMutation();
  const [formData, setFormData] = useState<ContactFormState>(INITIAL_FORM_STATE);
  const [errors, setErrors] = useState<ContactFormErrors>({});

  const contactInfo = useMemo(
    () =>
      createContactInfo({
        email: config.email,
        phone: config.phone,
        address: config.address,
      }),
    [config.address, config.email, config.phone],
  );

  const socialLinks = useMemo(
    () =>
      createSocialLinks({
        facebook: config.facebook,
        instagram: config.instagram,
        whatsapp: config.whatsapp,
      }),
    [config.facebook, config.instagram, config.whatsapp],
  );

  useEffect(() => {
    if (!isAuthenticated || !user) return;

    const displayName = getUserDisplayName(user as Record<string, unknown>);
    const email = typeof user.email === "string" ? user.email : "";

    setFormData((current) => ({
      ...current,
      name: current.name || displayName,
      email: current.email || email,
    }));
  }, [isAuthenticated, user]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;

    setFormData((current) => ({
      ...current,
      [name]: value,
    }));

    setErrors((current) => ({
      ...current,
      [name]: undefined,
    }));
  };

  const validateForm = () => {
    const nextErrors: ContactFormErrors = {};

    if (!formData.name.trim()) nextErrors.name = "Name is required.";
    if (!formData.email.trim()) {
      nextErrors.email = "Email is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      nextErrors.email = "Enter a valid email address.";
    }
    if (!formData.subject.trim()) nextErrors.subject = "Subject is required.";
    if (!formData.message.trim()) nextErrors.message = "Message is required.";

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("Please complete the required fields.");
      return;
    }

    try {
      const response = await sendEmail({
        name: formData.name.trim(),
        email: formData.email.trim(),
        subject: formData.subject.trim(),
        message: formData.message.trim(),
        to_email: config.email,
      }).unwrap();

      toast.success(response?.message || "Message sent successfully.");
      setFormData((current) => ({
        ...INITIAL_FORM_STATE,
        name: isAuthenticated ? current.name : "",
        email: isAuthenticated ? current.email : "",
      }));
      setErrors({});
    } catch (error: any) {
      toast.error(
        error?.data?.message || "Unable to send your message right now.",
      );
    }
  };

  const whatsappHref = socialLinks.find((item) => item.label === "WhatsApp")?.href;

  return (
    <div className="min-h-screen px-6 pt-32">
      <div className="mx-auto max-w-5xl">
        <div className="mx-auto flex max-w-2xl flex-col items-center gap-4 text-center">
          <p className="text-sm uppercase tracking-[3px] text-gray-400">
            Get in Touch
          </p>
          <Title>
            We&apos;d <span className="text-primary">Love to Hear</span> From You
          </Title>
          <p className="text-lg text-gray-600">
            Have a question about our products or need assistance? Our team is
            here to help you every step of the way.
          </p>
        </div>

        <div className="mt-20 grid grid-cols-1 gap-16 lg:grid-cols-2">
          <div className="space-y-8">
            <div>
              <h3 className="mb-8">Contact Information</h3>
              <div className="space-y-8">
                {contactInfo.map((info) => (
                  <div key={info.label} className="group flex items-start gap-4">
                    <div className="center h-11 w-11 rounded-full bg-gray-100 text-primary/50">
                      {info.icon}
                    </div>
                    <div>
                      <p className="mb-1 text-sm uppercase tracking-wide text-gray-500">
                        {info.label}
                      </p>
                      {info.link ? (
                        <a
                          href={info.link}
                          className="text-gray-900 transition-colors duration-300 hover:text-primary"
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

            <div className="border-t border-gray-200 pt-8">
              <h4 className="mb-4 text-lg font-light">Follow Us</h4>
              <div className="flex flex-wrap gap-3">
                {socialLinks
                  .filter((item) => item.href)
                  .map(({ label, icon: Icon, href }) => (
                    <a
                      key={label}
                      href={href}
                      target="_blank"
                      rel="noreferrer"
                      aria-label={label}
                      className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary transition hover:bg-primary hover:text-white"
                    >
                      <Icon size={6} />
                    </a>
                  ))}
              </div>
            </div>

            <div className="border-t border-gray-200 pt-8">
              <h4 className="mb-2 text-lg font-light">Quick Help</h4>
              <p className="mb-4 text-sm text-gray-600">
                Looking for answers? Check our FAQ section for instant
                solutions.
              </p>
              <Link
                href="/faq"
                className="flx group gap-2 text-sm font-medium text-primary"
              >
                Visit FAQ
                <ChevronRight
                  size={14}
                  className="tr group-hover:translate-x-1"
                />
              </Link>
            </div>
          </div>

          <div>
            <form className="space-y-6" onSubmit={handleSubmit}>
              <FloatingInput
                name="name"
                label="Full Name"
                value={formData.name}
                onChange={handleChange}
                autoComplete="name"
                error={errors.name}
              />

              <FloatingInput
                type="email"
                name="email"
                label="Email Address"
                value={formData.email}
                onChange={handleChange}
                autoComplete="email"
                error={errors.email}
              />

              <FloatingInput
                name="subject"
                label="Subject"
                value={formData.subject}
                onChange={handleChange}
                error={errors.subject}
              />

              <FloatingTextarea
                name="message"
                label="Message"
                value={formData.message}
                onChange={handleChange}
                error={errors.message}
                className="min-h-40"
              />

              <Button
                type="submit"
                className="w-full disabled:cursor-not-allowed disabled:opacity-60"
                disabled={isSending}
              >
                {isSending ? "Sending..." : "Send Message"}
              </Button>

              <p className="pt-2 text-center text-xs text-gray-500">
                We respect your privacy and will never share your information
                with third parties.
              </p>
            </form>
          </div>
        </div>

        <div className="mt-24 border-t border-gray-200 py-16 text-center">
          <h3 className="mb-4 text-3xl font-light">Need Immediate Assistance?</h3>
          <p className="mx-auto mb-8 max-w-2xl text-gray-600">
            Our customer support team is available to help you with any urgent
            inquiries.
          </p>
          <Button
            variant="accent"
            size="md"
            className="w-48"
            link={whatsappHref || null}
          >
            <div className="flx gap-3">
              <MessagesSquare className="h-5 w-5" />
              Chat Now
            </div>
          </Button>
        </div>
      </div>
    </div>
  );
}
