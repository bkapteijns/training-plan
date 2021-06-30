import React from "react";
import { Container, Row, Col, Button, ListGroup } from "react-bootstrap";

export default function ProgramData({ data, ownedEquipment, own }) {
  return (
    <Container>
      <Row>
        <Col>
          <h1>
            {data.name
              .toLowerCase()
              .replace(/\w\S*/g, (w) =>
                w.replace(/^\w/, (c) => c.toUpperCase())
              )}
          </h1>
        </Col>
      </Row>
      <Row>
        <Col md={10}>
          <Row style={{ justifyContent: "center" }}>
            <Col md={10}>
              <div>{data.description}</div>
            </Col>
          </Row>
          <h2>Equipment</h2>
          <ListGroup>
            {data.equipment.length === 0 ? (
              <ListGroup.Item>
                No equipment needed for this program!
              </ListGroup.Item>
            ) : (
              data.equipment.map((e) => (
                <ListGroup.Item
                  key={e}
                  variant={ownedEquipment.includes(e) ? "success" : "danger"}
                >
                  {e
                    .toLowerCase()
                    .replace(/\w\S*/g, (w) =>
                      w.replace(/^\w/, (c) => c.toUpperCase())
                    )}
                </ListGroup.Item>
              ))
            )}
          </ListGroup>
          {!own && (
            <>
              <h2>Purchase</h2>
              <Button>
                Buy the program -{" "}
                {data.price === 0
                  ? "FREE"
                  : "€" + parseFloat(data.price / 100).toFixed(2)}
              </Button>
            </>
          )}
        </Col>
        <Col md={2}>
          <ListGroup>
            {[...Array(data.days).keys()].map((n) => (
              <ListGroup.Item
                variant={
                  own && n < data.currentDay
                    ? "success"
                    : own && n === data.currentDay
                    ? "warning"
                    : ""
                }
                key={n}
              >
                Day {(n + 1).toString()}
              </ListGroup.Item>
            ))}
          </ListGroup>
        </Col>
      </Row>
    </Container>
  );
}
