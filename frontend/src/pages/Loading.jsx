import React from "react";
import "./Loading.css";

export default function Loading() {
  return (
    <div className="loadingPage">
      <div className="spinnerContainer">
        <div className="spinner"></div>
        <div className="spinner"></div>
      </div>
    </div>
  );
}