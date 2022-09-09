import React, { useState, useEffect } from "react";
import { Progress, Button, Input } from "@chakra-ui/react";
import { useToast } from "@chakra-ui/react";
import { AnimatePresence, motion } from "framer-motion";
import Swal from "sweetalert2";
import { FaQuestion } from "react-icons/fa";

//Components
import BackButton from "../../components/_elements/BackButton";
import Help from "../../components/_elements/Help";
import StoryItem from "./StoryItem";
import Recorder from "../../components/_utilities/Recorder";
//Modals
import StoryItemModal from "../../components/_modals/StoryItemModal";
import RecordAudioModal from "../../components/_modals/RecordAudioModal";
import { confirmModal } from "../../components/_modals/ConfirmModal";

import { calculateProgress, handleConfirm } from "./functions";
import { MdRecordVoiceOver, MdPlaylistAddCheck } from "react-icons/md";
import { useSelector, useDispatch } from "react-redux";
import {
  updateStoryProperty,
  deleteStory,
  getRecord,
} from "../../features/user/userSlice";
import { getAttributeOnObject } from "./functions";
import { Navigate } from "react-router";
import { BsFillTrashFill } from "react-icons/bs";
import { useNavigate } from "react-router-dom";

//Framer Motion Variants
const variantsContainer = {
  hidden: { y: "-50vh" },
  visible: {
    y: 0,
    transition: {
      delay: 0.4,
      ease: "easeInOut",
      duration: 0.4,
      when: "beforeChildren",
    },
  },
  exit: {
    y: "-50vh",
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
      duration: 0.4,
      when: "beforeChildren",
      staggerChildren: 0.25,
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
  covered: {
    opacity: 0,
    maxHeight: "100vh",
  },
};

const CreateStory = () => {
  const dispatch = useDispatch();
  const { story } = useSelector((state) => state.user);

  const toast = useToast();
  let navigate = useNavigate();
  const [title, setTitle] = useState("My New Story");
  // Modals

  
  const [recordAudioModal, setRecordAudioModal] = useState({
    state: false,
    story: null,
  });

  const story_structure = {
    items: [
      {
        id: 1,
        question: "1-Stasis",
        description:
          "Describe who you are at the beginning of the story. Include an aspect about yourself that will change by the end of the story.",
        answer: story.answers_zero,
      },
      {
        id: 2,
        question: "2-Trigger",
        description:
          "Describe a trigger event, which must be something that is out of your control. This event presents you with a dilemma. That is, it requires you to make a decision about what action, if any, to take.",
        answer: story.answers_first,
      },
      {
        id: 3,
        question: "3-Challenge",
        description:
          "Describe the options that you must choose between. Even include the options you might never take. Then identify the choice you made, and explain why.",
        answer: story.answers_second,
      },
      {
        id: 4,
        question: "4-Consequences",
        description:
          "Now detail the consequences, or results, of your choice, whether good or bad.",
        answer: story.answers_third,
      },
      {
        id: 5,
        question: "5-Resolution",
        description:
          "Describe who you are now and how the choices and consequences changed you. Provide a specific example of how your values, beliefs, or attitudes have changed as reflected in your actions.",
        answer: story.answers_fourth,
      },
    ],
  };

  const [progress, setProgress] = useState(0);
  const [storyItem, setStoryItem] = useState({ state: false, story: null });
  const [actualitem, setActualItem] = useState(null);

  //Calculate Progress
  useEffect(() => {
    calculateProgress(story_structure.items, setProgress);
    if (story.title != title) setTitle(story.title);
  }, [story, actualitem]);

  useEffect(() => {
    document.getElementById("");
  }, []);

  const goNextItem = (actual) => {
    if (actual == 5) return null;
    let nextItem = story_structure.items[actual];
    setActualItem(nextItem);
    actual++;
    return nextItem;
  };

  const updateStory = (key, value) => {
    dispatch(updateStoryProperty({ key: key, value: value }));
  };

  const onStoryConfirm = () => {
    if (handleConfirm(story)) {
      dispatch(updateStoryProperty({ key: "status", value: "1" }));
      navigate("/");
    } else {
      Swal.fire(
        "Error finishing story",
        "Please make sure every answer is complete",
        "error"
      );
    }
  };

  const handleDelete = () => {
    confirmModal({
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "No, keep it",
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire("Deleted!", "Your story has been deleted.", "success");
        dispatch(deleteStory(story.uid));
        navigate("/");
      }
    });
  };

  useEffect(() => {
    document.getElementById("title-input").focus();
  }, []);

  
  const listenAudio = async () => {
    const url = await dispatch(getRecord(story.uid));

    Swal.fire({
      title: `Audio for ${story.title}`,
      html: `<audio controls style="margin: 0 auto; display: block;"> <source src=${url.payload} type="audio/mpeg"></audio>`+
      ` <br>🎵 Download your audio here ☝ </br>`,
      showConfirmButton: true,
      showCloseButton: true,
    });

    
  };


  return (
    <motion.div
      variants={variants}
      initial="hidden"
      animate="visible"
      exit="exit"
      id="create-story"
      className={storyItem.state ? "no-scroll" : ""}
    >
      {/* Modals */}
      <AnimatePresence>
        {recordAudioModal.state && (
          <RecordAudioModal
            setRecordAudioModal={setRecordAudioModal}
            story={recordAudioModal.story}
          />
        )}
      </AnimatePresence>
      <Help />

      <AnimatePresence>
        {storyItem.state === true && (
          <StoryItemModal
            setStoryItem={setStoryItem}
            story={storyItem.story}
            updateStory={updateStory}
            getAttributeOnObject={getAttributeOnObject}
            goNextItem={goNextItem}
          />
        )}
      </AnimatePresence>

      <div className="progress-bar">
        <Progress value={progress} />
      </div>
      <motion.div
        variants={variantsContainer}
        initial="hidden"
        animate="visible"
        exit="exit"
        className="header"
      >
        <BackButton />
      </motion.div>
      <div className="content">
        <div className="container">
          <div className="title">Create your story</div>
          <div className="subtitle">
            Hello Storyteller. In choosing your story, always consider these 3
            questions. What is your purpose in telling it? Who is your audience?
            And what dilemma or choice did you face?{" "}
            <div className="click">
              Click
              <Help />
              above for help.
            </div>
          </div>
          <div className="title-input">
            <div className="label">Write your title below:</div>
            <Input
              size="lg"
              fontSize="1.5em"
              id="title-input"
              height="3em"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onBlur={() => updateStory("title", title)}
            />
          </div>
          <div className="items">
            {story_structure.items.map((item, i) => (
              <StoryItem setStoryItem={setStoryItem} data={item} key={i} />
            ))}
          </div>
          <div className="buttons wrapper">
          <Button
                leftIcon={<MdRecordVoiceOver />}
                colorScheme="blackAlpha"
                mt="2em"
                size="lg"
                onClick={() =>
                  setRecordAudioModal({ state: true, story: story })
                }
              >
                Record audio
              </Button>
          </div>
          <div className="buttons">
            <div className="wrapper">
              <button onClick={() => handleDelete()} id="delete-button">
                <BsFillTrashFill />
              </button>
              <Button
                leftIcon={<MdRecordVoiceOver />}
                colorScheme="blackAlpha"
                mt="2em"
                size="lg"
                onClick={() =>
                  listenAudio()
                }
              >
                Listen/Download audio
              </Button>
            </div>
            <Button
              onClick={() => onStoryConfirm()}
              leftIcon={<MdPlaylistAddCheck />}
              mt="2em"
              size="lg"
            >
              Save as complete
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default CreateStory;
