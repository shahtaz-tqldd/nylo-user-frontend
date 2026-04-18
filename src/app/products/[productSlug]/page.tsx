import { Suspense } from "react";
import Layout from "@/layouts/main";
import ProductDetailsPage from "@/templates/product-details";

export default async function ProductDetails({
  params,
}: {
  params: Promise<{ productSlug: string }>;
}) {
  const { productSlug } = await params;

  return (
    <Layout>
      <Suspense fallback={null}>
        <ProductDetailsPage productSlug={productSlug} />
      </Suspense>
    </Layout>
  );
}
