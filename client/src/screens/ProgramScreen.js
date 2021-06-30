import React from "react";
import { useParams } from "react-router-dom";

import BasicProgram from "../programs/BasicProgram";
import BodyweightProgram from "../programs/BodyweightProgram";

export default function ProgramScreen({ account, programData }) {
  const params = useParams();

  switch (params.programName) {
    case "one":
      return null;
    case "two":
      return null;
    case "bodyweight":
      return (
        <BodyweightProgram
          owned={
            account &&
            account.programs &&
            account.programs.includes("bodyweight")
          }
          programData={
            (account &&
              account.programs &&
              account.programs.includes("bodyweight")) ||
            programData
          }
        />
      );
    default:
      return <BasicProgram />;
  }
}
