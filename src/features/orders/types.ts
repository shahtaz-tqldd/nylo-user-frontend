export interface ShippingAddressPayload {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  address_line_1: string;
  address_line_2?: string;
  city: string;
  state_province: string;
  postal_code: string;
  country: string;
}

export interface CreateStripeCheckoutSessionPayload {
  shipping_address: ShippingAddressPayload;
  success_url: string;
  cancel_url: string;
  promo_code?: string;
}

export interface CreateStripeCheckoutSessionResponse {
  session_id?: string;
  sessionId?: string;
  checkout_url?: string;
  checkoutUrl?: string;
  order_id?: string;
  orderId?: string;
}

export interface OrderShippingAddress {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  address_line_1: string;
  address_line_2?: string;
  city: string;
  state_province: string;
  postal_code: string;
  country: string;
}

export interface OrderLineItem {
  id: string;
  product_id: string;
  variant_id: string;
  product_title: string;
  variant_description: string;
  sku: string;
  quantity: number;
  unit_price: string;
  total_price: string;
}

export interface OrderItem {
  id: string;
  tracking_number: string;
  status: string;
  payment_status: string;
  currency: string;
  subtotal: string;
  discount_amount: string;
  shipping_charge: string;
  tax_amount: string;
  total_amount: string;
  promo_code: string | null;
  shipping_address: OrderShippingAddress;
  stripe_checkout_session_id: string | null;
  stripe_payment_intent_id: string | null;
  checkout_expires_at: string | null;
  created_at: string;
  updated_at: string;
  items: OrderLineItem[];
}

export interface UpdateOrderPayload {
  order_id: string;
  action: "cancel" | "refund";
}
