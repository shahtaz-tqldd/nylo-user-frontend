import { CheckIcon } from "@/assets/algo-icons";
import Layout from "@/layouts/main";
import Link from "next/link";

export default function CheckoutSuccessPage() {
  return (
    <Layout>
      <section className="container py-32">
        <div className="mx-auto max-w-2xl p-8 text-center">
          <div className="bg-green-600 h-12 w-12 rounded-full center pt-1 mx-auto mb-4">
            <CheckIcon size={10} />
          </div>
          <h1 className="text-3xl font-semibold text-green-900">
            Payment completed
          </h1>
          <p className="mt-3 text-sm text-green-800">
            Your payment was successful! Thank you for your purchase. You can
            view your order details in your profile or continue shopping for
            more great products.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              href="/my-profile"
              className="rounded-lg bg-primary px-6 py-3 text-sm font-medium text-white"
            >
              Go to profile
            </Link>
            <Link
              href="/shop"
              className="rounded-lg border border-gray-300 bg-white px-6 py-3 text-sm font-medium text-gray-900"
            >
              Continue shopping
            </Link>
          </div>
        </div>
      </section>
    </Layout>
  );
}
