import React from "react";
import { motion } from "framer-motion";

const variants = {
  hidden: { opacity: 0, backdropFilter: "0px" },
  visible: { opacity: 1, backdropFilter: "10px" },
  exit: { opacity: 0, backdropFilter: "0px" },
};

const ClientInfo = () => {
  return (
    <div className="info">
      <motion.div
        variants={variants}
        initial="hidden"
        animate="visible"
        exit="exit"
        transition={{ duration: 0.4, when: "beforeChildren" }}
        className="wrapper"
      >
        <img className="logo" src="assets/logo2.svg" alt="" />
      </motion.div>
    </div>
  );
};

export default ClientInfo;
