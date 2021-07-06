import React, { useState } from "react";
import { Container, Row, Col, ListGroup } from "react-bootstrap";

import Exercise from "./Exercise";

export default function DayOne() {
  const [exex, setExex] = useState(null);
  return (
    <Container>
      <Row>
        <Col>
          <ListGroup>
            <Exercise
              name="Name1"
              expanded={exex === "Name1"}
              setExpanded={() =>
                setExex((e) => (e === "Name1" ? null : "Name1"))
              }
            />
            <Exercise
              name="Name2"
              expanded={exex === "Name2"}
              setExpanded={() =>
                setExex((e) => (e === "Name2" ? null : "Name2"))
              }
            />
          </ListGroup>
        </Col>
      </Row>
    </Container>
  );
}
