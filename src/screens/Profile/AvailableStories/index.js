import React from "react";
import { Divider } from "@chakra-ui/react";
import Story from "../AvailableStories/Story";
import "./index.sass";
import { AnimatePresence, motion } from "framer-motion";

const variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { ease: "easeInOut", delay: 0.6, when: "beforeChildren" },
  },
  exit: { opacity: 0 },
};

const AvailableStories = ({ stories }) => {
  return (
    <motion.section
      variants={variants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="stories-available"
    >
      <div className="title">Drafts</div>
      <AnimatePresence>
        {stories.map((story) => (
          <Story story={story} key={story.uid} />
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

export default AvailableStories;
