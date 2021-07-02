import React from "react";
import { Container, Row, Col, Card, Button } from "react-bootstrap";
import { useHistory } from "react-router-dom";

export default function BasketScreen({ basket, setBasket, programData }) {
  const history = useHistory();

  return (
    <Container>
      <Row>
        <Col>
          {programData && basket && basket.length > 0 ? (
            programData
              .filter((p) => basket.includes(p.name))
              .map((p) => (
                <Card>
                  <Card.Header className="text-center">
                    <Card.Title>
                      {p.name
                        .trim()
                        .toLowerCase()
                        .replace(/\w\S*/g, (w) =>
                          w.replace(/^\w/, (c) => c.toUpperCase())
                        )}
                    </Card.Title>
                  </Card.Header>
                  <Card.Body>
                    <Card.Text>
                      {p.description.substr(0, 500)}
                      {p.description.length > 500 && "..."}
                    </Card.Text>
                    <Card.Link
                      style={{ cursor: "pointer" }}
                      onClick={() => history.push(`/programs/${p.name}`)}
                    >
                      View
                    </Card.Link>
                  </Card.Body>
                  <Card.Footer>
                    <Row style={{ justifyContent: "space-between" }}>
                      <Button
                        variant="outline-danger"
                        onClick={() =>
                          setBasket(basket.filter((i) => i !== p.name))
                        }
                      >
                        Remove from basket
                      </Button>
                      <Card.Text>
                        Price:{" "}
                        {p.price === 0
                          ? "FREE"
                          : "€" + parseFloat(p.price / 100).toFixed(2)}
                      </Card.Text>
                    </Row>
                  </Card.Footer>
                </Card>
              ))
          ) : (
            <div>
              You do not have anything in your basket.{" "}
              <span
                style={{ cursor: "pointer", color: "blue" }}
                onClick={() => history.push("/programs")}
              >
                Buy a program!
              </span>
            </div>
          )}
          <Row>
            <Col style={{ display: "flex", justifyContent: "flex-end" }}>
              <Button
                variant="primary"
                onClick={() => history.push("/payment")}
              >
                Purchase now
              </Button>
            </Col>
          </Row>
        </Col>
      </Row>
    </Container>
  );
}
