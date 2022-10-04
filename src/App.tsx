import React from "react";

import { PlaceOrder } from "./PlaceOrder";

import "./App.scss";

export default function App() {
  return (
    <div className={"app"}>
      <div className={"form"}>
        <PlaceOrder />
      </div>
    </div>
  );
}
