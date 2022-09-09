import React from "react";
import "./index.sass";

const SalveCopyright = () => {
  console.log("MADE BY SALVE AGENCY");
  return (
    <a
      id="salve-copyright"
      target="_blank"
      rel="noreferer"
      href="https://salve.agency"
    >
      <div className="tool-tip">
        Made with <span>❤</span> by Salvé Agency
      </div>
    </a>
  );
};

export default SalveCopyright;
