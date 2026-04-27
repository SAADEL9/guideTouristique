// src/api/stripeService.js
import { loadStripe } from '@stripe/stripe-js';

let stripePromise = null;

export const getStripe = () => {
  if (!stripePromise) {
    const key = process.env.REACT_APP_STRIPE_PUBLIC_KEY;

    if (!key) {
      console.error("❌ Stripe key NOT found in .env");
      return null;
    }

    console.log("✅ Stripe key loaded:", key);

    stripePromise = loadStripe(key);
  }

  return stripePromise;
};