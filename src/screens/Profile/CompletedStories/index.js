import React, { useState } from "react";
import { Divider } from "@chakra-ui/react";
import { AnimatePresence, motion } from "framer-motion";
import Story from "./Story";

const variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { ease: "easeInOut", delay: 0.6, when: "beforeChildren" },
  },
  exit: { opacity: 0 },
};

const index = ({ stories, setViewStoryModal }) => {
  return (
    <motion.section
      variants={variants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="stories-completed"
    >
      <div className="title">Completed Stories</div>
      <AnimatePresence>
        {stories.map((story, i) => (
          <Story
            setViewStoryModal={setViewStoryModal}
            story={story}
            key={story.uid}
            i={i}
          />
        ))}
        {stories.length === 0 && (
          <motion.div variants={variants} className="empty">
            No stories yet
          </motion.div>
        )}
      </AnimatePresence>
    </motion.section>
  );
};

export default index;
