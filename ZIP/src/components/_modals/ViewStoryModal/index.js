import React from "react";
import ClickAwayListener from "react-click-away-listener";
import "./index.sass";
import { motion } from "framer-motion";
import { CloseButton } from "@chakra-ui/react";
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

const index = ({ story, setViewStoryModal }) => {
  const handleClose = () => {
    setViewStoryModal({ state: false, story: story });
  };
  return (
    <motion.div
      variants={variants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="modal"
      id="view-story-modal"
    >
      <ClickAwayListener onClickAway={() => handleClose()}>
        <div className="card">
          <CloseButton
            onClick={() => handleClose()}
            position="absolute"
            right="1em"
            top="1em"
          />

          <div className="label">Title</div>
          <div className="title">{story.title}</div>
          <div className="answers">
            <div className="answer">{story.answers_zero}</div>
            <div className="answer">{story.answers_first}</div>
            <div className="answer">{story.answers_second}</div>
            <div className="answer">{story.answers_third}</div>
            <div className="answer">{story.answers_fourth}</div>
          </div>
        </div>
      </ClickAwayListener>
    </motion.div>
  );
};

export default index;
