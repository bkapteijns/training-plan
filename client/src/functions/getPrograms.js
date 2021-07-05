import axios from "axios";

const getPrograms = async (setPrograms, setErrorToast) =>
  axios
    .post(`${process.env.REACT_APP_SERVER_URI}api/graphql`, {
      query: `query getProgramsQuery {
      getPrograms {
        name
        days
        equipment
        description
        price
      }
    }`
    })
    .then((res) => {
      if (res.data.errors) setErrorToast(res.data.errors[0].message);
      return res.data.data.getPrograms;
    })
    .then((data) => setPrograms(data))
    .catch((err) => console.log(err));

export default getPrograms;
