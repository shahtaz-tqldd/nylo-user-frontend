export interface Product {
  id?: string | number;
  title?: string;
  name?: string;
  description?: string;
  slug?: string;
  image_url?: string | null;
  image?: string | { src: string };
  price: string;
  compare_price?: string;
  discount?: string;
  discountPrice?: string;
  category_name?: string;
  brand?: string;
  gender?: string;
  in_stock?: boolean;
  total_stock?: number;
  variants_count?: number;
  sku?: string;
  features?: string[];
  specifications?: Record<string, string>;
  tags?: string[];
  category?: ProductCategory;
  variants?: ProductVariant[];
}

export interface ProductCategory {
  id: string;
  name: string;
  slug: string;
}

export interface ProductSize {
  id: string;
  name: string;
}

export interface ProductColor {
  id: string;
  name: string;
  color_code: string;
}

export interface ProductVariantSize {
  id: string;
  name: string;
  order: number;
}

export interface ProductVariant {
  id: string;
  size: ProductVariantSize;
  color: ProductColor;
  stock: number;
  image_url: string | null;
  sku: string;
  slug: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface ProductGender {
  value: string;
  label: string;
}

export interface ProductCollection {
  id: string;
  title: string;
  subtitle: string;
  type: string;
  description: string;
  image_url: string | null;
  slug: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface ProductSettings {
  categories: ProductCategory[];
  sizes: ProductSize[];
  colors: ProductColor[];
  collections: ProductCollection[];
  genders: ProductGender[];
}

export interface ProductListQueryParams {
  page?: number;
  page_size?: number;
  search?: string;
  category_id?: string;
  gender?: string[];
  size_ids?: string[];
  color_ids?: string[];
  min_price?: number;
  max_price?: number;
}

export interface AddToCartPayload{
  product_id: string;
  variant_id?: string;
  action: string;
}


export interface AddToFavouritePayload{
  product_id: string;
  action: string;
}

export interface CartItem {
  id?: string | number;
  product_id?: string | number;
  variant_id?: string | number | null;
  quantity?: number;
  unit_price?: string;
  total_price?: number | string;
  created_at?: string;
  updated_at?: string;
  product?: Product | null;
  variant?: ProductVariant | null;
}

export interface FavouriteItem {
  id?: string | number;
  product_id?: string | number;
  product?: Product | null;
}
