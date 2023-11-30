import React from "react";
import Form from "./Form";
import Landing from "assets/Landing_Page.svg";

function index() {
  return (
    <div className="flex">
      <div className="w-1/2">
        <Form />
      </div>
      <div className="w-1/2">
        <img alt="Banner" src={Landing} />
      </div>
    </div>
  );
}

export default index;
