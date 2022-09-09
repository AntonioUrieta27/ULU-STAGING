import React, { useState, useEffect } from "react";
import ClickAwayListener from "react-click-away-listener";
import "./index.sass";
import { motion } from "framer-motion";
import Recorder from "../../_utilities/Recorder";

//Framer Motion Variants
const variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      ease: "easeInOut",
      duration: 0.2,
      when: "beforeChildren",
      staggerChildren: 0.5,
    },
  },
  exit: {
    opacity: 0,
    transition: {
      ease: "easeOut",
      duration: 0.2,
      when: "afterChildren",
    },
  },
};
const Index = ({ story, setRecordAudioModal }) => {
  const [canrecord, setCanRecord] = useState(true);

  const verifyUserAudio = async () => {
    try {
      await navigator.mediaDevices.getUserMedia({ audio: true });
      setCanRecord(true);
    } catch (error) {
      setCanRecord(false);
    }
  };

  useEffect(() => {
    verifyUserAudio();
  }, []);

  const handleClose = () => {
    setRecordAudioModal({ state: false, story: story });
  };

  return (
    <motion.div
      variants={variants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="modal"
      id="record-audio-modal"
    >
      <ClickAwayListener onClickAway={() => handleClose()}>
        <div className="card">
          {canrecord ? <Recorder handleClose={handleClose}/> : <p>Ups! you cannot record.</p>}
        </div>
      </ClickAwayListener>
    </motion.div>
  );
};

export default Index;
