import React from "react";
import { Container, Row, Col, Form, Button, Image } from "react-bootstrap";
import { Formik } from "formik";
import axios from "axios";
import validator from "validator";

import LoginForm from "../components/LoginForm";
import { sendEmail } from "../functions";

export default function LandingScreen({ setAccount, setReloginToken }) {
  return (
    <div style={{ overflow: "hidden" }}>
      <Row>
        <Col style={{ width: "100%" }} md={7}>
          <Image src="/free-ebook.jpg" alt="Get your free ebook now!" fluid />
        </Col>
        <Col md={5}>
          <Container>
            <Row>
              <Col>
                <LoginForm
                  setAccount={setAccount}
                  setReloginToken={setReloginToken}
                  onSubmitExtra={({ email }) =>
                    sendEmail(email, "introduction")
                  }
                />
                <hr />
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
                      <Form.Label>Or just try the ebook</Form.Label>
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
          </Container>
        </Col>
      </Row>
    </div>
  );
}
