import React, { useState } from "react";
import ReactDOM from "react-dom/client";
import StarRaiting from "./StarRaiting";
// import "./index.css";
// import App from "./App";

function Test() {
  const [raitingTest, setRaitingTest] = useState(0);

  return (
    <>
      <StarRaiting
        maxRaiting={11}
        color="green"
        size={48}
        initialRaiting={0}
        onSetRaitingTest={setRaitingTest}
      />
      <p>{`This movie was rated ${raitingTest} stars`}</p>
    </>
  );
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <StarRaiting
      maxRaiting={5}
      color="#ffff00"
      size={48}
      messages={["Very bad!", "Bad!", "Okay!", "Good!", "Amazing"]}
      initialRaiting={1}
    />
    <StarRaiting maxRaiting={5} color="red" size={48} />
    <StarRaiting maxRaiting={7} color="blue" size={48} />
    <Test />
    {/* <App /> */}
  </React.StrictMode>
);
