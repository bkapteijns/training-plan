import React from "react";
import { useParams } from "react-router-dom";

import ProgramData from "../components/ProgramData";

export default function ProgramScreen({
  account,
  setAccount,
  programData,
  addProgram
}) {
  const params = useParams();

  if (
    account &&
    account.programs &&
    account.programs.filter((p) => p.name === params.programName).length > 0
  ) {
    return (
      <ProgramData
        data={account.programs.filter((p) => p.name === params.programName)[0]}
        ownedEquipment={account.ownedEquipment}
        own={
          account.programs.filter((p) => p.name === params.programName)[0].token
        }
        loggedIn={account.token}
        setAccount={setAccount}
      />
    );
  } else if (
    programData &&
    programData.filter((p) => p.name === params.programName).length > 0
  ) {
    return (
      <ProgramData
        data={programData.filter((p) => p.name === params.programName)[0]}
        ownedEquipment={account ? account.ownedEquipment : []}
        loggedIn={account && account.token}
        setAccount={setAccount}
        addProgram={(program) => addProgram(program)}
      />
    );
  } else return <div>Program not found</div>;
}
