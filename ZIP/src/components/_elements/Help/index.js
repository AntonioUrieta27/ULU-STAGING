import React from "react";
import "./index.sass";
import { FaQuestion } from "react-icons/fa";
import { motion } from "framer-motion";

//Utils
import { variants } from "./utils";

const index = () => {
  return (
    <a href="https://www.ulustory.com/resources" target="_blank">
      <motion.div
        // onClick={() => setHelpModal({ state: true })}
        className="help-button"
        variants={variants}
        initial="hidden"
        animate="visible"
      >
        <FaQuestion />
      </motion.div>
    </a>
  );
};

export default index;
