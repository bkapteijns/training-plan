import React from "react";
import { Link } from "react-router-dom";

export default function ProgramsScreen() {
  return (
    <div>
      <Link to="/programs/basic">Basic program</Link>
      <Link to="programs/bodyweight">Bodyweight program</Link>
    </div>
  );
}
