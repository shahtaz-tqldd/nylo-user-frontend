"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  ShoppingCart,
  Lock,
  CreditCard,
  Truck,
  Gift,
  AlertCircle,
  Check,
  MapPinned,
  MapPinIcon,
  CheckCircle,
} from "lucide-react";
import Button from "@/components/buttons/primary-button";
import { FloatingInput, Input } from "@/components/ui/input";
import {
  CityIcon,
  EmailIcon,
  MapIcon,
  PhoneIcon,
  UserIcon,
  WorldIcon,
} from "@/assets/algo-icons";
import Title from "@/components/ui/title";
import { useCartItemListQuery } from "@/features/products/productApiSlice";
import { useAppSelector } from "@/hooks/redux";

interface ShippingInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  zipCode: string;
  country: string;
}

const CheckoutPage: React.FC = () => {
  const router = useRouter();
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  const { data, isLoading, isFetching } = useCartItemListQuery(undefined, {
    skip: !isAuthenticated,
  });
  const [currentStep, setCurrentStep] = useState(1);
  const [shippingInfo, setShippingInfo] = useState<ShippingInfo>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    zipCode: "",
    country: "United States",
  });
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [promoCode, setPromoCode] = useState("");
  const [promoApplied, setPromoApplied] = useState(false);

  const cartItems = data?.data ?? [];
  const cartCount = cartItems.reduce(
    (sum, item) => sum + (item.quantity ?? 0),
    0,
  );

  const subtotal = cartItems.reduce(
    (sum, item) => sum + Number(item.total_price ?? 0),
    0,
  );
  const shipping = 15.99;
  const discount = promoApplied ? subtotal * 0.1 : 0;
  const total = subtotal + shipping - discount;

  const handleInputChange = (field: keyof ShippingInfo, value: string) => {
    setShippingInfo((prev) => ({ ...prev, [field]: value }));
  };

  const handlePromoApply = () => {
    if (promoCode.toLowerCase() === "save10") {
      setPromoApplied(true);
    }
  };

  const isStepComplete = (step: number) => {
    if (step === 1) return currentStep > 1;
    if (step === 2) return currentStep > 2;
    return false;
  };

  const formatPrice = (value?: string | number) =>
    `$${Number(value ?? 0).toFixed(2)}`;

  const isCheckoutBlocked =
    !isAuthenticated || (!isLoading && !isFetching && !cartItems.length);

  return (
    <div className="container pt-32 pb-20">
      <div className="">
        {/* Header */}
        <div className="flbx mb-12">
          <div className="">
            <Title>Checkout</Title>
            <p className="text-gray-600">
              Complete your order in just a few steps
            </p>
          </div>

          {/* Progress Steps */}
          <div className="">
            <div className="flex items-center justify-center space-x-8">
              {[1, 2, 3].map((step) => (
                <div key={step} className="flex items-center">
                  <div
                    className={`center w-9 h-9 rounded-full tr ${
                      currentStep >= step
                        ? "bg-primary text-white"
                        : "bg-gray-100 text-gray-400"
                    } ${isStepComplete(step) ? "bg-green-600" : ""}`}
                  >
                    {isStepComplete(step) ? <Check size={16} /> : step}
                  </div>
                  <span
                    className={`ml-2 text-sm font-medium ${
                      currentStep >= step ? "text-primary" : "text-gray-400"
                    }`}
                  >
                    {step === 1
                      ? "Shipping"
                      : step === 2
                        ? "Payment"
                        : "Review"}
                  </span>
                  {step < 3 && (
                    <div
                      className={`ml-8 w-16 h-px ${
                        currentStep > step ? "bg-green-500" : "bg-gray-300"
                      }`}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex gap-8">
          {/* Main Content */}
          <div className="flex-1">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              {/* Step 1: Shipping Information */}
              {currentStep === 1 && (
                <div className="space-y-6">
                  <div className="flex items-center space-x-3 mb-6">
                    <Truck className="w-6 h-6 text-primary" />
                    <h4>Shipping Information</h4>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        First Name
                      </label>
                      <Input
                        icon={<UserIcon size={5} />}
                        placeholder="First Name"
                        value={shippingInfo.firstName}
                        onChange={(e) =>
                          handleInputChange("firstName", e.target.value)
                        }
                        />
                        </div> */}
                    <FloatingInput
                      label="First Name"
                      name="firstName"
                      value={shippingInfo.firstName}
                      onChange={(e) =>
                        handleInputChange("firstName", e.target.value)
                      }
                    />
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Last Name
                      </label>
                      <Input
                        icon={<UserIcon size={5} />}
                        placeholder="Last Name"
                        value={shippingInfo.lastName}
                        onChange={(e) =>
                          handleInputChange("lastName", e.target.value)
                        }
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email Address
                      </label>
                      <Input
                        icon={<EmailIcon size={5} />}
                        placeholder="example@email.com"
                        value={shippingInfo.email}
                        onChange={(e) =>
                          handleInputChange("email", e.target.value)
                        }
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Phone Number
                      </label>
                      <Input
                        icon={<PhoneIcon size={5} />}
                        placeholder="88993216"
                        value={shippingInfo.phone}
                        onChange={(e) =>
                          handleInputChange("phone", e.target.value)
                        }
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Address
                    </label>
                    <Input
                      icon={<MapIcon size={5} />}
                      placeholder="Address"
                      value={shippingInfo.address}
                      onChange={(e) =>
                        handleInputChange("address", e.target.value)
                      }
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        City
                      </label>
                      <Input
                        icon={<CityIcon size={5} />}
                        placeholder="Dhaka"
                        value={shippingInfo.city}
                        onChange={(e) =>
                          handleInputChange("city", e.target.value)
                        }
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        ZIP Code
                      </label>
                      <Input
                        icon={<WorldIcon size={5} />}
                        placeholder="Zip Code"
                        value={shippingInfo.zipCode}
                        onChange={(e) =>
                          handleInputChange("zipCode", e.target.value)
                        }
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Country
                      </label>
                      <Input
                        icon={<MapPinIcon size={20} />}
                        placeholder="Bangladesh"
                        value={shippingInfo.country}
                        onChange={(e) =>
                          handleInputChange("country", e.target.value)
                        }
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-16">
                    <Button
                      size="lg"
                      variant="accent"
                      onClick={() => router.push("/")}
                    >
                      Go Back to Cart
                    </Button>

                    <Button
                      onClick={() => setCurrentStep(2)}
                      disabled={isCheckoutBlocked}
                    >
                      Continue to Payment
                    </Button>
                  </div>
                </div>
              )}

              {/* Step 2: Payment Method */}
              {currentStep === 2 && (
                <div className="space-y-6">
                  <div className="flex items-center space-x-3 mb-6">
                    <CreditCard className="w-6 h-6 text-primary" />
                    <h4>Payment Method</h4>
                  </div>

                  <div className="space-y-4">
                    <div
                      className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                        paymentMethod === "card"
                          ? "border-primary/60 bg-primary/5"
                          : "border-gray-300"
                      }`}
                      onClick={() => setPaymentMethod("card")}
                    >
                      <div className="flex items-center space-x-3">
                        <input
                          type="radio"
                          checked={paymentMethod === "card"}
                          onChange={() => setPaymentMethod("card")}
                          className="text-green-500 focus:ring-green-500"
                        />
                        <span className="font-medium text-gray-900">
                          Credit/Debit Card
                        </span>
                      </div>
                      {paymentMethod === "card" && (
                        <div className="mt-4 p-4 bg-primary/10 border border-primary/30 rounded-lg">
                          <div className="flex items-center space-x-2">
                            <AlertCircle className="w-5 h-5 text-primary" />
                            <span className="text-primary text-sm">
                              Card payment will be processed securely through
                              Stripe on the next step.
                            </span>
                          </div>
                        </div>
                      )}
                    </div>

                    <div
                      className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                        paymentMethod === "paypal"
                          ? "border-primary/60 bg-primary/5"
                          : "border-gray-300"
                      }`}
                      onClick={() => setPaymentMethod("paypal")}
                    >
                      <div className="flex items-center space-x-3">
                        <input
                          type="radio"
                          checked={paymentMethod === "paypal"}
                          onChange={() => setPaymentMethod("paypal")}
                          className="text-green-500 focus:ring-green-500"
                        />

                        <span className="font-medium text-gray-900">
                          Cash on Delivery
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-12">
                    <Button
                      size="lg"
                      variant="accent"
                      onClick={() => setCurrentStep(1)}
                    >
                      Back
                    </Button>
                    <Button
                      size="lg"
                      onClick={() => setCurrentStep(3)}
                      disabled={isCheckoutBlocked}
                    >
                      Review Order
                    </Button>
                  </div>
                </div>
              )}

              {/* Step 3: Order Review */}
              {currentStep === 3 && (
                <div className="space-y-6">
                  <div className="flex items-center space-x-3 mb-6">
                    <CheckCircle className="w-6 h-6 text-primary" />
                    <h4>Review Your Order</h4>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-6 space-y-4">
                    <h4 className="font-medium text-gray-900">
                      Shipping Information
                    </h4>
                    <p className="text-gray-600">
                      {shippingInfo.firstName} {shippingInfo.lastName}
                      <br />
                      {shippingInfo.email}
                      <br />
                      {shippingInfo.address}
                      <br />
                      {shippingInfo.city}, {shippingInfo.zipCode}
                      <br />
                      {shippingInfo.country}
                    </p>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-6">
                    <h4>Payment Method</h4>
                    <p className="text-gray-600">
                      {paymentMethod === "card"
                        ? "Credit/Debit Card (via Stripe)"
                        : "PayPal"}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                    <Button
                      size="lg"
                      variant="accent"
                      onClick={() => setCurrentStep(2)}
                    >
                      Back
                    </Button>
                    <Button
                      size="lg"
                      isArrow={false}
                      disabled={isCheckoutBlocked}
                    >
                      <div className="flx gap-3">
                        <Lock className="w-4 h-4" />
                        <span>Complete Order</span>
                      </div>
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Order Summary Sidebar */}
          <div className="max-w-[480px] w-full">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sticky top-8">
              <div className="flex items-center space-x-3 mb-6">
                <ShoppingCart className="w-6 h-6 text-primary" />
                <h4>Order Summary {cartCount ? `(${cartCount})` : ""}</h4>
              </div>

              {/* Cart Items */}
              <div className="space-y-4 mb-6">
                {!isAuthenticated ? (
                  <p className="text-sm text-gray-500">
                    Sign in to continue with checkout.
                  </p>
                ) : isLoading || isFetching ? (
                  <p className="text-sm text-gray-500">Loading cart items...</p>
                ) : !cartItems.length ? (
                  <p className="text-sm text-gray-500">
                    Your cart is empty. Add an item before checkout.
                  </p>
                ) : (
                  cartItems.map((item) => (
                    <div key={item.id} className="flex items-center space-x-4">
                      <img
                        src={
                          item.variant?.image_url ??
                          item.product?.image_url ??
                          "https://placehold.co/200x200?text=Product"
                        }
                        alt={item.product?.title ?? "Cart item"}
                        className="w-16 h-16 object-cover rounded-lg"
                      />
                      <div className="flex-1 min-w-0 space-y-1">
                        <h5 className="font-medium truncate">
                          {item.product?.title ?? "Product"}
                        </h5>
                        <p className="text-sm">
                          Quantity: {item.quantity ?? 0}
                        </p>
                        <div className="flx gap-4">
                          {item.variant?.size?.name ? (
                            <p className="text-sm text-gray-500">
                              Size: {item.variant.size.name}
                            </p>
                          ) : null}
                          {item.variant?.color ? (
                            <p className="text-sm text-gray-500 flx gap-2">
                              Color:
                              <span
                                style={{
                                  backgroundColor:
                                    item.variant.color.color_code,
                                }}
                                className="h-2.5 w-2.5 rounded-full"
                              />
                              <span>{item.variant.color.name}</span>
                            </p>
                          ) : null}
                        </div>
                      </div>
                      <p className="text-sm font-medium text-gray-900">
                        {formatPrice(item.total_price ?? item.unit_price)}
                      </p>
                    </div>
                  ))
                )}
              </div>

              {/* Promo Code */}
              <div className="mb-6">
                <div className="w-full flex space-x-2">
                  <div className="w-full">
                    <Input
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value)}
                      placeholder="Promo code"
                      className="max-w-full"
                      icon={<Gift className="w-5 h-5" />}
                    />
                  </div>

                  <button
                    onClick={handlePromoApply}
                    className="px-5 py-2 bg-primary hover:bg-black text-white text-sm rounded-lg tr"
                  >
                    Apply
                  </button>
                </div>
                {promoApplied && (
                  <div className="mt-2 flex items-center space-x-2 text-sm text-green-600 px-1">
                    <span>10% discount applied!</span>
                  </div>
                )}
              </div>

              {/* Order Totals */}
              <div className="border-t border-gray-200 pt-4 space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="text-gray-900">{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Shipping</span>
                  <span className="text-gray-900">{formatPrice(shipping)}</span>
                </div>
                {promoApplied && (
                  <div className="flex justify-between text-sm">
                    <span className="text-green-600">Discount (10%)</span>
                    <span className="text-green-600">
                      -{formatPrice(discount)}
                    </span>
                  </div>
                )}
                <div className="border-t border-gray-200 pt-3 flex justify-between font-semibold text-lg">
                  <span className="text-gray-900">Total</span>
                  <span className="text-gray-900">{formatPrice(total)}</span>
                </div>
              </div>

              {/* Security Badge */}
              <div className="mt-12 flex items-center justify-center space-x-2 text-sm text-gray-500">
                <Lock className="w-4 h-4" />
                <span>Secure checkout with SSL encryption</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
