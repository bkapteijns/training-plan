import axios from "axios";

const restartProgram = async (program, token, setAccount) => {
  await axios
    .post(`${process.env.REACT_APP_SERVER_URI}api/graphql`, {
      query: `
        mutation restartProgramMutation($program: String!, $token: String!) {
          restartProgram(program: $program, token: $token)
        }
      `,
      variables: { program, token }
    })
    .then((res) => res.data.data.restartProgram)
    .then(
      (r) =>
        r &&
        setAccount((account) => ({
          ...account,
          programs: account.programs.map((p) =>
            p.name === program ? { ...p, finishedDays: [] } : p
          )
        }))
    )
    .catch((err) => console.log(err));
};

export default restartProgram;
