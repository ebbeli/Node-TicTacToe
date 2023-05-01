import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter } from "react-router-dom";
import "./css/index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);

reportWebVitals();

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
/*

import { internalIpV4 } from "internal-ip";

async function getIp() {
  let ip = await internalIpV4();
  console.log(ip);
  if (!ip || ip == "" || ip == "0.0.0.0") {
    ip = "localhost";
  }
  return ip;
}
export const toReturn = "http://" + (await getIp()) + ":5000";*/
