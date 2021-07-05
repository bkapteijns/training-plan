import React, { useState } from "react";
import {
  IdealBankElement,
  useStripe,
  useElements
} from "@stripe/react-stripe-js";
import { Container, Row, Col, Form, Button } from "react-bootstrap";
import axios from "axios";

export default function IdealPaymentForm({ emailAddress, items }) {
  const [succeeded, setSucceeded] = useState(false);
  const [error, setError] = useState(null);
  const [processing, setProcessing] = useState("");
  const [disabled, setDisabled] = useState(true);

  const stripe = useStripe();
  const elements = useElements();

  const handleChange = async (e) => {
    setDisabled(e.empty);
    setError(e.error ? e.error.message : "");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setProcessing(true);

    await axios
      .post(
        `${process.env.REACT_APP_SERVER_URI}api/stripe/create-payment-intent`,
        { items, emailAddress },
        {
          headers: { "Content-Type": "application/json" }
        }
      )
      .then((res) => res.data)
      .then(async (data) => {
        const payload = stripe.confirmIdealPayment(data.clientSecret, {
          payment_method: { ideal: elements.getElement(IdealBankElement) },
          return_url: process.env.REACT_APP_PAYMENT_RETURN
        });
        if (payload.error) {
          setError(`Payment failed ${payload.error.message}`);
          return setProcessing(false);
        }
      })
      .catch((e) => console.log(e));
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
