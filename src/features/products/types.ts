export interface Product {
  id?: string | number;
  title?: string;
  name?: string;
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
  variants_count?: number;
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
