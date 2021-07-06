import React, { useEffect, useState } from "react";
import { useParams, useLocation, useHistory } from "react-router-dom";
import { Container, Row, Col, Button, ListGroup } from "react-bootstrap";
import axios from "axios";

import Days from "./days/index";

import dotenv from "dotenv";
dotenv.config();

export default function ProgramDay() {
  const [finished, setFinished] = useState();

  const { day } = useParams();
  const location = useLocation();
  const history = useHistory();
  const token = new URLSearchParams(location.search).get("token");

  useEffect(() => {
    axios
      .post(`${process.env.REACT_APP_SERVER_URI}api/graphql`, {
        query: `query getProgramQuery {
          getProgram (program: "basic", token: "${token}", day: ${day}) {
            finished
          }
        }`
      })
      .then((r) => {
        setFinished(r.data.data.getProgram.finished);
      });
  }, [setFinished, day, token]);

  const Component = Days[day];

  return (
    <Container>
      <Row>
        <ListGroup className="w-100" horizontal>
          <ListGroup.Item
            className="w-50"
            style={{ cursor: "pointer" }}
            disabled={day == 1}
            onClick={() =>
              history.push(`/program/basic/${parseInt(day) - 1}?token=${token}`)
            }
          >
            Previous
          </ListGroup.Item>
          <ListGroup.Item
            className="w-50 text-right"
            style={{ cursor: "pointer" }}
            disabled={day == 30}
            onClick={() =>
              history.push(`/program/basic/${parseInt(day) + 1}?token=${token}`)
            }
          >
            Next
          </ListGroup.Item>
        </ListGroup>
      </Row>
      <Row>
        <Col>{Component ? <Component /> : "Day does not exist"}</Col>
      </Row>
      <Row>
        <Col>
          {finished ? (
            <div>Congratulations, you have finished this workout!</div>
          ) : (
            <Button
              onClick={() =>
                axios
                  .post(`${process.env.REACT_APP_SERVER_URI}api/graphql`, {
                    query: `mutation finishProgramMutation {
                    finishProgram (program: "basic", token: "${token}", day: ${day}) {
                      finished
                    }
                  }`
                  })
                  .then((r) => setFinished(r.data.data.finishProgram.finished))
              }
              disabled={finished}
            >
              Finish
            </Button>
          )}
        </Col>
      </Row>
    </Container>
  );
}
