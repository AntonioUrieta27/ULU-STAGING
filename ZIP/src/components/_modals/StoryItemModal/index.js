import React, { useEffect, useState } from "react";
import "./index.sass";
import { motion } from "framer-motion";
//Components
import BackButton from "../../_elements/BackButton";
import { Textarea, Divider, Button, useToast } from "@chakra-ui/react";
import { useTimer } from 'react-timer-hook';
import { useStopwatch } from 'react-timer-hook';

//Framer Motion Variants
const variantsContainer = {
  hidden: { y: "-100vh" },
  visible: {
    y: 0,
    transition: {
      ease: "easeInOut",
      duration: 0.4,
      when: "beforeChildren",
    },
  },
  exit: {
    y: "-100vh",
    transition: {
      ease: "easeOut",
      duration: 0.4,
      when: "afterChildren",
    },
  },
};

const variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      ease: "easeInOut",
      delay: 0.4,
      duration: 0.4,
      when: "beforeChildren",
      staggerChildren: 0.5,
    },
  },
  exit: {
    opacity: 0,
    transition: {
      ease: "easeOut",
      duration: 0.4,
      when: "afterChildren",
    },
  },
};

const StoryItemModal = ({
  story,
  setStoryItem,
  updateStory,
  getAttributeOnObject,
  goNextItem,
}) => {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const toast = useToast();

  const handleClose = () => {
    setStoryItem({ state: false, story: story });
  };

  const handleContinue = () => {
    const attribute = getAttributeOnObject(story.id - 1);

    updateStory(attribute, answer);
    const newActualItem = goNextItem(story.id);

    if (!newActualItem) {
      handleClose();
      return;
    }

    setAnswer("");
    setQuestion(newActualItem.question);

    setStoryItem({ state: true, story: newActualItem });
  };

  useEffect(() => {
    if (story.answer !== "") {
      setAnswer(story.answer);
    }
  }, [story, question]);

  const {
    seconds,
    minutes,
    hours,
    days,
    isRunning,
    start,
    pause,
    reset,
  } = useStopwatch({ autoStart: true });

  useEffect(() => {
    
    console.log('Entrando ');
    if(minutes == 5){

      toast({
        title: 'Autosaved',
        position: 'top-right',
        status: 'success',
        duration: 2000,
        isClosable: true,
      });
      console.log('Guardado');
      const attribute = getAttributeOnObject(story.id - 1);

      updateStory(attribute, answer);

      reset();

    }

  }, [minutes])
  
  
  return (
    <motion.div
      variants={variantsContainer}
      initial="hidden"
      animate="visible"
      exit="exit"
      id="story-item-modal"
      className="modal"
    >
      <motion.div
        variants={variants}
        initial="hidden"
        animate="visible"
        exit="exit"
        className="container"
      >
        <BackButton callback={handleClose} />
        <div className="answer">{story.question}</div>
        <div className="description">{story.description}</div>
        {/* <Divider /> */}
        <Textarea
          onChange={(e) => setAnswer(e.target.value)}
          value={answer}
          placeholder="Write your story here"
          minHeight="10em"
          fontSize="1.2em"
        />
        <div id="continue-button">
          <Button
            mt="2em"
            size="lg"
            color="white"
            bgColor="grey"
            maxWidth="20em"
            width="100%"
            onClick={() => handleContinue()}
          >
            Continue
          </Button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default StoryItemModal;
