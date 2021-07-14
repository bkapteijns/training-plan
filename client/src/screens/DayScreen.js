import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import purify from "dompurify";

import { getDay } from "../functions/index";

export default function DayScreen({ account, setErrorToast }) {
  const [plan, setPlan] = useState();

  const { program, day } = useParams();

  useEffect(() => {
    if (account)
      getDay(
        account.programs.filter((p) => p.name === program)[0].token,
        program,
        day,
        setPlan,
        setErrorToast
      );
  }, [account, program, day]);

  return <div>{purify().sanitize(JSON.stringify(plan))}</div>;
}
