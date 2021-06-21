import React from "react";

const LengthControl = ({
  title,
  titleID,
  decID,
  incID,
  onClick,
  length,
  lengthID
}) => {
  return (
    <div className="length-control">
      <h3 id={titleID}>{title}</h3>

      {/*Decrement button*/}
      <button className="inc-dec-btn" id={decID} value="-" onClick={onClick}>
        <i className="fa fa-arrow-down"/>
      </button>

      {/*Show length amount*/}
      <div className="length-amount" id={lengthID}>
        {length}
      </div>

      {/*Increment button*/}
      <button className="inc-dec-btn" id={incID} value="+" onClick={onClick}>
        <i className="fa fa-arrow-up"/>
      </button>
    </div>
  );
};

export default LengthControl;
