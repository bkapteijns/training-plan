import axios from "axios";

const login = async (email, password, setAccount, setReloginToken) => {
  await axios
    .post(`${process.env.REACT_APP_SERVER_URI}api/graphql`, {
      query: `mutation loginMutation($userInput: UserInput!) {
        login(userInput: $userInput) {
          token
          email
          ownedEquipment
          programs {
            name
            token
            days
            finishedDays
            description
            equipment
            price
          }
        }
      }`,
      variables: {
        userInput: { email, password }
      }
    })
    .then((res) => {
      if (res.data.errors) throw new Error(res.data.errors[0].message);
      return res.data.data.login;
    })
    .then((data) => {
      setAccount(data);
      setReloginToken(data.token);
    });
};

export default login;