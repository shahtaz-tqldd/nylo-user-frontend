"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import {
  ShoppingCart,
  Lock,
  CreditCard,
  Truck,
  Gift,
  AlertCircle,
  Check,
  CheckCircle,
} from "lucide-react";
import Button from "@/components/buttons/primary-button";
import { FloatingInput, Input } from "@/components/ui/input";
import Title from "@/components/ui/title";
import { useCartItemListQuery } from "@/features/products/productApiSlice";
import { useAppSelector } from "@/hooks/redux";
import { openAuthDialog } from "@/features/auth/authSlice";
import { useDispatch } from "react-redux";
import {
  useApplyCouponMutation,
  useCreateStripeCheckoutSessionMutation,
} from "@/features/orders/orderApiSlice";
import type { ApplyCouponResponse } from "@/features/orders/types";

interface ShippingInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  stateProvince: string;
  zipCode: string;
  country: string;
}

type ShippingField = keyof ShippingInfo;

const DEFAULT_COUNTRY = "United States";

const getStringValue = (value: unknown) =>
  typeof value === "string" ? value : "";

const getErrorMessage = (error: unknown, fallback: string) => {
  if (error && typeof error === "object") {
    const fetchError = error as FetchBaseQueryError & {
      data?: { message?: string; error?: string };
    };
    if (
      fetchError.data &&
      typeof fetchError.data === "object" &&
      fetchError.data !== null
    ) {
      const message =
        fetchError.data.message ??
        fetchError.data.error;
      if (typeof message === "string" && message.trim()) {
        return message;
      }
    }
  }

  if (error instanceof Error && error.message.trim()) {
    return error.message;
  }

  return fallback;
};

