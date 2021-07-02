import React from "react";
import { useHistory } from "react-router-dom";
import { Container, Row, Col, Card, ListGroup } from "react-bootstrap";

export default function ProgramsScreen({ programData, loggedIn }) {
  const history = useHistory();

  return (
    <Container>
      <Row>
        {programData &&
          programData.map((p) => (
            <Col md={5}>
              <Card key={p.name}>
                <Card.Header>
                  <Card.Title style={{ marginLeft: 20 }}>
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
                    {p.description.substr(0, 200)}
                    {p.description.length > 200 && "..."}
                  </Card.Text>
                  <Card.Subtitle>Equipment</Card.Subtitle>
                  <ListGroup horizontal style={{ overflowX: "auto" }}>
                    {p.equipment.length > 0 ? (
                      p.equipment.map((e) => (
                        <ListGroup.Item
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
                    ) : (
                      <ListGroup.Item>None</ListGroup.Item>
                    )}
                  </ListGroup>
                  <Card.Link
                    style={{ cursor: "pointer" }}
                    onClick={() => history.push(`/programs/${p.name}`)}
                  >
                    View
                  </Card.Link>
                </Card.Body>
              </Card>
            </Col>
          ))}
      </Row>
    </Container>
  );
}
