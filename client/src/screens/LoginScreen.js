import React, { useState } from "react";
import { Formik } from "formik";
import { Form, Container, Row, Col, Button } from "react-bootstrap";
import validator from "validator";
import axios from "axios";
import { useHistory } from "react-router-dom";

export default function LoginScreen({ setAccount, setReloginToken }) {
  const [serverErrors, setServerErrors] = useState();
  const [oldEmail, setOldEmail] = useState();
  const [oldPassword, setOldPassword] = useState();

  const history = useHistory();

  return (
    <Container>
      <Row>
        <Col>
          <Formik
            initialValues={{ email: "", password: "" }}
            validate={(values) => {
              const errors = {};
              if (!validator.isEmail(values.email))
                errors.email = "Provide a valid email address";
              if (values.password.length < 8)
                errors.password = "Password must be at least 8 characters";
              if (
                serverErrors === "Invalid credentials" &&
                values.email === oldEmail
              )
                errors.email = "Email already in use";
              if (
                serverErrors === "Invalid credentials" &&
                values.password === oldPassword
              )
                errors.password = "Wrong password";
              return errors;
            }}
            onSubmit={async (
              values,
              { setSubmitting, resetForm, validateForm }
            ) => {
              setSubmitting(true);
              setOldEmail(values.email);
              setOldPassword(values.password);
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
                .then((res) => {
                  if (res.data.errors)
                    throw new Error(res.data.errors[0].message);
                  return res.data.data.login;
                })
                .then((data) => {
                  setAccount(data);
                  setReloginToken(data.token);
                  resetForm();
                })
                .then(() => history.push("/"))
                .catch((err) => {
                  setServerErrors(err.message);
                  validateForm();
                });
              setSubmitting(false);
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
                      Welcome {values.email.split("@")[0]}
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
        </Col>
      </Row>
    </Container>
  );
}
