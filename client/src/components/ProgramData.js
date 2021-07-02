import React from "react";
import { Container, Row, Col, Button, ListGroup } from "react-bootstrap";
import { useHistory } from "react-router-dom";

export default function ProgramData({
  data,
  ownedEquipment,
  own,
  addToBasket,
  loggedIn
}) {
  const history = useHistory();

  return (
    <Container>
      <Row>
        <Col>
          <h1>
            {data.name
              .trim()
              .toLowerCase()
              .replace(/\w\S*/g, (w) =>
                w.replace(/^\w/, (c) => c.toUpperCase())
              )}{" "}
            program
          </h1>
        </Col>
      </Row>
      <Row>
        <Col md={9}>
          <Row style={{ justifyContent: "center" }}>
            <Col md={10}>
              <div>{data.description}</div>
            </Col>
          </Row>
          <h2>Equipment</h2>
          <Row style={{ justifyContent: "center" }}>
            <Col md={10}>
              <ListGroup>
                {data.equipment.length === 0 ? (
                  <ListGroup.Item>
                    No equipment needed for this program!
                  </ListGroup.Item>
                ) : (
                  data.equipment.map((e) => (
                    <ListGroup.Item
                      key={e}
                      variant={
                        ownedEquipment.includes(e) ? "success" : "danger"
                      }
                      style={loggedIn && { cursor: "pointer" }}
                      onClick={() => loggedIn && history.push("/equipment")}
                    >
                      {e
                        .trim()
                        .toLowerCase()
                        .replace(/\w\S*/g, (w) =>
                          w.replace(/^\w/, (c) => c.toUpperCase())
                        )}
                    </ListGroup.Item>
                  ))
                )}
              </ListGroup>
            </Col>
          </Row>
          {!own && (
            <>
              <h2>Purchase</h2>
              <Button onClick={() => addToBasket(data.name)}>
                Buy the program -{" "}
                {data.price === 0
                  ? "FREE"
                  : "€" + parseFloat(data.price / 100).toFixed(2)}
              </Button>
            </>
          )}
        </Col>
        <Col md={3}>
          <ListGroup>
            {[...Array(data.days).keys()].map((n) => (
              <ListGroup.Item
                style={{ cursor: "pointer" }}
                variant={
                  own && n + 1 < data.currentDay
                    ? "success"
                    : own && n + 1 === data.currentDay
                    ? "warning"
                    : ""
                }
                key={n}
                onClick={() =>
                  own &&
                  window.open(
                    `${process.env.REACT_APP_SERVER_URI}program/${data.name}/${
                      n + 1
                    }?token=${data.token}`
                  )
                }
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
