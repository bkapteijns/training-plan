import axios from "axios";

const addEquipment = async (token, program, setAccount, setErrorToast) =>
  axios
    .post(`${process.env.REACT_APP_SERVER_URI}api/graphql`, {
      query: `mutation addProgramMutation($token: String!, $program: String!) {
                  addProgram (token: $token, program: $program) {
                    ownedEquipment
                  }
                }`,
      variables: {
        token,
        program
      }
    })
    .then((r) => {
      if (r.data.errors) setErrorToast(r.data.errors[0].message);
      setAccount((a) => ({
        ...a,
        ownedEquipment: r.data.data.addEquipment.ownedEquipment
      }));
    });

export default addEquipment;
