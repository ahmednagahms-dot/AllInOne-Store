import * as Yup from "yup";

export const getCheckoutSchema = (t = (k, def) => def || k) =>
  Yup.object().shape({
    // Shipping Information
    fullName: Yup.string().required(
      t("checkout.errors.fullNameRequired", "Full name is required")
    ),
    email: Yup.string()
      .email(t("checkout.errors.emailInvalid", "Invalid email address"))
      .required(t("checkout.errors.emailRequired", "Email is required")),
    phone: Yup.string().required(
      t("checkout.errors.phoneRequired", "Phone number is required")
    ),
    country: Yup.string().required(
      t("checkout.errors.countryRequired", "Country is required")
    ),
    city: Yup.string().required(
      t("checkout.errors.cityRequired", "City is required")
    ),
    postalCode: Yup.string().required(
      t("checkout.errors.postalCodeRequired", "Postal code is required")
    ),
    address: Yup.string().required(
      t("checkout.errors.addressRequired", "Address is required")
    ),
    apartment: Yup.string(), // Optional

    // Delivery Method
    deliveryMethod: Yup.string().required(
      t(
        "checkout.errors.deliveryMethodRequired",
        "Please select a delivery method"
      )
    ),

    // Payment Method
    paymentMethod: Yup.string().required(
      t(
        "checkout.errors.paymentMethodRequired",
        "Please select a payment method"
      )
    ),

    // Card Details
    cardHolder: Yup.string().when("paymentMethod", {
      is: "card",
      then: (schema) =>
        schema.required(
          t("checkout.errors.cardHolderRequired", "Cardholder name is required")
        ),
      otherwise: (schema) => schema.notRequired(),
    }),
    cardNumber: Yup.string().when("paymentMethod", {
      is: "card",
      then: (schema) =>
        schema
          .required(
            t("checkout.errors.cardNumberRequired", "Card number is required")
          )
          .min(
            16,
            t("checkout.errors.cardNumberMin", "Must be 16 digits")
          ),
      otherwise: (schema) => schema.notRequired(),
    }),
    expiryDate: Yup.string().when("paymentMethod", {
      is: "card",
      then: (schema) =>
        schema.required(
          t("checkout.errors.expiryDateRequired", "Expiry date is required")
        ),
      otherwise: (schema) => schema.notRequired(),
    }),
    cvv: Yup.string().when("paymentMethod", {
      is: "card",
      then: (schema) =>
        schema
          .required(t("checkout.errors.cvvRequired", "CVV is required"))
          .min(3, t("checkout.errors.cvvMin", "Must be 3 digits")),
      otherwise: (schema) => schema.notRequired(),
    }),
  });

export const checkoutSchema = getCheckoutSchema();