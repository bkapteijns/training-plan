import React, { useEffect, useState } from "react";
import "./App.css";
import { BrowserRouter, Route, Link } from "react-router-dom";
import axios from "axios";
import validator from "validator";
// import serialize from "serialize-javascript"; This is used for setting tings as json.stringify(...)
// import purify from "dompurify"; This is used for adding things to the dom

import Header from "./components/Header";
import ErrorToaster from "./components/ErrorToaster";
import PaymentScreen from "./screens/PaymentScreen";
import LandingScreen from "./screens/LandingScreen";
import ProgramsScreen from "./screens/ProgramsScreen";
import ProgramScreen from "./screens/ProgramScreen";
import LoginScreen from "./screens/LoginScreen";
import BasketScreen from "./screens/BasketScreen";
import EquipmentScreen from "./screens/EquipmentScreen";

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
    window.sessionStorage.setItem(item, newState.toString());
    rawSetState(newState);
  };
  return [state, setState];
};

export default function App() {
  const [account, setAccount] = useState();
  const [programs, setPrograms] = useState();
  const [errorToast, setErrorToast] = useState();
  const [moveToast, setMoveToast] = useState();
  const [reloginToken, setReloginToken] = useLocalStorage("reloginToken");
  const [basket, setBasket] = useSessionStorage("basket");

  useEffect(
    () =>
      (async () => {
        reloginToken &&
          !account &&
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
            }));

        !programs &&
          (await axios
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
            .catch((err) => console.log(err)));
      })(),
    []
  );

  return (
    <BrowserRouter>
      <Header
        loggedIn={account && account.token}
        logout={() => {
          setAccount(null);
          setReloginToken(null);
        }}
        ownedPrograms={account ? account.programs : []}
        allPrograms={programs}
        basket={basket}
        setMoveToast={setMoveToast}
      />
      {errorToast && (
        <ErrorToaster
          message={errorToast}
          onClose={() => setErrorToast(null)}
          move={moveToast}
        />
      )}
      <Route path="/" exact>
        <Link to="/programs">Look at the different programs</Link>
      </Route>
      <Route path="/landing">
        <LandingScreen
          setAccount={setAccount}
          setReloginToken={setReloginToken}
        />
      </Route>
      <Route path="/login">
        <LoginScreen
          setAccount={setAccount}
          setReloginToken={setReloginToken}
        />
      </Route>
      <Route path="/programs" exact>
        <ProgramsScreen
          programData={programs}
          loggedIn={account && account.token}
        />
      </Route>
      <Route path="/programs/:programName">
        <ProgramScreen
          account={account}
          programData={programs}
          addToBasket={(item) => setBasket([...basket, item])}
        />
      </Route>
      <Route path="/equipment">
        <EquipmentScreen
          setErrorToast={setErrorToast}
          owned={account && account.ownedEquipment}
          setOwned={async (e) => {
            setAccount((a) => ({
              ...a,
              ownedEquipment:
                a && a.ownedEquipment.includes(e)
                  ? a && a.ownedEquipment.filter((i) => i !== e)
                  : [...a.ownedEquipment, e]
            }));
            if (account && account.ownedEquipment.includes(e))
              return axios
                .post(`${process.env.REACT_APP_SERVER_URI}api/graphql`, {
                  query: `mutation removeEquipmentMutation($token: String!, $equipment: String!) {
                    removeEquipment (token: $token, equipment: $equipment) {
                      ownedEquipment
                    }
                  }`,
                  variables: {
                    token: account.token,
                    equipment: e
                  }
                })
                .then((r) => {
                  if (r.data.errors) setErrorToast(r.data.errors[0].message);
                  setAccount((a) => ({
                    ...a,
                    ownedEquipment: r.data.data.removeEquipment.ownedEquipment
                  }));
                });
            return axios
              .post(`${process.env.REACT_APP_SERVER_URI}api/graphql`, {
                query: `mutation addEquipmentMutation($token: String!, $equipment: String!) {
                  addEquipment (token: $token, equipment: $equipment) {
                    ownedEquipment
                  }
                }`,
                variables: {
                  token: account.token,
                  equipment: e
                }
              })
              .then((r) => {
                if (r.data.errors) setErrorToast(r.data.errors[0].message);
                setAccount((a) => ({
                  ...a,
                  ownedEquipment: r.data.data.addEquipment.ownedEquipment
                }));
              });
          }}
        />
      </Route>
      <Route path="/basket">
        <BasketScreen
          basket={basket}
          setBasket={setBasket}
          programData={programs}
        />
      </Route>
      <Route path="/payment">
        <PaymentScreen
          emailAddress={account && account.email}
          basket={basket}
          setErrorToast={setErrorToast}
        />
      </Route>
      <Route path="/checkout">
        <div>Thanks for your purchase!</div>
      </Route>
    </BrowserRouter>
  );
}
