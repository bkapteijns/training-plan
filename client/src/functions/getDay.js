import axios from "axios";

const getDay = async (token, program, day, setDay, setErrorToast) => {
  axios
    .post(`${process.env.REACT_APP_SERVER_URI}api/graphql`, {
      query: `query getDayQuery($token: String!, $program: String!, $day: Int!) {
        getDay(token: $token, program: $program, day: $day) {
          name
          repetitions
          description
        }
      }`,
      variables: { token, program, day: parseInt(day) }
    })
    .then((res) => {
      if (res.data.errors) setErrorToast(res.data.errors[0].message);
      return res.data.data.getDay;
    })
    .then((data) => setDay(data))
    .catch((err) => console.log(err));
};

export default getDay;
