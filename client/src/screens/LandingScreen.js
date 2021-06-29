import React from "react";
import { Row, Col, Form, Button, Image } from "react-bootstrap";
import { Formik } from "formik";
import axios from "axios";
import validator from "validator";

export default function LandingScreen({ setAccount, setReloginToken }) {
  return (
    <Row>
      <Col md={7}>
        <Image src="/free-ebook.jpg" alt="Get your free ebook now!" fluid />
      </Col>
      <Col md={5}>
        <Row style={{ marginTop: 50 }}>
          <Col>
            <Formik
              initialValues={{ email: "", password: "" }}
              validate={(values) => {
                const errors = {};
                if (!validator.isEmail(values.email))
                  errors.email = "Provide a valid email address";
                if (
                  !validator.isStrongPassword(values.password, { minLength: 8 })
                )
                  errors.password = "Password must be at least 8 characters";
                return errors;
              }}
              onSubmit={async (values, { validateForm, setSubmitting }) => {
                setSubmitting(true);
                await axios
                  .post(`${process.env.REACT_APP_SERVER_URI}api/graphql`, {
                    query: `mutation loginMutation($userInput: UserInput!) {
                  login(userInput: $userInput) {
                    token
                    email
                    ownedEquipment
                    programs {
                      name
                      token
                      days
                      currentDay
                      equipment
                    }
                  }
                }`,
                    variables: {
                      userInput: values
                    }
                  })
                  .then((res) => res.data.data.login)
                  .then((data) => {
                    setAccount(data);
                    setReloginToken(data.token);
                  })
                  .then(() =>
                    axios
                      .post(
                        `${process.env.REACT_APP_SERVER_URI}api/send-introduction-email`,
                        {
                          emailAddress: values.email
                        }
                      )
                      .catch((e) => console.error(e))
                  )
                  .catch((err) => console.error(err));
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
                    Create an account and recieve the ebook
                  </Form.Label>
                  <Form.Group controlId="accountEmail" as={Row}>
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
                  <Form.Group controlId="accountPassword" as={Row}>
                    <Col md={4}>
                      <Form.Label>Password</Form.Label>
                    </Col>
                    <Col md={8}>
                      <Form.Control
                        type="password"
                        name="password"
                        placeholder="password"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        value={values.password}
                        isValid={!errors.password && touched.password}
                        isInvalid={!!errors.password && touched.password}
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.password}
                      </Form.Control.Feedback>
                      <Form.Control.Feedback type="valid">
                        {validator.isStrongPassword(values.password, {
                          minLength: 12,
                          minLowercase: 1,
                          minUppercase: 1,
                          minNumbers: 1
                        }) && "Very strong!"}
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
                      Create your account!
                    </Button>
                  </Form.Row>
                </Form>
              )}
            </Formik>
            <hr />
            <Formik
              initialValues={{ email: "" }}
              validate={(values) => {
                const errors = {};
                if (!validator.isEmail(values.email))
                  errors.email = "Provide a valid email address";
                return errors;
              }}
              onSumbit={async (values, { setSubmitting, validateForm }) => {
                setSubmitting(true);
                await axios
                  .post(
                    `${process.env.REACT_APP_SERVER_URI}api/send-introduction-email`,
                    {
                      emailAddress: values.email
                    }
                  )
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
      </Col>
    </Row>
  );
}
