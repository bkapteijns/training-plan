import React, { useState, useEffect } from "react";
import { Container, Row, Col, ListGroup, Button } from "react-bootstrap";
import axios from "axios";

export default function EquipmentScreen({ owned, setOwned, setErrorToast }) {
  const [allEquipment, setAllEquipment] = useState();

  useEffect(
    () =>
      (async () =>
        setAllEquipment(
          await axios
            .post(`${process.env.REACT_APP_SERVER_URI}api/graphql`, {
              query: `query getEquipmentQuery {
              getEquipment
            }`
            })
            .then((r) => {
              if (r.data.errors) setErrorToast(r.data.errors[0].message);
              return r.data.data.getEquipment;
            })
        ))(),
    []
  );

  if (!owned) return <div>Loading</div>;

  return (
    <Container>
      <Row>
        <Col>
          <ListGroup>
            {allEquipment &&
              allEquipment.map((e) => (
                <ListGroup.Item
                  style={{ marginBottom: 5 }}
                  key={e}
                  variant={owned.includes(e) ? "success" : "danger"}
                >
                  <Row>
                    <Col>
                      {e
                        .trim()
                        .toLowerCase()
                        .replace(/\w\S*/g, (w) =>
                          w.replace(/^\w/, (c) => c.toUpperCase())
                        )}
                    </Col>
                    <Button
                      variant={owned.includes(e) ? "danger" : "success"}
                      onClick={() => setOwned(e)}
                    >
                      I {owned.includes(e) && "don't"} own it
                    </Button>
                  </Row>
                </ListGroup.Item>
              ))}
          </ListGroup>
        </Col>
      </Row>
    </Container>
  );
}
