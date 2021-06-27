import React from "react";
import { Button } from "react-bootstrap";
import { Link } from "react-router-dom";

export default function BodyweightProgram({ owned }) {
  return (
    <div>
      Bodyweight program
      {!owned && (
        <Button as={Link} to="/payment">
          Purchase!
        </Button>
      )}
    </div>
  );
}
