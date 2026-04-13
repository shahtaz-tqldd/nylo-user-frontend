import Layout from "@/layouts/main";
import Link from "next/link";

export default function CheckoutSuccessPage() {
  return (
    <Layout>
      <section className="container pt-32 pb-20">
        <div className="mx-auto max-w-2xl rounded-2xl border border-green-200 bg-green-50 p-8 text-center">
          <h1 className="text-3xl font-semibold text-green-900">
            Payment completed
          </h1>
          <p className="mt-3 text-sm text-green-800">
            Stripe sent you back successfully. Your backend should now confirm
            the payment through a webhook and mark the order as paid.
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
