import React, { useState } from "react";
import "./App.css";
import { BrowserRouter, Route, Link } from "react-router-dom";

import PaymentScreen from "./screens/PaymentScreen";
import LandingScreen from "./screens/LandingScreen";
import ProgramsScreen from "./screens/ProgramsScreen";
import ProgramScreen from "./screens/ProgramScreen";

export default function App() {
  const [account, setAccount] = useState();
  return (
    <BrowserRouter>
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
