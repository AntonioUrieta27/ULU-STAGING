import React from "react";
import "./index.sass";

//Components
import BackButton from "../../components/_elements/BackButton";

const index = () => {
  return (
    <div id="error404">
      <BackButton />
      <div className="salve-logo">
        <div className="sad-face"></div>
      </div>
      <div className="title">Page not found</div>
    </div>
  );
};

export default index;
