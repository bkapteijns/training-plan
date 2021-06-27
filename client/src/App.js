import React, { useEffect, useState } from "react";
import "./App.css";
import { BrowserRouter, Route, Link } from "react-router-dom";

import PaymentScreen from "./screens/PaymentScreen";
import LandingScreen from "./screens/LandingScreen";
import ProgramsScreen from "./screens/ProgramsScreen";
import ProgramScreen from "./screens/ProgramScreen";

const usePersistentState = () => {
  const [state, setInternalState] = useState(() => window.history.state || {});
  const setState = (newState) => {
    window.history.replaceState({ ...state, ...newState }, document.title);
    setInternalState(newState);
  };
  return [state, setState];
};

export default function App() {
  const [account, setAccount] = usePersistentState();

  useEffect(() => console.log(account), [account]);

  return (
    <BrowserRouter>
      <div>{JSON.stringify(account)}</div>
      <Route path="/" exact>
        <Link to="/programs">Look at the different programs</Link>
      </Route>
      <Route path="/landing">
        <LandingScreen setAccount={setAccount} />
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
