import React from "react";
import { Container, Row, Col } from "react-bootstrap";

import LoginForm from "../components/LoginForm";

export default function LoginScreen({ setAccount, setReloginToken }) {
  return (
    <Container>
      <Row>
        <Col>
          <LoginForm
            setAccount={setAccount}
            setReloginToken={setReloginToken}
          />
        </Col>
      </Row>
    </Container>
  );
}
