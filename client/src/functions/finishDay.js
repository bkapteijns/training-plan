import axios from "axios";

const finishDay = async (program, day, token, setAccount) => {
  await axios
    .post(`${process.env.REACT_APP_SERVER_URI}api/graphql`, {
      query: `
        mutation finishDayMutation($program: String!, $token: String!, $day: Int!) {
          finishDay(program: $program, token: $token, day: $day)
        }
      `,
      variables: { program, day: parseInt(day), token }
    })
    .then((res) => res.data.data.finishDay)
    .then(
      (r) =>
        r &&
        setAccount((account) => ({
          ...account,
          programs: account.programs.map((p) =>
            p.name === program
              ? { ...p, finishedDays: [...p.finishedDays, parseInt(day)] }
              : p
          )
        }))
    )
    .catch((err) => console.log(err));
};

export default finishDay;
