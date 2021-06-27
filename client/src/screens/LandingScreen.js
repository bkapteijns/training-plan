import React, { useState } from "react";
import { Row, Col, Form, Button, Image } from "react-bootstrap";
import axios from "axios";

export default function LandingScreen({ setAccount }) {
  const [accountEmail, setAccountEmail] = useState("");
  const [accountPassword, setAccountPassword] = useState("");
  const [emailAddress, setEmailAddress] = useState("");

  return (
    <Row>
      <Col md={7}>
        <Image src="/free-ebook.jpg" alt="Get your free ebook now!" fluid />
      </Col>
      <Col md={5}>
        <Row style={{ marginTop: 50 }}>
          <Col>
            <Form
              onSubmit={(e) => {
                e.preventDefault();
                axios
                  .post(`${process.env.REACT_APP_SERVER_URI}api/register`, {
                    email: accountEmail,
                    password: accountPassword
                  })
                  .then((res) => res.data)
                  .then((data) => setAccount(data))
                  .catch((e) => console.error(e));
                setAccountEmail("");
                setAccountPassword("");
              }}
            >
              <Form.Label>Create an account</Form.Label>
              <Form.Group controlId="accountEmail" as={Row}>
                <Col md={4}>
                  <Form.Label>Email</Form.Label>
                </Col>
                <Col md={8}>
                  <Form.Control
                    type="text"
                    placeholder="email@example.com"
                    value={accountEmail}
                    onChange={(e) => setAccountEmail(e.target.value)}
                  />
                </Col>
              </Form.Group>
              <Form.Group controlId="accountPassword" as={Row}>
                <Col md={4}>
                  <Form.Label>Password</Form.Label>
                </Col>
                <Col md={8}>
                  <Form.Control
                    type="password"
                    placeholder="password"
                    value={accountPassword}
                    onChange={(e) => setAccountPassword(e.target.value)}
                  />
                </Col>
              </Form.Group>
              <Form.Row
                style={{
                  display: "flex",
                  justifyContent: "flex-end",
                  margin: 10
                }}
              >
                <Button type="submit">Create your account!</Button>
              </Form.Row>
            </Form>
            <hr />
            <Form
              onSubmit={(e) => {
                e.preventDefault();
                axios
                  .post(
                    `${process.env.REACT_APP_SERVER_URI}api/send-introduction-email`,
                    {
                      emailAddress
                    }
                  )
                  .then((res) => setEmailAddress(""))
                  .catch((e) => console.error(e));
              }}
            >
              <Form.Label>Or just try the ebook</Form.Label>
              <Form.Group controlId="bookEmail" as={Row}>
                <Col md={4}>
                  <Form.Label>Email</Form.Label>
                </Col>
                <Col md={8}>
                  <Form.Control
                    type="text"
                    placeholder="email@example.com"
                    value={emailAddress}
                    onChange={(e) => setEmailAddress(e.target.value)}
                  />
                </Col>
              </Form.Group>
              <Form.Row
                style={{
                  display: "flex",
                  justifyContent: "flex-end",
                  margin: 10
                }}
              >
                <Button type="submit">Get your ebook!</Button>
              </Form.Row>
            </Form>
          </Col>
        </Row>
      </Col>
    </Row>
  );
}
