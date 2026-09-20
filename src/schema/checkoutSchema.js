import * as Yup from "yup";

export const checkoutSchema = Yup.object().shape({
  // Shipping Information
  fullName: Yup.string().required("Full name is required"),
  email: Yup.string().email("Invalid email address").required("Email is required"),
  phone: Yup.string().required("Phone number is required"),
  country: Yup.string().required("Country is required"),
  city: Yup.string().required("City is required"),
  postalCode: Yup.string().required("Postal code is required"),
  address: Yup.string().required("Address is required"),
  apartment: Yup.string(), // Optional

  // Delivery Method
  deliveryMethod: Yup.string().required("Please select a delivery method"),

  // Payment Method
  paymentMethod: Yup.string().required("Please select a payment method"),

  // Card Details 
  cardHolder: Yup.string().when("paymentMethod", {
    is: "card",
    then: (schema) => schema.required("Cardholder name is required"),
    otherwise: (schema) => schema.notRequired(),
  }),
  cardNumber: Yup.string().when("paymentMethod", {
    is: "card",
    then: (schema) => schema.required("Card number is required").min(16, "Must be 16 digits"),
    otherwise: (schema) => schema.notRequired(),
  }),
  expiryDate: Yup.string().when("paymentMethod", {
    is: "card",
    then: (schema) => schema.required("Expiry date is required"),
    otherwise: (schema) => schema.notRequired(),
  }),
  cvv: Yup.string().when("paymentMethod", {
    is: "card",
    then: (schema) => schema.required("CVV is required").min(3, "Must be 3 digits"),
    otherwise: (schema) => schema.notRequired(),
  }),
});