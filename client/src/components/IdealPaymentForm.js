import React, { useState, useEffect } from "react";
import {
  IdealBankElement,
  useStripe,
  useElements
} from "@stripe/react-stripe-js";
import { Container, Row, Col, Form, Button } from "react-bootstrap";
import axios from "axios";

import dotenv from "dotenv";
dotenv.config();

export default function IdealPaymentForm() {
  const [succeeded, setSucceeded] = useState(false);
  const [error, setError] = useState(null);
  const [processing, setProcessing] = useState("");
  const [disabled, setDisabled] = useState(true);
  const [clientSecret, setClientSecret] = useState("");

  const stripe = useStripe();
  const elements = useElements();

  useEffect(() => {
    console.log(process.env.REACT_APP_SERVER_URI + "create-payment-intent");
    axios
      .post(process.env.REACT_APP_SERVER_URI + "create-payment-intent", {
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items: [] })
      })
      .then((res) => {
        console.log(res.data);
        return res.data;
      })
      .then((data) => setClientSecret(data.clientSecret));
  }, []);

  const handleChange = async (e) => {
    setDisabled(e.empty);
    setError(e.error ? e.error.message : "");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setProcessing(true);

    const payload = await stripe.confirmIdealPayment(clientSecret, {
      payment_method: { ideal: elements.getElement(IdealBankElement) },
      return_url: process.env.REACT_APP_PAYMENT_RETURN
    });

    if (payload.error) {
      setError(`Payment failed ${payload.error.message}`);
      return setProcessing(false);
    }
    setError(null);
    setSucceeded(true);
    return setProcessing(false);
  };

  return (
    <Container>
      <Row style={{ marginTop: 50 }}>
        <Col>
          <Form onSubmit={handleSubmit}>
            <IdealBankElement id="card-element" onChange={handleChange} />
            <Button
              type="submit"
              disabled={processing || disabled || succeeded}
            >
              Pay
            </Button>
            {error && (
              <Row>
                <Col>{error}</Col>
              </Row>
            )}
          </Form>
        </Col>
      </Row>
    </Container>
  );
}
