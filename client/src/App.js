import "./App.css";
import { BrowserRouter, Route } from "react-router-dom";

import PaymentScreen from "./screens/PaymentScreen";

export default function App() {
  return (
    <BrowserRouter>
      <Route path="/" exact>
        <a href="/payment">Buy something</a>
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
