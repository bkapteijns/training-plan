import axios from "axios";

const relogin = async (
  reloginToken,
  setAccount,
  setReloginToken,
  setErrorToast
) =>
  axios
    .post(`${process.env.REACT_APP_SERVER_URI}api/graphql`, {
      query: `query reloginQuery($token: String!) {
      relogin(token: $token) {
        token
        email
        ownedEquipment
        programs {
          name
          token
          length
          finishedDays
          equipment
          description
          price
        }
      }
    }`,
      variables: {
        token: reloginToken
      }
    })
    .then((res) => {
      if (res.data.errors) setErrorToast(res.data.errors[0].message);
      return res.data.data.relogin;
    })
    .then((data) => {
      setAccount(data);
      setReloginToken(data.token);
    })
    .catch((err) => {
      setAccount(null);
      setReloginToken(null);
      console.log(err);
    });

console.log(typeof relogin);

export default relogin;
