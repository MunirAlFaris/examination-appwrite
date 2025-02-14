import React from "react";

export default function Loader() {
  return(
    <div className="d-flex justify-content-center align-items-center" style={{height: '90dvh'}}>
      <div className="spinner-border text-primary" style={{width: '100px', height: '100px'}} role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
    </div>
  )
}