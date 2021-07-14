import React from "react";
import { Row, Col, ListGroup } from "react-bootstrap";
// import axios from "axios"; Will be needed when wanting to show a video of the exercise

export default function Exercise({
  children,
  name,
  amount,
  expanded,
  setExpanded
}) {
  return (
    <div style={{ marginBottom: 10 }}>
      <ListGroup.Item onClick={setExpanded} style={{ cursor: "pointer" }}>
        <div>
          {name}, {amount}
        </div>
      </ListGroup.Item>
      {expanded && (
        <ListGroup.Item>
          <video
            style={{ maxHeight: 360, width: "100%" }}
            autoPlay
            loop
            onClick={(e) =>
              e.target.paused ? e.target.play() : e.target.pause()
            }
          >
            <source src={`/videos/${name}.mp4`} type="video/mp4" />
            Sorry, your browser does not accept the video
          </video>
          <p>Click the video to play/pause</p>
          <Row style={{ justifyContent: "center" }}>
            <Col md={10}>{children}</Col>
          </Row>
        </ListGroup.Item>
      )}
    </div>
  );
}
