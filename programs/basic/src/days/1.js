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
              name="Deep squat"
              amount="10 slow reps"
              expanded={exex === "Deep squat"}
              setExpanded={() =>
                setExex((e) => (e === "Deep squat" ? null : "Deep squat"))
              }
            >
              <div>
                We start off with a warmup exercise. This exercise warms up the
                legs and hip joint. Make sure your knees are going outward. They
                can go over your toes.
              </div>
            </Exercise>
            <Exercise
              name="Wall slides"
              amount="10 slow reps"
              expanded={exex === "Wall slides"}
              setExpanded={() =>
                setExex((e) => (e === "Wall slides" ? null : "Wall slides"))
              }
            >
              <div>
                This exercise aims to warmup the shoulders. Shoulders are one of
                the most vulnerable joints. Warming them up is crucial. Wall
                slides also reinforce good posture (if executed properly) by
                putting your chest up and your shoulders back. You may feel
                muscles your upper back. To make the exercise harder, try
                pushing the back of your hands and elbows into the wall.
              </div>
            </Exercise>
            <Exercise
              name="Sword draws"
              amount="10 slow reps per arm"
              expanded={exex === "Sword draws"}
              setExpanded={() =>
                setExex((e) => (e === "Sword draws" ? null : "Sword draws"))
              }
            >
              <div>
                Sword draws also warm up the shoulder joint. They also work the
                shoulder muscle. If you have experience in fitness, you can use
                a mobility band to make the exercise harder.
              </div>
            </Exercise>
            <Exercise
              name="Floor presses"
              amount="3 times 8 reps"
              expanded={exex === "Floor presses"}
              setExpanded={() =>
                setExex((e) => (e === "Floor presses" ? null : "Floor presses"))
              }
            >
              <div>
                Floor presses work the chest, shoulders and arms. Make sure your
                shoulderblades are pulled back and down. If you have never done
                this exercise, pick light dumbbells to learn the proper form.
              </div>
            </Exercise>
            <Exercise
              name="Glute bridge"
              amount="2 times 12 reps"
              expanded={exex === "Glute bridge"}
              setExpanded={() =>
                setExex((e) => (e === "Glute bridge" ? null : "Glute bridge"))
              }
            >
              <div>
                Glute bridges work the leg and butt muscles. To make the
                exercise more comfortable, you can lie on a yoga mat. To make it
                harder, you can put a dumbbell on your hips.
              </div>
            </Exercise>
            <Exercise
              name="Door chest stretch"
              amount="30 seconds per arm"
              expanded={exex === "Door chest stretch"}
              setExpanded={() =>
                setExex((e) =>
                  e === "Door chest stretch" ? null : "Door chest stretch"
                )
              }
            >
              <div>
                Put your shoulder on the round of a door. Also actively pull
                your shoulder down and behind. This makes sure your shoulder is
                safe. Put your arm up and rotate your body away from your
                shoulder. Hold this position for about 30 seconds.
              </div>
            </Exercise>
          </ListGroup>
        </Col>
      </Row>
    </Container>
  );
}
