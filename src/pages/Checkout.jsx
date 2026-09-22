
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useTranslation } from "react-i18next";
import { getCheckoutSchema } from "../schema/checkoutSchema";
import { getCart, applyCoupon } from "../api/cart.api";
import { createOrder } from "../api/orders.api";
import toast from "react-hot-toast";
import { Loader2 } from "lucide-react";

export default function Checkout() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [cartItems, setCartItems] = useState([]);
  const [loadingCart, setLoadingCart] = useState(true);
  const [loading, setLoading] = useState(false);
  const [couponCode, setCouponCode] = useState("");
  const [discount, setDiscount] = useState(0);
  const [couponApplied, setCouponApplied] = useState(false);
  const [couponLoading, setCouponLoading] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(getCheckoutSchema(t)),
    defaultValues: {
      deliveryMethod: "standard",
      paymentMethod: "cash",
      country: "Egypt",
    },
  });

  const selectedPaymentMethod = watch("paymentMethod");
  const selectedDelivery = watch("deliveryMethod");

  // =========================
  // Load Cart
  // =========================
  useEffect(() => {
    const loadCart = async () => {
      try {
        setLoadingCart(true);
        const res = await getCart();

        const items =
          res?.data?.items ||
          res?.data?.cart?.items ||
          res?.data?.data?.items ||
          res?.data?.products ||
          [];

        if (!Array.isArray(items) || items.length === 0) {
          toast.error(t("checkout.cartEmpty"));
          navigate("/cart");
          return;
        }

        setCartItems(items);
      } catch (err) {
        console.error("Failed to load cart:", err);

        toast.error(
          err.response?.data?.message || t("checkout.loadCartError")
        );

        navigate("/cart");
      } finally {
        setLoadingCart(false);
      }
    };

    loadCart();
  }, [navigate, t]);

  // =========================
  // Calculations
  // =========================
  const getItemPrice = (item) => {
    return (
      item.price ||
      item.product?.discountPrice ||
      item.product?.price ||
      0
    );
  };

  const subtotal = cartItems.reduce(
    (acc, item) => acc + getItemPrice(item) * (item.quantity || 1),
    0
  );

  const shippingCost = selectedDelivery === "express" ? 6.99 : 0;
  const tax = subtotal * 0.14;
  const total = subtotal - discount + shippingCost + tax;

  // =========================
  // Submit Order
  // =========================
  const onSubmit = async (data) => {
    try {
      setLoading(true);

      const orderData = {
        shippingAddress: {
          fullName: data.fullName,
          phone: data.phone,
          country: data.country,
          city: data.city,
          address: data.address,
          postalCode: data.postalCode,
        },
        paymentMethod: data.paymentMethod,
      };

      console.log("Order Data:", orderData);

      const res = await createOrder(orderData);

      console.log("Order Response:", res?.data);

      toast.success(t("checkout.orderSuccess"));

      const orderId = res?.data?.order?._id;

      if (orderId) {
        navigate(`/orders/${orderId}`);
      } else {
        navigate("/orders");
      }
    } catch (error) {
      console.error("Error placing order:", error);
      console.error("Response:", error.response?.data);

      const errorMsg =
        error.response?.data?.errors?.join(", ") ||
        error.response?.data?.message ||
        t("checkout.orderError");

      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // Apply Coupon
  // =========================
  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) {
      toast.error(t("checkout.enterCoupon"));
      return;
    }

    try {
      setCouponLoading(true);

      const res = await applyCoupon({ code: couponCode.trim() });

      console.log("Coupon Response:", res?.data);

      const discountValue =
        res?.data?.discount ||
        res?.data?.coupon?.discount ||
        res?.data?.discountAmount ||
        res?.data?.data?.discount ||
        0;

      if (discountValue <= 0) {
        toast.error(t("checkout.couponNoDiscount"));
        return;
      }

      setDiscount(discountValue);
      setCouponApplied(true);

      toast.success(t("checkout.couponSuccess"));
    } catch (err) {
      console.error("Coupon error:", err);

      toast.error(
        err.response?.data?.message || t("checkout.couponInvalid")
      );
    } finally {
      setCouponLoading(false);
    }
  };

  const handleRemoveCoupon = () => {
    setCouponApplied(false);
    setDiscount(0);
    setCouponCode("");

    toast.success(t("checkout.couponRemoved"));
  };

  // =========================
  // Loading State
  // =========================
  if (loadingCart) {
    return (
      <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center">
        <Loader2
          className="animate-spin text-blue-600"
          size={40}
        />
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-[#f8fafc] dark:bg-slate-950 flex flex-col items-center justify-center gap-4 transition-colors duration-200">
        <p className="text-gray-500 dark:text-slate-400 text-lg">
          {t("checkout.cartEmptyMessage")}
        </p>

        <button
          onClick={() => navigate("/shop")}
          className="px-6 py-2.5 bg-[#5046E5] text-white rounded-xl font-medium hover:bg-[#4338CA] transition cursor-pointer"
        >
          {t("checkout.continueShopping")}
        </button>
      </div>
    );
  }

  return (
    <div className="bg-[#f8fafc] dark:bg-slate-950 min-h-screen py-10 text-gray-700 dark:text-slate-200 font-normal transition-colors duration-200">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-slate-100">
            {t("checkout.title")}
          </h1>

          <p className="text-sm text-gray-500 dark:text-slate-400 mt-1">
            {t("checkout.subtitle")}
          </p>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="grid grid-cols-1 lg:grid-cols-3 gap-8"
        >
          <div className="lg:col-span-2 space-y-6">
            {/* 1. Shipping Information */}
            <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl shadow-[0_4px_20px_-4px_rgba(0,0,0,0.03)] border border-gray-100 dark:border-slate-800">
              <div className="flex items-center gap-3.5 mb-6">
                <div className="bg-indigo-50 dark:bg-indigo-950/50 p-3 rounded-2xl text-[#5046E5] dark:text-indigo-400">
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"
                    />
                  </svg>
                </div>

                <div>
                  <h2 className="font-semibold text-base text-gray-900 dark:text-slate-100 tracking-tight">
                    {t("checkout.shippingInfo")}
                  </h2>

                  <p className="text-xs text-gray-400 dark:text-slate-500 mt-0.5">
                    {t("checkout.shippingInfoDesc")}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-600 dark:text-slate-300 mb-1.5">
                    {t("checkout.fullName")}
                  </label>

                  <input
                    type="text"
                    {...register("fullName")}
                    placeholder={t("checkout.fullNamePlaceholder")}
                    className="w-full p-3.5 text-xs border border-gray-200 dark:border-slate-700 rounded-2xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition bg-gray-50/20 dark:bg-slate-800 text-gray-800 dark:text-slate-100 placeholder:text-gray-400 dark:placeholder:text-slate-500"
                  />

                  {errors.fullName && (
                    <p className="text-red-500 text-[11px] mt-1">
                      {errors.fullName.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-600 dark:text-slate-300 mb-1.5">
                    {t("checkout.email")}
                  </label>

                  <input
                    type="email"
                    {...register("email")}
                    placeholder={t("checkout.emailPlaceholder")}
                    className="w-full p-3.5 text-xs border border-gray-200 dark:border-slate-700 rounded-2xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition bg-gray-50/20 dark:bg-slate-800 text-gray-800 dark:text-slate-100 placeholder:text-gray-400 dark:placeholder:text-slate-500"
                  />

                  {errors.email && (
                    <p className="text-red-500 text-[11px] mt-1">
                      {errors.email.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-600 dark:text-slate-300 mb-1.5">
                    {t("checkout.phone")}
                  </label>

                  <input
                    type="text"
                    {...register("phone")}
                    placeholder={t("checkout.phonePlaceholder")}
                    className="w-full p-3.5 text-xs border border-gray-200 dark:border-slate-700 rounded-2xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition bg-gray-50/20 dark:bg-slate-800 text-gray-800 dark:text-slate-100 placeholder:text-gray-400 dark:placeholder:text-slate-500"
                  />

                  {errors.phone && (
                    <p className="text-red-500 text-[11px] mt-1">
                      {errors.phone.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-600 dark:text-slate-300 mb-1.5">
                    {t("checkout.country")}
                  </label>

                  <select
                    {...register("country")}
                    className="w-full p-3.5 text-xs border border-gray-200 dark:border-slate-700 rounded-2xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition bg-gray-50/20 dark:bg-slate-800 text-gray-800 dark:text-slate-100"
                  >
                    <option value="Egypt" className="dark:bg-slate-900">
                      {t("checkout.countries.egypt")}
                    </option>

                    <option
                      value="Saudi Arabia"
                      className="dark:bg-slate-900"
                    >
                      {t("checkout.countries.saudiArabia")}
                    </option>

                    <option
                      value="United Arab Emirates"
                      className="dark:bg-slate-900"
                    >
                      {t("checkout.countries.uae")}
                    </option>

                    <option value="Jordan" className="dark:bg-slate-900">
                      {t("checkout.countries.jordan")}
                    </option>

                    <option value="Kuwait" className="dark:bg-slate-900">
                      {t("checkout.countries.kuwait")}
                    </option>

                    <option value="Qatar" className="dark:bg-slate-900">
                      {t("checkout.countries.qatar")}
                    </option>

                    <option
                      value="United States"
                      className="dark:bg-slate-900"
                    >
                      {t("checkout.countries.us")}
                    </option>

                    <option
                      value="United Kingdom"
                      className="dark:bg-slate-900"
                    >
                      {t("checkout.countries.uk")}
                    </option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-600 dark:text-slate-300 mb-1.5">
                    {t("checkout.city")}
                  </label>

                  <input
                    type="text"
                    {...register("city")}
                    placeholder={t("checkout.cityPlaceholder")}
                    className="w-full p-3.5 text-xs border border-gray-200 dark:border-slate-700 rounded-2xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition bg-gray-50/20 dark:bg-slate-800 text-gray-800 dark:text-slate-100 placeholder:text-gray-400 dark:placeholder:text-slate-500"
                  />

                  {errors.city && (
                    <p className="text-red-500 text-[11px] mt-1">
                      {errors.city.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-600 dark:text-slate-300 mb-1.5">
                    {t("checkout.postalCode")}
                  </label>

                  <input
                    type="text"
                    {...register("postalCode")}
                    placeholder={t("checkout.postalCodePlaceholder")}
                    className="w-full p-3.5 text-xs border border-gray-200 dark:border-slate-700 rounded-2xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition bg-gray-50/20 dark:bg-slate-800 text-gray-800 dark:text-slate-100 placeholder:text-gray-400 dark:placeholder:text-slate-500"
                  />

                  {errors.postalCode && (
                    <p className="text-red-500 text-[11px] mt-1">
                      {errors.postalCode.message}
                    </p>
                  )}
                </div>

                <div className="md:col-span-2">
                  <label className="block text-xs font-medium text-gray-600 dark:text-slate-300 mb-1.5">
                    {t("checkout.address")}
                  </label>

                  <input
                    type="text"
                    {...register("address")}
                    placeholder={t("checkout.addressPlaceholder")}
                    className="w-full p-3.5 text-xs border border-gray-200 dark:border-slate-700 rounded-2xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition bg-gray-50/20 dark:bg-slate-800 text-gray-800 dark:text-slate-100 placeholder:text-gray-400 dark:placeholder:text-slate-500"
                  />

                  {errors.address && (
                    <p className="text-red-500 text-[11px] mt-1">
                      {errors.address.message}
                    </p>
                  )}
                </div>

                <div className="md:col-span-2">
                  <label className="block text-xs font-medium text-gray-600 dark:text-slate-300 mb-1.5">
                    {t("checkout.apartment")}
                  </label>

                  <input
                    type="text"
                    {...register("apartment")}
                    placeholder={t("checkout.apartmentPlaceholder")}
                    className="w-full p-3.5 text-xs border border-gray-200 dark:border-slate-700 rounded-2xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition bg-gray-50/20 dark:bg-slate-800 text-gray-800 dark:text-slate-100 placeholder:text-gray-400 dark:placeholder:text-slate-500"
                  />
                </div>
              </div>
            </div>

            {/* 2. Delivery Options */}
            <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl shadow-[0_4px_20px_-4px_rgba(0,0,0,0.03)] border border-gray-100 dark:border-slate-800 space-y-4">
              <div className="flex items-center gap-3.5">
                <div className="bg-indigo-50 dark:bg-indigo-950/50 p-3 rounded-2xl text-[#5046E5] dark:text-indigo-400">
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>

                <div>
                  <h2 className="font-semibold text-base text-gray-900 dark:text-slate-100 tracking-tight">
                    {t("checkout.delivery")}
                  </h2>

                  <p className="text-xs text-gray-400 dark:text-slate-500 mt-0.5">
                    {t("checkout.deliveryDesc")}
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                <label
                  className={`flex items-center justify-between p-4 border rounded-2xl cursor-pointer transition-all ${
                    selectedDelivery === "standard"
                      ? "border-indigo-500 bg-indigo-50/10 dark:bg-indigo-950/20 shadow-sm"
                      : "border-gray-200 dark:border-slate-700 hover:border-gray-300 dark:hover:border-slate-600"
                  }`}
                >
                  <div className="flex items-center gap-3.5">
                    <input
                      type="radio"
                      value="standard"
                      {...register("deliveryMethod")}
                      className="w-4 h-4 text-indigo-600 accent-indigo-600"
                    />

                    <div>
                      <p className="font-medium text-xs text-gray-900 dark:text-slate-100">
                        {t("checkout.standardDelivery")}{" "}
                        <span className="bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 text-[10px] px-2 py-0.5 rounded-full mx-2 font-medium">
                          {t("checkout.free")}
                        </span>
                      </p>

                      <p className="text-[11px] text-gray-400 dark:text-slate-500 mt-0.5">
                        {t("checkout.standardDuration")}
                      </p>
                    </div>
                  </div>
                </label>

                <label
                  className={`flex items-center justify-between p-4 border rounded-2xl cursor-pointer transition-all ${
                    selectedDelivery === "express"
                      ? "border-indigo-500 bg-indigo-50/10 dark:bg-indigo-950/20 shadow-sm"
                      : "border-gray-200 dark:border-slate-700 hover:border-gray-300 dark:hover:border-slate-600"
                  }`}
                >
                  <div className="flex items-center gap-3.5">
                    <input
                      type="radio"
                      value="express"
                      {...register("deliveryMethod")}
                      className="w-4 h-4 text-indigo-600 accent-indigo-600"
                    />

                    <div>
                      <p className="font-medium text-xs text-gray-900 dark:text-slate-100">
                        {t("checkout.expressDelivery")}{" "}
                        <span className="text-gray-800 dark:text-slate-200 font-medium mx-1">
                          $6.99
                        </span>
                      </p>

                      <p className="text-[11px] text-gray-400 dark:text-slate-500 mt-0.5">
                        {t("checkout.expressDuration")}
                      </p>
                    </div>
                  </div>
                </label>
              </div>
            </div>

            {/* 3. Payment Method */}
            <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl shadow-[0_4px_20px_-4px_rgba(0,0,0,0.03)] border border-gray-100 dark:border-slate-800 space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3.5">
                  <div className="bg-blue-50 dark:bg-indigo-950/60 p-3 rounded-2xl text-blue-600 dark:text-indigo-400">
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                      />
                    </svg>
                  </div>

                  <div>
                    <h2 className="font-semibold text-base text-gray-900 dark:text-slate-100 tracking-tight">
                      {t("checkout.payment")}
                    </h2>

                    <p className="text-xs text-gray-400 dark:text-slate-500 mt-0.5">
                      {t("checkout.paymentDesc")}
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <label
                  className={`p-4 border rounded-2xl text-center cursor-pointer transition-all ${
                    selectedPaymentMethod === "card"
                      ? "border-blue-500 bg-blue-50/10 shadow-sm dark:border-indigo-500 dark:bg-indigo-950/30"
                      : "border-gray-200 dark:border-slate-800 hover:border-gray-300 dark:hover:border-slate-700 bg-transparent"
                  }`}
                >
                  <input
                    type="radio"
                    value="card"
                    {...register("paymentMethod")}
                    className="hidden"
                  />

                  <p className="font-medium text-xs text-gray-900 dark:text-slate-200">
                    {t("checkout.creditCard")}
                  </p>

                  <p className="text-[10px] text-gray-400 dark:text-slate-500 mt-0.5">
                    {t("checkout.creditCardDesc")}
                  </p>
                </label>

                <label
                  className={`p-4 border rounded-2xl text-center cursor-pointer transition-all ${
                    selectedPaymentMethod === "wallet"
                      ? "border-blue-500 bg-blue-50/10 shadow-sm dark:border-indigo-500 dark:bg-indigo-950/30"
                      : "border-gray-200 dark:border-slate-800 hover:border-gray-300 dark:hover:border-slate-700 bg-transparent"
                  }`}
                >
                  <input
                    type="radio"
                    value="wallet"
                    {...register("paymentMethod")}
                    className="hidden"
                  />

                  <p className="font-medium text-xs text-gray-900 dark:text-slate-200">
                    {t("checkout.digitalWallet")}
                  </p>

                  <p className="text-[10px] text-gray-400 dark:text-slate-500 mt-0.5">
                    {t("checkout.digitalWalletDesc")}
                  </p>
                </label>

                <label
                  className={`p-4 border rounded-2xl text-center cursor-pointer transition-all ${
                    selectedPaymentMethod === "cash"
                      ? "border-blue-500 bg-blue-50/10 shadow-sm dark:border-indigo-500 dark:bg-indigo-950/30"
                      : "border-gray-200 dark:border-slate-800 hover:border-gray-300 dark:hover:border-slate-700 bg-transparent"
                  }`}
                >
                  <input
                    type="radio"
                    value="cash"
                    {...register("paymentMethod")}
                    className="hidden"
                  />

                  <p className="font-medium text-xs text-gray-900 dark:text-slate-200">
                    {t("checkout.cashOnDelivery")}
                  </p>

                  <p className="text-[10px] text-gray-400 dark:text-slate-500 mt-0.5">
                    {t("checkout.cashOnDeliveryDesc")}
                  </p>
                </label>
              </div>

              {selectedPaymentMethod === "card" && (
                <div className="space-y-4 pt-2">
                  <h3 className="text-xs font-medium text-gray-700 dark:text-slate-300 uppercase tracking-wider">
                    {t("checkout.cardInfo")}
                  </h3>

                  <div>
                    <label className="block text-xs font-medium text-gray-600 dark:text-slate-400 mb-1.5">
                      {t("checkout.cardHolder")}
                    </label>

                    <input
                      type="text"
                      {...register("cardHolder")}
                      placeholder={t("checkout.cardHolderPlaceholder")}
                      className="w-full p-3.5 text-xs border border-gray-200 dark:border-slate-700 rounded-2xl focus:ring-2 focus:ring-blue-500/20 dark:focus:ring-indigo-500/20 focus:border-blue-500 dark:focus:border-indigo-500 outline-none transition bg-gray-50/20 dark:bg-slate-800 text-gray-800 dark:text-slate-100 placeholder:text-gray-400 dark:placeholder:text-slate-500"
                    />

                    {errors.cardHolder && (
                      <p className="text-red-500 text-[11px] mt-1">
                        {errors.cardHolder.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-600 dark:text-slate-400 mb-1.5">
                      {t("checkout.cardNumber")}
                    </label>

                    <input
                      type="text"
                      {...register("cardNumber")}
                      placeholder={t("checkout.cardNumberPlaceholder")}
                      className="w-full p-3.5 text-xs border border-gray-200 dark:border-slate-700 rounded-2xl focus:ring-2 focus:ring-blue-500/20 dark:focus:ring-indigo-500/20 focus:border-blue-500 dark:focus:border-indigo-500 outline-none transition bg-gray-50/20 dark:bg-slate-800 text-gray-800 dark:text-slate-100 placeholder:text-gray-400 dark:placeholder:text-slate-500"
                    />

                    {errors.cardNumber && (
                      <p className="text-red-500 text-[11px] mt-1">
                        {errors.cardNumber.message}
                      </p>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-gray-600 dark:text-slate-400 mb-1.5">
                        {t("checkout.expiryDate")}
                      </label>

                      <input
                        type="text"
                        {...register("expiryDate")}
                        placeholder={t("checkout.expiryDatePlaceholder")}
                        className="w-full p-3.5 text-xs border border-gray-200 dark:border-slate-700 rounded-2xl focus:ring-2 focus:ring-blue-500/20 dark:focus:ring-indigo-500/20 focus:border-blue-500 dark:focus:border-indigo-500 outline-none transition bg-gray-50/20 dark:bg-slate-800 text-gray-800 dark:text-slate-100 placeholder:text-gray-400 dark:placeholder:text-slate-500"
                      />

                      {errors.expiryDate && (
                        <p className="text-red-500 text-[11px] mt-1">
                          {errors.expiryDate.message}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-gray-600 dark:text-slate-400 mb-1.5">
                        {t("checkout.cvv")}
                      </label>

                      <input
                        type="password"
                        {...register("cvv")}
                        placeholder={t("checkout.cvvPlaceholder")}
                        className="w-full p-3.5 text-xs border border-gray-200 dark:border-slate-700 rounded-2xl focus:ring-2 focus:ring-blue-500/20 dark:focus:ring-indigo-500/20 focus:border-blue-500 dark:focus:border-indigo-500 outline-none transition bg-gray-50/20 dark:bg-slate-800 text-gray-800 dark:text-slate-100 placeholder:text-gray-400 dark:placeholder:text-slate-500"
                      />

                      {errors.cvv && (
                        <p className="text-red-500 text-[11px] mt-1">
                          {errors.cvv.message}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {selectedPaymentMethod === "wallet" && (
                <div className="space-y-4 pt-2">
                  <h3 className="text-xs font-medium text-gray-700 dark:text-slate-300 uppercase tracking-wider">
                    {t("checkout.walletInfo")}
                  </h3>

                  <div>
                    <label className="block text-xs font-medium text-gray-600 dark:text-slate-400 mb-1.5">
                      {t("checkout.walletNumber")}
                    </label>

                    <input
                      type="text"
                      {...register("walletNumber")}
                      placeholder={t("checkout.walletNumberPlaceholder")}
                      className="w-full p-3.5 text-xs border border-gray-200 dark:border-slate-700 rounded-2xl focus:ring-2 focus:ring-blue-500/20 dark:focus:ring-indigo-500/20 focus:border-blue-500 dark:focus:border-indigo-500 outline-none transition bg-gray-50/20 dark:bg-slate-800 text-gray-800 dark:text-slate-100 placeholder:text-gray-400 dark:placeholder:text-slate-500"
                    />

                    <p className="text-[11px] text-gray-400 dark:text-slate-500 mt-1">
                      {t("checkout.walletHint")}
                    </p>
                  </div>
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 dark:bg-indigo-600 text-white py-4 rounded-2xl font-medium text-sm hover:bg-blue-700 dark:hover:bg-indigo-500 transition shadow-lg shadow-blue-600/20 dark:shadow-indigo-600/30 active:scale-[0.99] disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer"
            >
              {loading && <Loader2 size={16} className="animate-spin" />}

              {loading
                ? t("checkout.processing")
                : t("checkout.payNow", { amount: total.toFixed(2) })}
            </button>
          </div>

          {/* Order Summary */}
          <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl shadow-[0_4px_20px_-4px_rgba(0,0,0,0.03)] border border-gray-100 dark:border-slate-800 h-fit space-y-6">
            <div className="flex justify-between items-center border-b border-gray-100 dark:border-slate-800 pb-4">
              <h2 className="font-semibold text-base text-gray-900 dark:text-slate-100 tracking-tight">
                {t("checkout.orderSummary")}
              </h2>

              <button
                type="button"
                onClick={() => navigate("/cart")}
                className="text-xs text-blue-600 dark:text-indigo-400 cursor-pointer font-medium hover:underline"
              >
                {t("checkout.editCart")}
              </button>
            </div>

            <p className="text-xs text-gray-400 dark:text-slate-500">
              {t("checkout.itemsInCart", { count: cartItems.length })}
            </p>

            <div className="space-y-4 divide-y divide-gray-100 dark:divide-slate-800">
              {cartItems.map((item, index) => {
                const product = item.product || {};

                const image =
                  product.images?.[0]?.url ||
                  product.image ||
                  product.thumbnail ||
                  "/Background+Border.svg";

                const name = product.name || "Product";
                const price = getItemPrice(item);

                return (
                  <div
                    key={item._id || index}
                    className="pt-4 first:pt-0 flex items-center gap-3.5 group"
                  >
                    <div className="overflow-hidden rounded-2xl border border-gray-100 dark:border-slate-800 bg-gray-50/40 dark:bg-slate-800/40 p-1 shrink-0">
                      <img
                        src={image}
                        alt={name}
                        className="w-14 h-14 object-cover rounded-xl transition-transform duration-500 ease-out group-hover:scale-110 group-hover:rotate-1"
                      />
                    </div>

                    <div className="flex-1">
                      <h4 className="font-medium text-xs text-gray-900 dark:text-slate-200 group-hover:text-blue-600 dark:group-hover:text-indigo-400 transition-colors line-clamp-1">
                        {name}
                      </h4>

                      {item.variant && (
                        <p className="text-[11px] text-gray-400 dark:text-slate-500 mt-0.5">
                          {item.variant}
                        </p>
                      )}

                      <p className="text-[11px] text-gray-400 dark:text-slate-500">
                        {t("checkout.qty")} {item.quantity || 1}
                      </p>
                    </div>

                    <span className="font-medium text-xs text-gray-900 dark:text-slate-200">
                      ${(price * (item.quantity || 1)).toFixed(2)}
                    </span>
                  </div>
                );
              })}
            </div>

            <div className="border-t border-gray-100 dark:border-slate-800 pt-4 space-y-2.5 text-xs">
              <div className="flex justify-between text-gray-500 dark:text-slate-400">
                <span>{t("checkout.subtotal")}</span>

                <span className="font-medium text-gray-800 dark:text-slate-200">
                  ${subtotal.toFixed(2)}
                </span>
              </div>

              {discount > 0 && (
                <div className="flex justify-between text-emerald-600 dark:text-emerald-400 font-medium">
                  <span>{t("checkout.discount")}</span>
                  <span>-${discount.toFixed(2)}</span>
                </div>
              )}

              <div className="flex justify-between text-gray-500 dark:text-slate-400">
                <span>{t("checkout.shipping")}</span>

                <span className="font-medium text-gray-800 dark:text-slate-200">
                  {shippingCost === 0
                    ? t("checkout.free")
                    : `$${shippingCost}`}
                </span>
              </div>

              <div className="flex justify-between text-gray-500 dark:text-slate-400">
                <span>{t("checkout.tax")}</span>

                <span className="font-medium text-gray-800 dark:text-slate-200">
                  ${tax.toFixed(2)}
                </span>
              </div>
            </div>

            <div className="border-t border-gray-100 dark:border-slate-800 pt-4 flex justify-between items-center">
              <span className="font-semibold text-sm text-gray-900 dark:text-slate-100">
                {t("checkout.total")}
              </span>

              <span className="font-semibold text-base text-gray-900 dark:text-slate-100">
                ${total.toFixed(2)}
              </span>
            </div>

            {/* Coupon Section */}
            <div className="border-t border-gray-100 dark:border-slate-800 pt-4 space-y-3">
              <label className="text-xs font-medium text-gray-700 dark:text-slate-300 flex items-center gap-1.5">
                <svg
                  className="w-4 h-4 text-blue-600 dark:text-indigo-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                  />
                </svg>

                {t("checkout.haveCoupon")}
              </label>

              <div className="flex gap-2">
                <input
                  type="text"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  placeholder={t("checkout.couponPlaceholder")}
                  disabled={couponApplied}
                  className="flex-1 p-3 text-xs border border-gray-200 dark:border-slate-700 rounded-2xl outline-none focus:ring-1 focus:ring-blue-500 dark:focus:ring-indigo-500 bg-gray-50/20 dark:bg-slate-800 text-gray-800 dark:text-slate-100 placeholder:text-gray-400 dark:placeholder:text-slate-500 disabled:bg-slate-100 dark:disabled:bg-slate-800/50 disabled:cursor-not-allowed"
                />

                {couponApplied ? (
                  <button
                    type="button"
                    onClick={handleRemoveCoupon}
                    className="bg-red-100 dark:bg-rose-950/60 text-red-600 dark:text-rose-400 px-4 py-3 rounded-2xl text-xs font-medium hover:bg-red-200 dark:hover:bg-rose-900/60 transition cursor-pointer"
                  >
                    {t("checkout.remove")}
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleApplyCoupon}
                    disabled={couponLoading}
                    className="bg-blue-600 dark:bg-indigo-600 text-white px-4 py-3 rounded-2xl text-xs font-medium hover:bg-blue-700 dark:hover:bg-indigo-500 transition disabled:opacity-60 flex items-center gap-1 cursor-pointer"
                  >
                    {couponLoading && (
                      <Loader2 size={12} className="animate-spin" />
                    )}

                    {t("checkout.apply")}
                  </button>
                )}
              </div>

              {couponApplied && discount > 0 && (
                <div className="bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-100 dark:border-emerald-900/50 p-3.5 rounded-2xl flex items-start gap-3">
                  <div className="bg-emerald-500 text-white p-1 rounded-full mt-0.5">
                    <svg
                      className="w-3.5 h-3.5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2.5"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>

                  <div>
                    <h5 className="font-medium text-xs text-emerald-900 dark:text-emerald-300">
                      {t("checkout.couponAppliedSuccess")}
                    </h5>

                    <p className="text-[11px] text-emerald-700 dark:text-emerald-400">
                      {t("checkout.youSaved", {
                        amount: discount.toFixed(2),
                      })}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

