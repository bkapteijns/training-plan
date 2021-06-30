import React from "react";
import { useParams } from "react-router-dom";

import BasicProgram from "../programs/BasicProgram";
import BodyweightProgram from "../programs/BodyweightProgram";

export default function ProgramScreen({ account, programData }) {
  const params = useParams();

  let own;

  if (!account || !programData) return <div>Loading</div>;

  switch (params.programName) {
    case "bodyweight":
      own =
        account &&
        account.programs &&
        account.programs.filter((p) => p.name === "bodyweight");
      return (
        <BodyweightProgram
          owned={own && own.length > 0}
          programData={
            own && own.length > 0
              ? own[0]
              : programData.filter((p) => p.name === "bodyweight")[0]
          }
        />
      );
    default:
      own =
        account &&
        account.programs &&
        account.programs.filter((p) => p.name === "basic");
      return (
        <BasicProgram
          programData={
            own && own.length > 0
              ? own[0]
              : programData.filter((p) => p.name === "basic")[0]
          }
        />
      );
  }
}
