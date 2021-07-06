import "./App.css";
import { BrowserRouter, Route } from "react-router-dom";

import Day from "./ProgramDay";

function App() {
  return (
    <BrowserRouter>
      <Route path="/program/basic/:day">
        <Day />
      </Route>
    </BrowserRouter>
  );
}

export default App;
