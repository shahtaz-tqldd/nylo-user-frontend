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


export interface OrderItem {
  id: string;
  product_id: string;
  product_name: string;
  product_slug: string;
  product_image: string;
  quantity: number;
  price: number;
  total_price: number;
  order_id: string;
}