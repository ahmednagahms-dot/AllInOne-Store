import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { checkoutSchema } from "../schema/checkoutSchema";
import { getCart, applyCoupon } from "../api/cart.api";
import { createOrder } from "../api/orders.api";
import { toast } from "react-toastify";
import { Loader2 } from "lucide-react";

export default function Checkout() {
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
    resolver: yupResolver(checkoutSchema),
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
          toast.info("Your cart is empty");
          navigate("/cart");
          return;
        }

        setCartItems(items);
      } catch (err) {
        console.error("Failed to load cart:", err);
        toast.error(
          err.response?.data?.message || "Failed to load cart"
        );
        navigate("/cart");
      } finally {
        setLoadingCart(false);
      }
    };

    loadCart();
  }, [navigate]);

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

      // ✅ الـ Backend بياخد الـ items من cart المستخدم
      // بنبعت بس shippingAddress + paymentMethod
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

      toast.success("Order placed successfully!");

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
        "Failed to place order";

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
      toast.error("Please enter a coupon code");
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
        toast.error("Coupon applied but no discount value");
        return;
      }

      setDiscount(discountValue);
      setCouponApplied(true);
      toast.success("Coupon applied successfully!");
    } catch (err) {
      console.error("Coupon error:", err);
      toast.error(
        err.response?.data?.message || "Invalid coupon code"
      );
    } finally {
      setCouponLoading(false);
    }
  };

  const handleRemoveCoupon = () => {
    setCouponApplied(false);
    setDiscount(0);
    setCouponCode("");
    toast.info("Coupon removed");
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
      <div className="min-h-screen bg-[#f8fafc] flex flex-col items-center justify-center gap-4">
        <p className="text-gray-500 text-lg">Your cart is empty</p>
        <button
          onClick={() => navigate("/shop")}
          className="px-6 py-2.5 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition"
        >
          Continue Shopping
        </button>
      </div>
    );
  }

  return (
    <div className="bg-[#f8fafc] min-h-screen py-10 text-gray-700 font-normal">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
            Checkout
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Complete your order details below
          </p>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="grid grid-cols-1 lg:grid-cols-3 gap-8"
        >
          <div className="lg:col-span-2 space-y-6">
            {/* 1. Shipping Information */}
            <div className="bg-white p-8 rounded-3xl shadow-[0_4px_20px_-4px_rgba(0,0,0,0.03)] border border-gray-100">
              <div className="flex items-center gap-3.5 mb-6">
                <div className="bg-blue-50 p-3 rounded-2xl text-blue-600">
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
                  <h2 className="font-semibold text-base text-gray-900 tracking-tight">
                    Shipping Information
                  </h2>
                  <p className="text-xs text-gray-400 mt-0.5">
                    Please enter your shipping details
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1.5">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    {...register("fullName")}
                    placeholder="Enter your full name"
                    className="w-full p-3.5 text-xs border border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition bg-gray-50/20 text-gray-800 placeholder:text-gray-400"
                  />
                  {errors.fullName && (
                    <p className="text-red-500 text-[11px] mt-1">
                      {errors.fullName.message}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1.5">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    {...register("email")}
                    placeholder="Enter your email address"
                    className="w-full p-3.5 text-xs border border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition bg-gray-50/20 text-gray-800 placeholder:text-gray-400"
                  />
                  {errors.email && (
                    <p className="text-red-500 text-[11px] mt-1">
                      {errors.email.message}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1.5">
                    Phone Number *
                  </label>
                  <input
                    type="text"
                    {...register("phone")}
                    placeholder="Enter your phone number"
                    className="w-full p-3.5 text-xs border border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition bg-gray-50/20 text-gray-800 placeholder:text-gray-400"
                  />
                  {errors.phone && (
                    <p className="text-red-500 text-[11px] mt-1">
                      {errors.phone.message}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1.5">
                    Country *
                  </label>
                  <select
                    {...register("country")}
                    className="w-full p-3.5 text-xs border border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition bg-gray-50/20 text-gray-800"
                  >
                    <option value="Egypt">Egypt</option>
                    <option value="Saudi Arabia">Saudi Arabia</option>
                    <option value="United Arab Emirates">
                      United Arab Emirates
                    </option>
                    <option value="Jordan">Jordan</option>
                    <option value="Kuwait">Kuwait</option>
                    <option value="Qatar">Qatar</option>
                    <option value="United States">United States</option>
                    <option value="United Kingdom">United Kingdom</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1.5">
                    City *
                  </label>
                  <input
                    type="text"
                    {...register("city")}
                    placeholder="Enter your city"
                    className="w-full p-3.5 text-xs border border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition bg-gray-50/20 text-gray-800 placeholder:text-gray-400"
                  />
                  {errors.city && (
                    <p className="text-red-500 text-[11px] mt-1">
                      {errors.city.message}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1.5">
                    Postal Code *
                  </label>
                  <input
                    type="text"
                    {...register("postalCode")}
                    placeholder="Enter your postal code"
                    className="w-full p-3.5 text-xs border border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition bg-gray-50/20 text-gray-800 placeholder:text-gray-400"
                  />
                  {errors.postalCode && (
                    <p className="text-red-500 text-[11px] mt-1">
                      {errors.postalCode.message}
                    </p>
                  )}
                </div>
                <div className="md:col-span-2">
                  <label className="block text-xs font-medium text-gray-600 mb-1.5">
                    Address *
                  </label>
                  <input
                    type="text"
                    {...register("address")}
                    placeholder="Enter your street address"
                    className="w-full p-3.5 text-xs border border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition bg-gray-50/20 text-gray-800 placeholder:text-gray-400"
                  />
                  {errors.address && (
                    <p className="text-red-500 text-[11px] mt-1">
                      {errors.address.message}
                    </p>
                  )}
                </div>
                <div className="md:col-span-2">
                  <label className="block text-xs font-medium text-gray-600 mb-1.5">
                    Apartment, Suite, etc. (Optional)
                  </label>
                  <input
                    type="text"
                    {...register("apartment")}
                    placeholder="Enter apartment or suite details"
                    className="w-full p-3.5 text-xs border border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition bg-gray-50/20 text-gray-800 placeholder:text-gray-400"
                  />
                </div>
              </div>
            </div>

            {/* 2. Delivery Options */}
            <div className="bg-white p-8 rounded-3xl shadow-[0_4px_20px_-4px_rgba(0,0,0,0.03)] border border-gray-100 space-y-4">
              <div className="flex items-center gap-3.5">
                <div className="bg-blue-50 p-3 rounded-2xl text-blue-600">
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
                  <h2 className="font-semibold text-base text-gray-900 tracking-tight">
                    Delivery
                  </h2>
                  <p className="text-xs text-gray-400 mt-0.5">
                    Choose your preferred delivery option
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                <label
                  className={`flex items-center justify-between p-4 border rounded-2xl cursor-pointer transition-all ${
                    selectedDelivery === "standard"
                      ? "border-blue-500 bg-blue-50/10 shadow-sm"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <div className="flex items-center gap-3.5">
                    <input
                      type="radio"
                      value="standard"
                      {...register("deliveryMethod")}
                      className="w-4 h-4 text-blue-600 accent-blue-600"
                    />
                    <div>
                      <p className="font-medium text-xs text-gray-900">
                        Standard Delivery{" "}
                        <span className="bg-emerald-50 text-emerald-600 text-[10px] px-2 py-0.5 rounded-full ml-2 font-medium">
                          Free
                        </span>
                      </p>
                      <p className="text-[11px] text-gray-400 mt-0.5">
                        3 - 5 business days
                      </p>
                    </div>
                  </div>
                </label>

                <label
                  className={`flex items-center justify-between p-4 border rounded-2xl cursor-pointer transition-all ${
                    selectedDelivery === "express"
                      ? "border-blue-500 bg-blue-50/10 shadow-sm"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <div className="flex items-center gap-3.5">
                    <input
                      type="radio"
                      value="express"
                      {...register("deliveryMethod")}
                      className="w-4 h-4 text-blue-600 accent-blue-600"
                    />
                    <div>
                      <p className="font-medium text-xs text-gray-900">
                        Express Delivery{" "}
                        <span className="text-gray-800 font-medium ml-1">
                          $6.99
                        </span>
                      </p>
                      <p className="text-[11px] text-gray-400 mt-0.5">
                        1 - 2 business days
                      </p>
                    </div>
                  </div>
                </label>
              </div>
            </div>

            {/* 3. Payment Method */}
            <div className="bg-white p-8 rounded-3xl shadow-[0_4px_20px_-4px_rgba(0,0,0,0.03)] border border-gray-100 space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3.5">
                  <div className="bg-blue-50 p-3 rounded-2xl text-blue-600">
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
                    <h2 className="font-semibold text-base text-gray-900 tracking-tight">
                      Payment
                    </h2>
                    <p className="text-xs text-gray-400 mt-0.5">
                      Select your payment method
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <label
                  className={`p-4 border rounded-2xl text-center cursor-pointer transition-all ${
                    selectedPaymentMethod === "card"
                      ? "border-blue-500 bg-blue-50/10 shadow-sm"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <input
                    type="radio"
                    value="card"
                    {...register("paymentMethod")}
                    className="hidden"
                  />
                  <p className="font-medium text-xs text-gray-900">
                    Credit Card
                  </p>
                  <p className="text-[10px] text-gray-400 mt-0.5">
                    Visa, Mastercard
                  </p>
                </label>
                <label
                  className={`p-4 border rounded-2xl text-center cursor-pointer transition-all ${
                    selectedPaymentMethod === "wallet"
                      ? "border-blue-500 bg-blue-50/10 shadow-sm"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <input
                    type="radio"
                    value="wallet"
                    {...register("paymentMethod")}
                    className="hidden"
                  />
                  <p className="font-medium text-xs text-gray-900">
                    Digital Wallet
                  </p>
                  <p className="text-[10px] text-gray-400 mt-0.5">
                    Apple / Google Pay
                  </p>
                </label>
                <label
                  className={`p-4 border rounded-2xl text-center cursor-pointer transition-all ${
                    selectedPaymentMethod === "cash"
                      ? "border-blue-500 bg-blue-50/10 shadow-sm"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <input
                    type="radio"
                    value="cash"
                    {...register("paymentMethod")}
                    className="hidden"
                  />
                  <p className="font-medium text-xs text-gray-900">
                    Cash on Delivery
                  </p>
                  <p className="text-[10px] text-gray-400 mt-0.5">
                    Pay upon delivery
                  </p>
                </label>
              </div>

              {selectedPaymentMethod === "card" && (
                <div className="space-y-4 pt-2">
                  <h3 className="text-xs font-medium text-gray-700 uppercase tracking-wider">
                    Card Information
                  </h3>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1.5">
                      Cardholder Name *
                    </label>
                    <input
                      type="text"
                      {...register("cardHolder")}
                      placeholder="Enter cardholder name"
                      className="w-full p-3.5 text-xs border border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition bg-gray-50/20 text-gray-800 placeholder:text-gray-400"
                    />
                    {errors.cardHolder && (
                      <p className="text-red-500 text-[11px] mt-1">
                        {errors.cardHolder.message}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1.5">
                      Card Number *
                    </label>
                    <input
                      type="text"
                      {...register("cardNumber")}
                      placeholder="Enter card number"
                      className="w-full p-3.5 text-xs border border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition bg-gray-50/20 text-gray-800 placeholder:text-gray-400"
                    />
                    {errors.cardNumber && (
                      <p className="text-red-500 text-[11px] mt-1">
                        {errors.cardNumber.message}
                      </p>
                    )}
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1.5">
                        Expiry Date *
                      </label>
                      <input
                        type="text"
                        {...register("expiryDate")}
                        placeholder="MM/YY"
                        className="w-full p-3.5 text-xs border border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition bg-gray-50/20 text-gray-800 placeholder:text-gray-400"
                      />
                      {errors.expiryDate && (
                        <p className="text-red-500 text-[11px] mt-1">
                          {errors.expiryDate.message}
                        </p>
                      )}
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1.5">
                        CVV *
                      </label>
                      <input
                        type="password"
                        {...register("cvv")}
                        placeholder="CVV"
                        className="w-full p-3.5 text-xs border border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition bg-gray-50/20 text-gray-800 placeholder:text-gray-400"
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
                  <h3 className="text-xs font-medium text-gray-700 uppercase tracking-wider">
                    Digital Wallet Information
                  </h3>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1.5">
                      Wallet Phone Number / Account ID *
                    </label>
                    <input
                      type="text"
                      {...register("walletNumber")}
                      placeholder="Enter wallet phone number"
                      className="w-full p-3.5 text-xs border border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition bg-gray-50/20 text-gray-800 placeholder:text-gray-400"
                    />
                    <p className="text-[11px] text-gray-400 mt-1">
                      Enter the mobile number registered with your wallet
                    </p>
                  </div>
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-4 rounded-2xl font-medium text-sm hover:bg-blue-700 transition shadow-lg shadow-blue-600/20 active:scale-[0.99] disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading && <Loader2 size={16} className="animate-spin" />}
              {loading
                ? "Processing..."
                : `Pay Now – $${total.toFixed(2)}`}
            </button>
          </div>

          {/* Order Summary */}
          <div className="bg-white p-8 rounded-3xl shadow-[0_4px_20px_-4px_rgba(0,0,0,0.03)] border border-gray-100 h-fit space-y-6">
            <div className="flex justify-between items-center border-b border-gray-100 pb-4">
              <h2 className="font-semibold text-base text-gray-900 tracking-tight">
                Order Summary
              </h2>
              <button
                type="button"
                onClick={() => navigate("/cart")}
                className="text-xs text-blue-600 cursor-pointer font-medium hover:underline"
              >
                Edit Cart
              </button>
            </div>

            <p className="text-xs text-gray-400">
              {cartItems.length} items in your cart
            </p>

            <div className="space-y-4 divide-y divide-gray-100">
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
                    <div className="overflow-hidden rounded-2xl border border-gray-100 bg-gray-50/40 p-1 shrink-0">
                      <img
                        src={image}
                        alt={name}
                        className="w-14 h-14 object-cover rounded-xl transition-transform duration-500 ease-out group-hover:scale-110 group-hover:rotate-1"
                      />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-xs text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-1">
                        {name}
                      </h4>
                      {item.variant && (
                        <p className="text-[11px] text-gray-400 mt-0.5">
                          {item.variant}
                        </p>
                      )}
                      <p className="text-[11px] text-gray-400">
                        Qty: {item.quantity || 1}
                      </p>
                    </div>
                    <span className="font-medium text-xs text-gray-900">
                      ${(price * (item.quantity || 1)).toFixed(2)}
                    </span>
                  </div>
                );
              })}
            </div>

            <div className="border-t border-gray-100 pt-4 space-y-2.5 text-xs">
              <div className="flex justify-between text-gray-500">
                <span>Subtotal</span>
                <span className="font-medium text-gray-800">
                  ${subtotal.toFixed(2)}
                </span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-emerald-600 font-medium">
                  <span>Discount</span>
                  <span>-${discount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between text-gray-500">
                <span>Shipping</span>
                <span className="font-medium text-gray-800">
                  {shippingCost === 0 ? "Free" : `$${shippingCost}`}
                </span>
              </div>
              <div className="flex justify-between text-gray-500">
                <span>Estimated Tax (14%)</span>
                <span className="font-medium text-gray-800">
                  ${tax.toFixed(2)}
                </span>
              </div>
            </div>

            <div className="border-t border-gray-100 pt-4 flex justify-between items-center">
              <span className="font-semibold text-sm text-gray-900">
                Total
              </span>
              <span className="font-semibold text-base text-gray-900">
                ${total.toFixed(2)}
              </span>
            </div>

            {/* Coupon Section */}
            <div className="border-t border-gray-100 pt-4 space-y-3">
              <label className="text-xs font-medium text-gray-700 flex items-center gap-1.5">
                <svg
                  className="w-4 h-4 text-blue-600"
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
                Have a coupon code?
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  placeholder="Enter coupon code"
                  disabled={couponApplied}
                  className="flex-1 p-3 text-xs border border-gray-200 rounded-2xl outline-none focus:ring-1 focus:ring-blue-500 bg-gray-50/20 text-gray-800 placeholder:text-gray-400 disabled:bg-slate-100 disabled:cursor-not-allowed"
                />
                {couponApplied ? (
                  <button
                    type="button"
                    onClick={handleRemoveCoupon}
                    className="bg-red-100 text-red-600 px-4 py-3 rounded-2xl text-xs font-medium hover:bg-red-200 transition"
                  >
                    Remove
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleApplyCoupon}
                    disabled={couponLoading}
                    className="bg-blue-600 text-white px-4 py-3 rounded-2xl text-xs font-medium hover:bg-blue-700 transition disabled:opacity-60 flex items-center gap-1"
                  >
                    {couponLoading && (
                      <Loader2 size={12} className="animate-spin" />
                    )}
                    Apply
                  </button>
                )}
              </div>

              {couponApplied && discount > 0 && (
                <div className="bg-emerald-50/70 border border-emerald-100 p-3.5 rounded-2xl flex items-start gap-3">
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
                    <h5 className="font-medium text-xs text-emerald-900">
                      Coupon applied successfully!
                    </h5>
                    <p className="text-[11px] text-emerald-700">
                      You saved ${discount.toFixed(2)}
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