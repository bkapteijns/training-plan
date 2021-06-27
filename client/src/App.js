import React, { useState } from "react";
import "./App.css";
import { BrowserRouter, Route } from "react-router-dom";

import PaymentScreen from "./screens/PaymentScreen";
import LandingScreen from "./screens/LandingScreen";

export default function App() {
  const [account, setAccount] = useState();
  return (
    <BrowserRouter>
      <Route path="/" exact>
        <a href="/payment">Buy something</a>
      </Route>
      <Route path="/landing">
        <LandingScreen setAccount={setAccount} />
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
