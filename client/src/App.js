import React, { useEffect, useState } from "react";
import "./App.css";
import { BrowserRouter, Route, Link } from "react-router-dom";
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
import {
  removeEquipment,
  addEquipment,
  relogin,
  getPrograms,
  logout
} from "./functions";
import DayScreen from "./screens/DayScreen";

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
          (await relogin(
            reloginToken,
            setAccount,
            setReloginToken,
            setErrorToast
          ));

        !programs && (await getPrograms(setPrograms, setErrorToast));
      })(),
    [account, programs, reloginToken, setReloginToken]
  );

  return (
    <BrowserRouter>
      <Header
        loggedIn={account && account.token}
        logout={() => logout(setAccount, setReloginToken)}
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
      <Route path="/program/:program/:day">
        <DayScreen account={account} setErrorToast={setErrorToast} />
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
              return removeEquipment(e, account, setAccount, setErrorToast);
            return addEquipment(e, account, setAccount, setErrorToast);
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
