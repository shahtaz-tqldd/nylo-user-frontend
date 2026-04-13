import Layout from "@/layouts/main";
import Link from "next/link";

export default function CheckoutCancelPage() {
  return (
    <Layout>
      <section className="container pt-32 pb-20">
        <div className="mx-auto max-w-2xl rounded-2xl border border-amber-200 bg-amber-50 p-8 text-center">
          <h1 className="text-3xl font-semibold text-amber-900">
            Checkout canceled
          </h1>
          <p className="mt-3 text-sm text-amber-800">
            No payment was completed. You can return to checkout and try again.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              href="/checkout"
              className="rounded-lg bg-primary px-6 py-3 text-sm font-medium text-white"
            >
              Back to checkout
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
