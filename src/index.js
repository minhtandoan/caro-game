import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import reportWebVitals from "./reportWebVitals";
import Game from "./Game";

ReactDOM.render(
    <React.StrictMode>
      <Game/>
    </React.StrictMode>,
    document.getElementById("root")
);

reportWebVitals();
