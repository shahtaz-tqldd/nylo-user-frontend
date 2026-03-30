"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { FloatingInput } from "@/components/ui/input";
import Button from "../buttons/primary-button";
import IconButton from "../buttons/icon-button";
import { User } from "lucide-react";
import { Controller, useForm } from "react-hook-form";
import { Checkbox } from "../ui/checkbox";
import {
  useLoginMutation,
  useMeQuery,
  useRegistrationMutation,
} from "@/features/auth/authApiSlice";
import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import {
  userDetailsFetched,
  userLoggedIn,
} from "@/features/auth/authSlice";
import type {
  AuthResponseData,
  LoginPayload,
  RegisterPayload,
} from "@/features/auth/types";

const AuthDialog = () => {
  const [open, setOpen] = useState(false);
  const { isAuthenticated } = useAppSelector((state) => state.auth);

  if (isAuthenticated) {
    return null;
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {/* Trigger Button */}
      <DialogTrigger asChild>
        <IconButton icon={User} size={20} />
      </DialogTrigger>

      {/* Dialog Box */}
      <DialogContent className="max-w-sm rounded-2xl">
        <DialogHeader>
          <DialogTitle></DialogTitle>
          <div>
            <p className="text-center text-sm">Let's Get Started</p>
            <h4 className="text-center mt-1">
              We'd Love to have you on{" "}
              <span className="text-primary">nylo</span>
            </h4>
          </div>
        </DialogHeader>

        {/* Tabs */}
        <div className="mt-4">
          <AuthTabs onAuthenticated={() => setOpen(false)} />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AuthDialog;

interface AuthTabsProps {
  onAuthenticated: () => void;
}

interface LoginFormValues {
  email: string;
  password: string;
  rememberMe: boolean;
}

interface SignUpFormValues extends RegisterPayload {}

const getAuthTokens = (payload?: AuthResponseData) => {
  if (!payload) {
    return null;
  }

  const accessToken = payload.accessToken ?? payload.access_token;
  const refreshToken = payload.refreshToken ?? payload.refresh_token;

  if (!accessToken || !refreshToken) {
    return null;
  }

  return {
    accessToken,
    refreshToken,
  };
};

const AuthTabs = ({ onAuthenticated }: AuthTabsProps) => {
  const dispatch = useAppDispatch();
  const [activeTab, setActiveTab] = useState<"login" | "signup">("login");
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [login, { isLoading: isLoginLoading }] = useLoginMutation();
  const [register, { isLoading: isRegisterLoading }] = useRegistrationMutation();
  const { refetch: refetchMe } = useMeQuery(undefined, { skip: true });

  const loginForm = useForm<LoginFormValues>({
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
  });

  const signupForm = useForm<SignUpFormValues>({
    defaultValues: {
      first_name: "",
      last_name: "",
      email: "",
      password: "",
      confirm_password: "",
      remember_me: true,
    },
  });

  const handleAuthSuccess = async (
    payload: AuthResponseData | undefined,
    rememberMe: boolean,
  ) => {
    const tokens = getAuthTokens(payload);

    if (!tokens) {
      return false;
    }

    dispatch(
      userLoggedIn({
        ...tokens,
        rememberMe,
      }),
    );

    if (payload?.user) {
      dispatch(userDetailsFetched(payload.user));
    }

    try {
      const meResponse = await refetchMe().unwrap();
      dispatch(userDetailsFetched(meResponse.data));
    } catch (error) {
      console.error("Fetching current user failed:", error);
    }

    onAuthenticated();
    return true;
  };

  const {
    control,
    formState: { errors },
    handleSubmit,
  } = loginForm;

  const {
    control: signupControl,
    formState: { errors: signupErrors },
    handleSubmit: handleSignupSubmit,
    watch,
  } = signupForm;

  const onLoginSubmit = async (data: LoginFormValues) => {
    setSubmitError(null);

    try {
      const res = await login({
        email: data.email,
        password: data.password,
        remember_me: data.rememberMe,
      } satisfies LoginPayload).unwrap();

      if (res.success) {
        const authenticated = await handleAuthSuccess(res.data, data.rememberMe);
        if (!authenticated) {
          setSubmitError(res.message ?? "Login succeeded but token payload was missing.");
        }
      }
    } catch (error) {
      console.error("Login failed:", error);
      setSubmitError("Unable to sign in. Check your credentials and try again.");
    }
  };

  const onRegisterSubmit = async (data: SignUpFormValues) => {
    setSubmitError(null);

    try {
      const res = await register(data).unwrap();

      if (res.success) {
        const authenticated = await handleAuthSuccess(
          res.data,
          data.remember_me ?? true,
        );

        if (!authenticated) {
          signupForm.reset();
          setActiveTab("login");
        }
      }
    } catch (error) {
      console.error("Registration failed:", error);
      setSubmitError("Unable to create your account right now.");
    }
  };

  const isLoading = isLoginLoading || isRegisterLoading;

  return (
    <Tabs
      value={activeTab}
      onValueChange={(value) => {
        setActiveTab(value as "login" | "signup");
        setSubmitError(null);
      }}
      className="w-full"
    >
      <TabsList className="grid grid-cols-2 w-full bg-gray-100 rounded-xl mb-8">
        <TabsTrigger value="login">Login</TabsTrigger>
        <TabsTrigger value="signup">Sign Up</TabsTrigger>
      </TabsList>

      {/* LOGIN FORM */}
      <TabsContent value="login">
        <form onSubmit={handleSubmit(onLoginSubmit)} className="space-y-5">
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
              />
            )}
          />

          <Controller
            name="password"
            control={control}
            rules={{
              required: "Password is required",
              minLength: {
                value: 6,
                message: "Password must be at least 6 characters",
              },
            }}
            render={({ field }) => (
              <FloatingInput
                {...field}
                label="Password"
                type="password"
                error={errors.password?.message}
              />
            )}
          />

          <div className="flex items-center justify-between gap-4">
            <Controller
              name="rememberMe"
              control={control}
              render={({ field }) => (
                <div className="flex items-center gap-2">
                  <Checkbox
                    id="rememberMe"
                    checked={field.value}
                    onCheckedChange={(checked) =>
                      field.onChange(Boolean(checked))
                    }
                  />
                  <label
                    htmlFor="rememberMe"
                    className="cursor-pointer text-sm text-slate-600"
                  >
                    Remember me
                  </label>
                </div>
              )}
            />

            <a
              href="/forgot-password"
              className="text-sm font-medium text-slate-900 underline underline-offset-4 transition hover:text-slate-700"
            >
              Forgot password?
            </a>
          </div>

          <Button type="submit" disabled={isLoading} className="w-full">
            {isLoading ? "Signing in..." : "Sign In"}
          </Button>
          {submitError ? (
            <p className="text-sm text-red-500">{submitError}</p>
          ) : null}
          <div className="border-t border-t-gray-200 border-b-none" />

          <Button type="button" variant="rubix" className="w-full">
            <div className="flx gap-2.5">
              <GoogleIcon />
              <span>Continue with Google</span>
            </div>
          </Button>
        </form>
      </TabsContent>

      {/* SIGNUP FORM */}
      <TabsContent value="signup">
        <form onSubmit={handleSignupSubmit(onRegisterSubmit)} className="space-y-5">
          <div className="grid grid-cols-2 gap-3">
            <Controller
              name="first_name"
              control={signupControl}
              rules={{
                required: "First name is required",
              }}
              render={({ field }) => (
                <FloatingInput
                  {...field}
                  label="First Name"
                  type="text"
                  error={signupErrors.first_name?.message}
                />
              )}
            />

            <Controller
              name="last_name"
              control={signupControl}
              rules={{
                required: "Last name is required",
              }}
              render={({ field }) => (
                <FloatingInput
                  {...field}
                  label="Last Name"
                  type="text"
                  error={signupErrors.last_name?.message}
                />
              )}
            />
          </div>

          <Controller
            name="email"
            control={signupControl}
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
                  error={signupErrors.email?.message}
                />
              )}
            />

          <Controller
            name="password"
            control={signupControl}
            rules={{
              required: "Password is required",
              minLength: {
                value: 6,
                message: "Password must be at least 6 characters",
              },
            }}
            render={({ field }) => (
                <FloatingInput
                  {...field}
                  label="Password"
                  type="password"
                  error={signupErrors.password?.message}
                />
              )}
            />
          <Controller
            name="confirm_password"
            control={signupControl}
            rules={{
              required: "Confirm Password is required",
              validate: (value) => {
                if (value !== watch("password")) {
                  return "Passwords do not match";
                }

                return true;
              },
            }}
            render={({ field }) => (
              <FloatingInput
                  {...field}
                  label="Confirm Password"
                  type="password"
                  error={signupErrors.confirm_password?.message}
                />
              )}
          />

          <Controller
            name="remember_me"
            control={signupControl}
            render={({ field }) => (
              <div className="flex items-center gap-2">
                <Checkbox
                  id="signupRememberMe"
                  checked={field.value}
                  onCheckedChange={(checked) => field.onChange(Boolean(checked))}
                />
                <label
                  htmlFor="signupRememberMe"
                  className="cursor-pointer text-sm text-slate-600"
                >
                  Keep me signed in
                </label>
              </div>
            )}
          />

          <Button type="submit" disabled={isLoading} className="w-full">
            {isLoading ? "Creating account..." : "Create Account"}
          </Button>
          {submitError ? (
            <p className="text-sm text-red-500">{submitError}</p>
          ) : null}

          <div className="border-t border-t-gray-200 border-b-none" />

          <Button type="button" variant="rubix" className="w-full">
            <div className="flx gap-2.5">
              <GoogleIcon />
              <span>Sign up with Google</span>
            </div>
          </Button>
        </form>
      </TabsContent>
    </Tabs>
  );
};

