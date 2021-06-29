import React, { useState } from "react";
import "./App.css";
import { BrowserRouter, Route, Link } from "react-router-dom";
import axios from "axios";
import validator from "validator";
// import serialize from "serialize-javascript"; This is used for setting tings as json.stringify(...)
// import purify from "dompurify"; This is used for adding things to the dom

import Header from "./components/Header";
import PaymentScreen from "./screens/PaymentScreen";
import LandingScreen from "./screens/LandingScreen";
import ProgramsScreen from "./screens/ProgramsScreen";
import ProgramScreen from "./screens/ProgramScreen";

const useLocalStorage = (item) => {
  const [state, rawSetState] = useState(
    () => window.localStorage.getItem(item) || null
  );
  const setState = (newState) => {
    window.localStorage.setItem(item, newState);
    rawSetState(newState);
  };
  return [state, setState];
};

const useSessionStorage = (item) => {
  const [state, rawSetState] = useState(() =>
    window.sessionStorage.getItem(item)
      ? window.sessionStorage.getItem(item).split(",")
      : []
  );
  const setState = (newState) => {
    window.sessionStorage.setItem(newState.toString());
    rawSetState(newState);
  };
  return [state, setState];
};

export default function App() {
  const [account, setAccount] = useState();
  const [programs, setPrograms] = useState();
  const [reloginToken, setReloginToken] = useLocalStorage("reloginToken");
  const [basket, setBasket] = useSessionStorage("basket");

  window.onload = async (e) => {
    reloginToken &&
      validator.isJWT(reloginToken) &&
      (await axios
        .post(`${process.env.REACT_APP_SERVER_URI}api/graphql`, {
          query: `query reloginQuery($token: String!) {
          relogin(token: $token) {
            token
            email
            ownedEquipment
            programs {
              name
              token
              days
              currentDay
              equipment
            }
          }
        }`,
          variables: {
            token: reloginToken
          }
        })
        .then((res) => res.data.data.relogin)
        .then((data) => {
          setAccount(data);
          setReloginToken(data.token);
        })
        .catch((err) => {
          setAccount(null);
          setReloginToken(null);
          console.log(err);
        }));

    await axios
      .post(`${process.env.REACT_APP_SERVER_URI}api/graphql`, {
        query: `query getProgramsQuery {
          getPrograms {
            name
            token
            days
            currentDay
            equipment
          }
        }`
      })
      .then((res) => res.data.data.getPrograms)
      .then((data) => setPrograms(data))
      .catch((err) => console.log(err));
    console.log(account, programs);
  };

  return (
    <BrowserRouter>
      <Header
        ownedPrograms={account ? account.programs : []}
        allPrograms={programs}
      />
      <Route path="/" exact>
        <Link to="/programs">Look at the different programs</Link>
      </Route>
      <Route path="/landing">
        <LandingScreen
          setAccount={setAccount}
          setReloginToken={setReloginToken}
        />
      </Route>
      <Route path="/programs" exact>
        <ProgramsScreen />
      </Route>
      <Route path="/programs/:programName">
        <ProgramScreen account={account} />
      </Route>
      <Route path="/payment">
        <PaymentScreen />
      </Route>
      <Route path="/checkout">
        <div>Thanks for your purchase!</div>
      </Route>
    </BrowserRouter>
  );
}
