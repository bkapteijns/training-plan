import React, { useEffect, useState } from "react";
import { useParams, useHistory } from "react-router-dom";
import { Container, Row, Col, ListGroup, Button } from "react-bootstrap";

import Exercise from "../components/Exercise";
import { getDay, finishDay } from "../functions/index";

export default function DayScreen({
  account,
  setErrorToast,
  programs,
  setAccount
}) {
  const [plan, setPlan] = useState();
  const [expanded, setExpanded] = useState();

  const history = useHistory();
  const { program, day } = useParams();

  useEffect(() => {
    if (account)
      try {
        getDay(
          account.programs.filter((p) => p.name === program)[0].token,
          program,
          day,
          setPlan,
          setErrorToast
        );
      } catch (e) {
        console.log(e);
      }
  }, [account, program, day, setErrorToast]);

  return plan ? (
    <Container>
      <Row className="justify-content-center">
        <h1>
          Day {day}
          {account.programs
            .filter((p) => p.name === program)[0]
            .finishedDays.includes(parseInt(day)) && ", finished"}
        </h1>
      </Row>
      <Row>
        <ListGroup className="w-100 mb-3" horizontal>
          <ListGroup.Item
            className="flex-grow-1"
            style={{ fontSize: 20, cursor: "pointer" }}
            onClick={() =>
              day != 1 && history.push(`/program/${program}/${day - 1}`)
            }
          >
            {day != 1 && "Previous day"}
          </ListGroup.Item>
          <ListGroup.Item
            className="flex-grow-1 text-right"
            style={{ fontSize: 20, cursor: "pointer" }}
            onClick={() =>
              programs &&
              day != programs.filter((p) => p.name === program)[0].length &&
              history.push(`/program/${program}/${parseInt(day) + 1}`)
            }
          >
            {programs &&
              day != programs.filter((p) => p.name === program)[0].length &&
              "Next day"}
          </ListGroup.Item>
        </ListGroup>
      </Row>
      <Row>
        <Col>
          {plan
            ? plan.map(
                (e) =>
                  e && (
                    <Exercise
                      key={e.name}
                      name={e.name}
                      repetitions={e.repetitions}
                      description={e.description}
                      expanded={expanded === e.name}
                      setExpanded={() =>
                        expanded === e.name
                          ? setExpanded(null)
                          : setExpanded(e.name)
                      }
                    />
                  )
              )
            : "Loading"}
        </Col>
      </Row>
      <Row style={{ display: "flex", justifyContent: "flex-end" }}>
        <Button
          onClick={() =>
            finishDay(
              program,
              day,
              account.programs.filter((p) => p.name === program)[0].token,
              setAccount
            )
          }
          variant="success"
        >
          Finish day
        </Button>
      </Row>
    </Container>
  ) : (
    <div>Loading</div>
  );
}
