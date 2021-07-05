import axios from "axios";

const addEquipment = async (equipment, account, setAccount, setErrorToast) =>
  axios
    .post(`${process.env.REACT_APP_SERVER_URI}api/graphql`, {
      query: `mutation addEquipmentMutation($token: String!, $equipment: String!) {
                  addEquipment (token: $token, equipment: $equipment) {
                    ownedEquipment
                  }
                }`,
      variables: {
        token: account.token,
        equipment
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
