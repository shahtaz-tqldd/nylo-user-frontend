import { Suspense } from "react";
import Layout from "@/layouts/main";
import ShopPage from "@/templates/shop";

export default function Shop() {
  return (
    <Layout>
      <Suspense fallback={null}>
        <ShopPage />
      </Suspense>
    </Layout>
  );
}
