import React from "react";
import { ListGroup } from "react-bootstrap";
// import axios from "axios"; Will be needed when wanting to show a video of the exercise

export default function Exercise({ name, expanded, setExpanded }) {
  return (
    <>
      <ListGroup.Item onClick={setExpanded}>
        <div>{name}</div>
      </ListGroup.Item>
      {expanded && (
        <ListGroup.Item style={{ marginLeft: 10 }}>
          This is the exercise!
          <video style={{ height: 360, width: "100%" }} autoPlay loop>
            <source src="/video.mp4" type="video/mp4" />
            Sorry, your browser does not accept the video
          </video>
        </ListGroup.Item>
      )}
    </>
  );
}
