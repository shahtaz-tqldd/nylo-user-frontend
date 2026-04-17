export interface StoreConfig {
  id: string;
  name: string;
  tagline: string;
  description: string;
  logo: string | null;
  favicon: string | null;
  primary_color: string;
  accent_color: string;
  email: string;
  phone: string;
  address: string;
  currency: string;
  timezone: string;
  language: string;
  tax: string;
  facebook: string;
  whatsapp: string;
  instagram: string;
  created_at: string;
  updated_at: string;
}

export interface StoreConfigState {
  config: StoreConfig;
  isLoading: boolean;
  hasRemoteConfig: boolean;
  errorMessage: string | null;
}

export const fallbackStoreConfig: StoreConfig = {
  id: "fallback-store-config",
  name: "nylo",
  tagline: "premium shoe store",
  description:
    "Creating impact through clean design and seamless experience. Join us on our journey!",
  logo: "/logo.png",
  favicon: null,
  primary_color: "#a83838",
  accent_color: "#140b0b",
  email: "info@nylo.store",
  phone: "+880123456789",
  address: "123 Main Street, Dhaka, Bangladesh",
  currency: "USD",
  timezone: "America/Chicago",
  language: "en",
  tax: "0.15",
  facebook: "",
  whatsapp: "",
  instagram: "",
  created_at: "",
  updated_at: "",
};
