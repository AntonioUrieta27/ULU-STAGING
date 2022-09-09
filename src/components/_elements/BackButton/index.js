import React from "react";
import { useNavigate } from "react-router-dom";
import "./index.sass";

//Icons
import { IoChevronBackSharp } from "react-icons/io5";

const BackButton = ({ callback }) => {
  let navigate = useNavigate();

  return (
    <div
      id="back-button"
      onClick={() => (callback ? callback() : navigate(-1))}
    >
      <IoChevronBackSharp /> Go Back
    </div>
  );
};

export default BackButton;
