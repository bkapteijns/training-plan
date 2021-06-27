import React from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";

import IdealPaymentForm from "../components/IdealPaymentForm";

const stripePromise = loadStripe(
  "pk_test_51J6XHhGSqSbA8PYS36LxxxqDlscsbWlLQTNgGUR1urkL4K2VkP20JmsRk8Mb0UN7A4MKdAvXiMQaCK0tRpR7L6qL007xNQ9eWm"
);

export default function PaymentScreen() {
  return (
    <Elements stripe={stripePromise}>
      <IdealPaymentForm />
    </Elements>
  );
}