const CheckoutPage: React.FC = () => {
  const router = useRouter();
  const { isAuthenticated, user } = useAppSelector((state) => state.auth);
  const { data, isLoading, isFetching } = useCartItemListQuery(undefined, {
    skip: !isAuthenticated,
  });
  const [currentStep, setCurrentStep] = useState(1);
  const [shippingInfo, setShippingInfo] = useState<ShippingInfo>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    stateProvince: "",
    zipCode: "",
    country: DEFAULT_COUNTRY,
  });
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [promoCode, setPromoCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<ApplyCouponResponse | null>(
    null,
  );
  const [couponError, setCouponError] = useState<string | null>(null);
  const [couponSuccessMessage, setCouponSuccessMessage] = useState<string | null>(
    null,
  );
  const [shippingTouched, setShippingTouched] = useState<
    Partial<Record<ShippingField, boolean>>
  >({});
  const [showShippingErrors, setShowShippingErrors] = useState(false);
  const [checkoutError, setCheckoutError] = useState<string | null>(null);
  const [applyCoupon, { isLoading: isApplyingCoupon }] =
    useApplyCouponMutation();
  const [createStripeCheckoutSession, { isLoading: isCreatingStripeCheckout }] =
    useCreateStripeCheckoutSessionMutation();

  useEffect(() => {
    if (!user) {
      return;
    }

    const fullName = getStringValue(user.name).trim();
    const [fallbackFirstName = "", ...fallbackLastNameParts] = fullName.split(
      " ",
    );
    const addressLine1 = getStringValue(user.address_line_1).trim();
    const addressLine2 = getStringValue(user.address_line_2).trim();

    setShippingInfo((prev) => ({
      firstName:
        prev.firstName || getStringValue(user.first_name).trim() || fallbackFirstName,
      lastName:
        prev.lastName ||
        getStringValue(user.last_name).trim() ||
        fallbackLastNameParts.join(" "),
      email: prev.email || getStringValue(user.email).trim(),
      phone: prev.phone || getStringValue(user.phone).trim(),
      addressLine1: prev.addressLine1 || addressLine1,
      addressLine2: prev.addressLine2 || addressLine2,
      city: prev.city || getStringValue(user.city).trim(),
      stateProvince:
        prev.stateProvince || getStringValue(user.state_province).trim(),
      zipCode: prev.zipCode || getStringValue(user.postal_code).trim(),
      country:
        prev.country && prev.country !== DEFAULT_COUNTRY
          ? prev.country
          : getStringValue(user.country).trim() || prev.country,
    }));
  }, [user]);

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
  const couponSubtotal = Number(appliedCoupon?.subtotal ?? subtotal);
  const discount = Number(appliedCoupon?.discount_amount ?? 0);
  const total = Number(appliedCoupon?.total_amount ?? subtotal) + shipping;

  const handleInputChange = (field: keyof ShippingInfo, value: string) => {
    setShippingInfo((prev) => ({ ...prev, [field]: value }));
  };

  const handleShippingBlur = (field: ShippingField) => {
    setShippingTouched((prev) => ({ ...prev, [field]: true }));
  };

  const handlePromoApply = async () => {
    const code = promoCode.trim();

    setCouponError(null);
    setCouponSuccessMessage(null);
    setCheckoutError(null);

    if (!code) {
      setAppliedCoupon(null);
      setCouponError("Enter a coupon code.");
      return;
    }

    try {
      const response = await applyCoupon({ code }).unwrap();
      setAppliedCoupon(response.data);
      setCouponSuccessMessage(`Coupon ${response.data.coupon.code} applied.`);
    } catch (error) {
      setAppliedCoupon(null);
      setCouponError(getErrorMessage(error, "Unable to apply coupon."));
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
  const requiredShippingFields: ShippingField[] = [
    "firstName",
    "lastName",
    "email",
    "phone",
    "addressLine1",
    "city",
    "stateProvince",
    "zipCode",
    "country",
  ];
  const shippingFieldLabels: Record<ShippingField, string> = {
    firstName: "First name",
    lastName: "Last name",
    email: "Email",
    phone: "Phone number",
    addressLine1: "Address line 1",
    addressLine2: "Address line 2",
    city: "City",
    stateProvince: "State / Province",
    zipCode: "Postal code",
    country: "Country",
  };
  const isShippingInfoComplete = requiredShippingFields.every(
    (field) => shippingInfo[field].trim().length > 0,
  );
  const getShippingFieldError = (field: ShippingField) => {
    if (!requiredShippingFields.includes(field)) {
      return undefined;
    }

    if (shippingInfo[field].trim()) {
      return undefined;
    }

    if (!showShippingErrors && !shippingTouched[field]) {
      return undefined;
    }

    return `${shippingFieldLabels[field]} is required.`;
  };

  const handleShippingStepContinue = (nextStep: number) => {
    setCheckoutError(null);

    if (isCheckoutBlocked) {
      return;
    }

    if (!isShippingInfoComplete) {
      setShowShippingErrors(true);
      setShippingTouched(
        requiredShippingFields.reduce<Partial<Record<ShippingField, boolean>>>(
          (acc, field) => {
            acc[field] = true;
            return acc;
          },
          {},
        ),
      );
      return;
    }

    setCurrentStep(nextStep);
  };

  const handleCompleteOrder = async () => {
    setCheckoutError(null);

    if (isCheckoutBlocked) {
      return;
    }

    if (!isShippingInfoComplete) {
      setCurrentStep(1);
      handleShippingStepContinue(1);
      return;
    }

    if (paymentMethod !== "card") {
      setCheckoutError("Only Stripe card checkout is wired right now.");
      return;
    }

    try {
      const origin = window.location.origin;
      const response = await createStripeCheckoutSession({
        shipping_address: {
          first_name: shippingInfo.firstName.trim(),
          last_name: shippingInfo.lastName.trim(),
          email: shippingInfo.email.trim(),
          phone: shippingInfo.phone.trim(),
          address_line_1: shippingInfo.addressLine1.trim(),
          address_line_2: shippingInfo.addressLine2.trim(),
          city: shippingInfo.city.trim(),
          state_province: shippingInfo.stateProvince.trim(),
          postal_code: shippingInfo.zipCode.trim(),
          country: shippingInfo.country.trim(),
        },
        success_url: `${origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${origin}/checkout/cancel`,
        coupon_code: appliedCoupon?.coupon.code ?? undefined,
      }).unwrap();

      const checkoutUrl =
        response.data.checkout_url ?? response.data.checkoutUrl;

      if (checkoutUrl) {
        window.location.href = checkoutUrl;
        return;
      }

      throw new Error("Stripe checkout URL was missing from the API response.");
    } catch (error) {
      console.error("Creating Stripe checkout session failed:", error);
      setCheckoutError(
        error instanceof Error
          ? error.message
          : "Unable to start checkout right now.",
      );
    }
  };

  const dispatch = useDispatch();

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
                    <FloatingInput
                      label="First Name"
                      name="firstName"
                      value={shippingInfo.firstName}
                      error={getShippingFieldError("firstName")}
                      onChange={(e) =>
                        handleInputChange("firstName", e.target.value)
                      }
                      onBlur={() => handleShippingBlur("firstName")}
                    />
                    <FloatingInput
                      label="Last Name"
                      name="lastName"
                      value={shippingInfo.lastName}
                      error={getShippingFieldError("lastName")}
                      onChange={(e) =>
                        handleInputChange("lastName", e.target.value)
                      }
                      onBlur={() => handleShippingBlur("lastName")}
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FloatingInput
                      label="Email"
                      name="email"
                      value={shippingInfo.email}
                      error={getShippingFieldError("email")}
                      onChange={(e) =>
                        handleInputChange("email", e.target.value)
                      }
                      onBlur={() => handleShippingBlur("email")}
                    />
                    <FloatingInput
                      label="Phone Number"
                      name="phone"
                      value={shippingInfo.phone}
                      error={getShippingFieldError("phone")}
                      onChange={(e) =>
                        handleInputChange("phone", e.target.value)
                      }
                      onBlur={() => handleShippingBlur("phone")}
                    />
                  </div>

                  <FloatingInput
                    label="Address Line 1"
                    name="addressLine1"
                    value={shippingInfo.addressLine1}
                    error={getShippingFieldError("addressLine1")}
                    onChange={(e) =>
                      handleInputChange("addressLine1", e.target.value)
                    }
                    onBlur={() => handleShippingBlur("addressLine1")}
                  />

                  <FloatingInput
                    label="Address Line 2"
                    name="addressLine2"
                    value={shippingInfo.addressLine2}
                    onChange={(e) =>
                      handleInputChange("addressLine2", e.target.value)
                    }
                    onBlur={() => handleShippingBlur("addressLine2")}
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FloatingInput
                      label="City"
                      name="city"
                      value={shippingInfo.city}
                      error={getShippingFieldError("city")}
                      onChange={(e) =>
                        handleInputChange("city", e.target.value)
                      }
                      onBlur={() => handleShippingBlur("city")}
                    />
                    <FloatingInput
                      label="State / Province"
                      name="stateProvince"
                      value={shippingInfo.stateProvince}
                      error={getShippingFieldError("stateProvince")}
                      onChange={(e) =>
                        handleInputChange("stateProvince", e.target.value)
                      }
                      onBlur={() => handleShippingBlur("stateProvince")}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FloatingInput
                      label="Postal Code"
                      name="zipCode"
                      value={shippingInfo.zipCode}
                      error={getShippingFieldError("zipCode")}
                      onChange={(e) =>
                        handleInputChange("zipCode", e.target.value)
                      }
                      onBlur={() => handleShippingBlur("zipCode")}
                    />
                    <FloatingInput
                      label="Country"
                      name="country"
                      value={shippingInfo.country}
                      error={getShippingFieldError("country")}
                      onChange={(e) =>
                        handleInputChange("country", e.target.value)
                      }
                      onBlur={() => handleShippingBlur("country")}
                    />
                  </div>
                  {showShippingErrors && !isShippingInfoComplete ? (
                    <p className="text-sm text-red-500">
                      Fill in all required shipping fields to continue.
                    </p>
                  ) : null}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-16">
                    <Button
                      size="lg"
                      variant="accent"
                      onClick={() => router.push("/")}
                    >
                      Go Back to Cart
                    </Button>

                    <Button
                      onClick={() => handleShippingStepContinue(2)}
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
                        paymentMethod === "cod"
                          ? "border-primary/60 bg-primary/5"
                          : "border-gray-300"
                      }`}
                      onClick={() => setPaymentMethod("cod")}
                    >
                      <div className="flex items-center space-x-3">
                        <input
                          type="radio"
                          checked={paymentMethod === "cod"}
                          onChange={() => setPaymentMethod("cod")}
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
                      onClick={() => handleShippingStepContinue(3)}
                      disabled={isCheckoutBlocked || !isShippingInfoComplete}
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
                      {shippingInfo.addressLine1}
                      <br />
                      {shippingInfo.addressLine2 ? (
                        <>
                          {shippingInfo.addressLine2}
                          <br />
                        </>
                      ) : null}
                      {shippingInfo.city}, {shippingInfo.stateProvince}{" "}
                      {shippingInfo.zipCode}
                      <br />
                      {shippingInfo.country}
                    </p>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-6">
                    <h4>Payment Method</h4>
                    <p className="text-gray-600">
                      {paymentMethod === "card"
                        ? "Credit/Debit Card (via Stripe)"
                        : "Cash on Delivery"}
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
                      onClick={handleCompleteOrder}
                      disabled={
                        isCheckoutBlocked ||
                        !isShippingInfoComplete ||
                        isCreatingStripeCheckout
                      }
                    >
                      <div className="flx gap-3">
                        <Lock className="w-4 h-4" />
                        <span>
                          {isCreatingStripeCheckout
                            ? "Redirecting..."
                            : "Complete Order"}
                        </span>
                      </div>
                    </Button>
                  </div>
                  {checkoutError ? (
                    <p className="text-sm text-red-500">{checkoutError}</p>
                  ) : null}
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
                    <button
                      onClick={() => dispatch(openAuthDialog())}
                      className="text-primary underline"
                    >
                      Sign in
                    </button>{" "}
                    to continue with checkout.
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
                      onChange={(e) => {
                        setPromoCode(e.target.value);
                        setCouponError(null);
                        setCouponSuccessMessage(null);
                        setAppliedCoupon((prev) =>
                          prev?.coupon.code === e.target.value.trim() ? prev : null,
                        );
                      }}
                      placeholder="Promo code"
                      className="max-w-full"
                      icon={<Gift className="w-5 h-5" />}
                    />
                  </div>

                  <button
                    onClick={handlePromoApply}
                    disabled={isApplyingCoupon}
                    className="px-5 py-2 bg-primary hover:bg-black text-white text-sm rounded-lg tr"
                  >
                    {isApplyingCoupon ? "Applying..." : "Apply"}
                  </button>
                </div>
                {couponSuccessMessage ? (
                  <div className="mt-2 flex items-center space-x-2 text-sm text-green-600 px-1">
                    <span>{couponSuccessMessage}</span>
                  </div>
                ) : null}
                {couponError ? (
                  <div className="mt-2 flex items-center space-x-2 text-sm text-red-500 px-1">
                    <span>{couponError}</span>
                  </div>
                ) : null}
              </div>

              {/* Order Totals */}
              <div className="border-t border-gray-200 pt-4 space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="text-gray-900">
                    {formatPrice(couponSubtotal)}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Shipping</span>
                  <span className="text-gray-900">{formatPrice(shipping)}</span>
                </div>
                {appliedCoupon ? (
                  <div className="flex justify-between text-sm">
                    <span className="text-green-600">
                      Discount ({appliedCoupon.coupon.code})
                    </span>
                    <span className="text-green-600">
                      -{formatPrice(discount)}
                    </span>
                  </div>
                ) : null}
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
