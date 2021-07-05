import axios from "axios";

const sendEmail = async (emailAddress, type) =>
  axios
    .post(`${process.env.REACT_APP_SERVER_URI}api/emails/send-${type}-email`, {
      emailAddress
    })
    .catch((e) => console.error(e));
export default sendEmail;
