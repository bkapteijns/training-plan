import React from "react";
import { Container, Row, Col, Form, Button } from "react-bootstrap";
import { Formik } from "formik";
import axios from "axios";
import validator from "validator";

import LoginForm from "../components/LoginForm";
import { sendEmail } from "../functions";

export default function LandingScreen({
  loggedIn,
  setAccount,
  setReloginToken
}) {
  return (
    <div
      style={{
        backgroundImage: 'url("/free-ebook.jpg")',
        height: "100%",
        width: "100%",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
        position: "fixed",
        margin: 0
      }}
    >
      <Container
        style={{
          paddingTop: 100,
          height: "100%",
          color: "white",
          backdropFilter: "blur(10px)",
          width: "50%",
          boxShadow: "0px 0px 10px 5px #101010"
        }}
      >
        <Row style={{ justifyContent: "center" }}>
          <h2>Free ebook</h2>
        </Row>
        <hr style={{ background: "white" }} />
        {loggedIn ? (
          <Row>
            <Col>
              <p>
                The ebook will be sent to your email once you press the button
                below.
              </p>
              <Button>Get the ebook!</Button>
            </Col>
          </Row>
        ) : (
          <Row>
            <Col>
              <h4>Sign up for free</h4>
              <LoginForm
                setAccount={setAccount}
                setReloginToken={setReloginToken}
                onSubmitExtra={({ email }) => sendEmail(email, "introduction")}
              />
              <hr
                style={{
                  background: "white",
                  width: "80%",
                  marginLeft: "10%"
                }}
              />
              <Formik
                initialValues={{ email: "" }}
                validate={(values) => {
                  const errors = {};
                  if (!validator.isEmail(values.email))
                    errors.email = "Provide a valid email address";
                  return errors;
                }}
                onSubmit={async (
                  values,
                  { setSubmitting, validateForm, resetForm }
                ) => {
                  setSubmitting(true);
                  await axios
                    .post(
                      `${process.env.REACT_APP_SERVER_URI}api/emails/send-introduction-email`,
                      {
                        emailAddress: values.email
                      }
                    )
                    .then(resetForm)
                    .catch((e) => console.error(e));
                  setSubmitting(false);
                  validateForm();
                }}
              >
                {({
                  values,
                  errors,
                  touched,
                  handleChange,
                  handleBlur,
                  handleSubmit
                }) => (
                  <Form onSubmit={handleSubmit}>
                    <Form.Label>
                      <h4>Or just try the ebook</h4>
                    </Form.Label>
                    <Form.Group controlId="bookEmail" as={Row}>
                      <Col md={4}>
                        <Form.Label>Email</Form.Label>
                      </Col>
                      <Col md={8}>
                        <Form.Control
                          type="text"
                          name="email"
                          placeholder="email@example.com"
                          onChange={handleChange}
                          onBlur={handleBlur}
                          value={values.email}
                          isValid={!errors.email && touched.email}
                          isInvalid={!!errors.email && touched.email}
                        />
                        <Form.Control.Feedback type="invalid">
                          {errors.email}
                        </Form.Control.Feedback>
                        <Form.Control.Feedback type="valid">
                          Ebook will be sent to {values.email}
                        </Form.Control.Feedback>
                      </Col>
                    </Form.Group>
                    <Form.Row
                      style={{
                        display: "flex",
                        justifyContent: "flex-end",
                        margin: 10
                      }}
                    >
                      <Button variant="primary" type="submit">
                        Get your ebook!
                      </Button>
                    </Form.Row>
                  </Form>
                )}
              </Formik>
            </Col>
          </Row>
        )}
      </Container>
    </div>
  );
}
