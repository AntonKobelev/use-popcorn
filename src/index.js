import React from "react";
import ReactDOM from "react-dom/client";
import StarRaiting from "./StarRaiting";
// import "./index.css";
// import App from "./App";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <StarRaiting maxRaiting={5} />
    {/* <App /> */}
  </React.StrictMode>
);