const GoogleIcon = () => {
  return (
    <svg
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="h-5 w-5"
    >
      <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
      <g
        id="SVGRepo_tracerCarrier"
        stroke-linecap="round"
        stroke-linejoin="round"
      ></g>
      <g id="SVGRepo_iconCarrier">
        <path
          d="M30.0014 16.3109C30.0014 15.1598 29.9061 14.3198 29.6998 13.4487H16.2871V18.6442H24.1601C24.0014 19.9354 23.1442 21.8798 21.2394 23.1864L21.2127 23.3604L25.4536 26.58L25.7474 26.6087C28.4458 24.1665 30.0014 20.5731 30.0014 16.3109Z"
          fill="#4285F4"
        ></path>
        <path
          d="M16.2863 29.9998C20.1434 29.9998 23.3814 28.7553 25.7466 26.6086L21.2386 23.1863C20.0323 24.0108 18.4132 24.5863 16.2863 24.5863C12.5086 24.5863 9.30225 22.1441 8.15929 18.7686L7.99176 18.7825L3.58208 22.127L3.52441 22.2841C5.87359 26.8574 10.699 29.9998 16.2863 29.9998Z"
          fill="#34A853"
        ></path>
        <path
          d="M8.15964 18.769C7.85806 17.8979 7.68352 16.9645 7.68352 16.0001C7.68352 15.0356 7.85806 14.1023 8.14377 13.2312L8.13578 13.0456L3.67083 9.64746L3.52475 9.71556C2.55654 11.6134 2.00098 13.7445 2.00098 16.0001C2.00098 18.2556 2.55654 20.3867 3.52475 22.2845L8.15964 18.769Z"
          fill="#FBBC05"
        ></path>
        <path
          d="M16.2864 7.4133C18.9689 7.4133 20.7784 8.54885 21.8102 9.4978L25.8419 5.64C23.3658 3.38445 20.1435 2 16.2864 2C10.699 2 5.8736 5.1422 3.52441 9.71549L8.14345 13.2311C9.30229 9.85555 12.5086 7.4133 16.2864 7.4133Z"
          fill="#EB4335"
        ></path>
      </g>
    </svg>
  );
};
