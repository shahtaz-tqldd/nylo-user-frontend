"use client";

import React, { useEffect, useMemo } from "react";
import MyProfileLayout from "../profile-layout";
import { FloatingInput } from "@/components/ui/input";
import Button from "@/components/buttons/primary-button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { CreditCard, Info } from "lucide-react";
import { Controller, useForm } from "react-hook-form";
import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import { useUpdateProfileMutation } from "@/features/auth/authApiSlice";
import { userLoggedOut } from "@/features/auth/authSlice";
import { useRouter } from "next/navigation";

interface ProfileFormValues {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  password: string;
  confirm_password: string;
  address_line_1: string;
  address_line_2: string;
  city: string;
  state_province: string;
  postal_code: string;
}

const SettingsPage = () => {
  const router = useRouter();
  const { user } = useAppSelector((state) => state.auth);
  const [updateProfile, { isLoading }] = useUpdateProfileMutation();

  const defaultValues = useMemo<ProfileFormValues>(
    () => ({
      first_name: (user?.first_name as string) || "",
      last_name: (user?.last_name as string) || "",
      email: (user?.email as string) || "",
      phone: (user?.phone as string) || "",
      password: "",
      confirm_password: "",
      address_line_1: (user?.address_line_1 as string) || "",
      address_line_2: (user?.address_line_2 as string) || "",
      city: (user?.city as string) || "",
      state_province: (user?.state_province as string) || "",
      postal_code: (user?.postal_code as string) || "",
    }),
    [user],
  );

  const profileForm = useForm<ProfileFormValues>({
    defaultValues,
    mode: "onChange",
  });

  const {
    control,
    handleSubmit,
    watch,
    reset,
    setError,
    clearErrors,
    formState: { errors, isDirty, dirtyFields },
  } = profileForm;

  useEffect(() => {
    reset(defaultValues);
  }, [defaultValues, reset]);

  const password = watch("password");
  const confirmPassword = watch("confirm_password");

  useEffect(() => {
    if (!password && !confirmPassword) {
      clearErrors("confirm_password");
      return;
    }

    if (confirmPassword && password !== confirmPassword) {
      setError("confirm_password", {
        type: "manual",
        message: "Passwords do not match",
      });
    } else {
      clearErrors("confirm_password");
    }
  }, [password, confirmPassword, setError, clearErrors]);

  const hasChanges = useMemo(() => {
    if (!isDirty) return false;

    // if confirm password changed but password is empty, still not valid for submit
    if ((password || confirmPassword) && password !== confirmPassword) {
      return false;
    }

    return true;
  }, [isDirty, password, confirmPassword]);

  const buildChangedPayload = (
    values: ProfileFormValues,
    dirty: typeof dirtyFields,
  ) => {
    const payload: Record<string, unknown> = {};

    if (dirty.first_name) {
      payload.first_name = values.first_name.trim();
    }
    if (dirty.last_name) {
      payload.last_name = values.last_name.trim();
    }

    if (dirty.email) {
      payload.email = values.email.trim();
    }
    if (dirty.phone) {
      payload.phone = values.phone.trim();
    }

    if (dirty.password && values.password.trim()) {
      payload.password = values.password;
    }

    if (dirty.address_line_1) {
      payload.address_line_1 = values.address_line_1.trim();
    }
    if (dirty.address_line_2) {
      payload.address_line_2 = values.address_line_2.trim();
    }
    if (dirty.city) {
      payload.city = values.city.trim();
    }
    if (dirty.state_province) {
      payload.state_province = values.state_province.trim();
    }
    if (dirty.postal_code) {
      payload.postal_code = values.postal_code.trim();
    }

    return payload;
  };

  const onSubmit = async (data: ProfileFormValues) => {
    if (
      (data.password || data.confirm_password) &&
      data.password !== data.confirm_password
    ) {
      setError("confirm_password", {
        type: "manual",
        message: "Passwords do not match",
      });
      return;
    }

    const payload = buildChangedPayload(data, dirtyFields);

    if (Object.keys(payload).length === 0) return;

    try {
      await updateProfile(payload);
      reset({
        ...data,
        password: "",
        confirm_password: "",
      });
    } catch (error) {
      console.error("Profile update failed:", error);
    }
  };
  const dispatch = useAppDispatch();
  const handleLogout = () => {
    dispatch(userLoggedOut());
    router.replace("/");
  };

  return (
    <MyProfileLayout>
      <div>
        <h3 className="text-xl font-semibold">Profile Settings</h3>

        <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-6">
          <div className="grid grid-cols-1 xl:grid-cols-[minmax(0,1.7fr)_360px] gap-6 items-start">
            {/* Account Information */}
            <div className="border border-gray-200 rounded-xl shadow-sm p-5 sm:p-6">
              <h4 className="mb-6 text-base font-semibold">
                Account Information
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Controller
                  name="first_name"
                  control={control}
                  rules={{
                    required: "First name is required",
                  }}
                  render={({ field }) => (
                    <FloatingInput
                      {...field}
                      label="First Name"
                      error={errors.first_name?.message}
                    />
                  )}
                />
                <Controller
                  name="last_name"
                  control={control}
                  rules={{
                    required: "Last name is required",
                  }}
                  render={({ field }) => (
                    <FloatingInput
                      {...field}
                      label="Last Name"
                      error={errors.last_name?.message}
                    />
                  )}
                />

                <Controller
                  name="email"
                  control={control}
                  rules={{
                    required: "Email is required",
                    pattern: {
                      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                      message: "Enter a valid email address",
                    },
                  }}
                  render={({ field }) => (
                    <FloatingInput
                      {...field}
                      label="Email Address"
                      type="email"
                      error={errors.email?.message}
                      className="col-span-2"
                    />
                  )}
                />
                <Controller
                  name="phone"
                  control={control}
                  rules={{
                    required: "Phone number is required",
                    pattern: {
                      value: /^\d{10}$/,
                      message: "Enter a valid 10-digit phone number",
                    },
                  }}
                  render={({ field }) => (
                    <FloatingInput
                      {...field}
                      label="Phone Number"
                      type="tel"
                      error={errors.phone?.message}
                      className="col-span-2"
                    />
                  )}
                />

                <Controller
                  name="password"
                  control={control}
                  rules={{
                    validate: (value) => {
                      if (!value) return true;
                      return (
                        value.length >= 6 ||
                        "Password must be at least 6 characters"
                      );
                    },
                  }}
                  render={({ field }) => (
                    <FloatingInput
                      {...field}
                      label="New Password"
                      type="password"
                      error={errors.password?.message}
                    />
                  )}
                />

                <Controller
                  name="confirm_password"
                  control={control}
                  rules={{
                    validate: (value) => {
                      if (!password && !value) return true;
                      if (value.length < 6)
                        return "Password must be at least 6 characters";
                      return value === password || "Passwords do not match";
                    },
                  }}
                  render={({ field }) => (
                    <FloatingInput
                      {...field}
                      label="Confirm Password"
                      type="password"
                      error={errors.confirm_password?.message}
                    />
                  )}
                />
              </div>
            </div>

            {/* Cards and Assistant Message Limit */}
            <div className="space-y-4 min-w-0">
              {/* Assistant Message Limit */}
              <div className="border border-gray-200 rounded-xl shadow-sm p-5 sm:p-6">
                <h4 className="mb-4 text-base font-semibold">
                  Assistant Message Limit
                </h4>

                <div className="flex items-center gap-3">
                  <p className="text-sm font-medium">30 messages</p>

                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <button type="button" className="inline-flex">
                          <Info className="w-4 h-4 text-muted-foreground cursor-pointer" />
                        </button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="text-xs">
                          Based on your purchase, you have
                          <br />
                          access to 30 assistant messages.
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>

                <div className="bg-yellow-50 border border-orange-300 p-3 rounded-lg mt-3">
                  <p className="text-xs !text-orange-700 font-medium">
                    Purchase more items to increase your messages and use this
                    to get AI assistance.
                  </p>
                </div>
              </div>

              {/* Saved Payment Methods */}
              <div className="border border-gray-200 rounded-xl shadow-sm p-5 sm:p-6">
                <h4 className="mb-4 text-base font-semibold">Saved Cards</h4>

                <div className="space-y-4">
                  <div className="flex items-center justify-between gap-4 border border-primary rounded-xl p-4">
                    <div className="flex items-center gap-3 min-w-0">
                      <CreditCard className="w-6 h-6 shrink-0" />
                      <div className="min-w-0">
                        <p className="text-sm font-medium truncate">
                          Visa **** 4242
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Expires 12/27
                        </p>
                      </div>
                    </div>

                    <Button
                      size="xs"
                      variant="alert"
                      type="button"
                      className="!pr-5"
                    >
                      Remove
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-[minmax(0,1.7fr)_360px] gap-6 items-start">
            {/* Shipping Information */}
            <div className="border border-gray-200 rounded-xl shadow-sm p-5 sm:p-6">
              <h4 className="mb-6 text-base font-semibold">
                Shipping Information
              </h4>

              <div className="grid grid-cols-6 gap-4">
                <Controller
                  name="address_line_1"
                  control={control}
                  render={({ field }) => (
                    <FloatingInput
                      {...field}
                      label="Address Line 1"
                      error={errors.address_line_1?.message}
                      className="md:col-span-3 col-span-6"
                    />
                  )}
                />

                <Controller
                  name="address_line_2"
                  control={control}
                  render={({ field }) => (
                    <FloatingInput
                      {...field}
                      label="Address Line 2"
                      error={errors.address_line_2?.message}
                      className="md:col-span-3 col-span-6"
                    />
                  )}
                />

                <Controller
                  name="city"
                  control={control}
                  render={({ field }) => (
                    <FloatingInput
                      {...field}
                      label="City"
                      error={errors.city?.message}
                      className="md:col-span-2 col-span-6"
                    />
                  )}
                />

                <Controller
                  name="state_province"
                  control={control}
                  render={({ field }) => (
                    <FloatingInput
                      {...field}
                      label="State/Province"
                      error={errors.state_province?.message}
                      className="md:col-span-2 col-span-6"
                    />
                  )}
                />

                <Controller
                  name="postal_code"
                  control={control}
                  render={({ field }) => (
                    <FloatingInput
                      {...field}
                      label="Postal Code"
                      error={errors.postal_code?.message}
                      className="md:col-span-2 col-span-6"
                    />
                  )}
                />
              </div>
            </div>
            <div className="border border-gray-200 rounded-xl shadow-sm p-5 sm:p-6">
              <div className="mb-6">
                <h4 className="text-base font-semibold">Account Control</h4>
                <p className="text-xs mt-1">
                  Control your account access, logout or delete your account
                  permanently.
                </p>
              </div>
              <Button
                onClick={handleLogout}
                variant="alert"
                size="xs"
                className="w-full"
              >
                Logout
              </Button>
              <Button
                variant="primary"
                size="xs"
                className="w-full mt-4 !bg-red-700"
              >
                Delete Account
              </Button>
            </div>
          </div>

          <div className="flex justify-start">
            <Button
              size="xs"
              type="submit"
              disabled={!hasChanges || isLoading}
              className={`mt-1 ${!hasChanges || isLoading ? "pointer-events-none opacity-50" : ""}`}
            >
              {isLoading ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </form>
      </div>
    </MyProfileLayout>
  );
};

export default SettingsPage;
