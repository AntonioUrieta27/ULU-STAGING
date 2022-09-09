import React, { useEffect, useState } from "react";
import "./index.sass";
import {
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  IconButton,
} from "@chakra-ui/react";
import { motion } from "framer-motion";
import { useSelector, useDispatch } from "react-redux";
import {
  getRecord,
  uploadDoc,
  selectStory,
  deleteStory,
} from "../../../features/user/userSlice";
import { createDoc } from "../Document/DocxGenerator";
import Swal from "sweetalert2";
//Components
import RecordAudioModal from "../../../components/_modals/RecordAudioModal";
import { confirmModal } from "../../../components/_modals/ConfirmModal";
import { useNavigate } from "react-router-dom";

//Icons
import {
  BsThreeDotsVertical,
  BsFillTrashFill,
  BsLink45Deg,
  BsFillPencilFill,
  BsFillStickiesFill,
} from "react-icons/bs";
import { FaFileWord, FaEye, FaRegEnvelope } from "react-icons/fa";
import { AiFillSound } from "react-icons/ai";
import { useToast } from "@chakra-ui/react";
import { database } from '../../../features/database/database';
import { db, auth, storage } from '../../../services/firebase';
import MicRecorder from "mic-recorder-to-mp3";


const variants = {
  hidden: { opacity: 0 },
  visible: (custom) => ({
    opacity: 1,
    transition: {
      ease: "easeInOut",
      delay: 1 + custom / 5,
    },
  }),
  exit: { opacity: 0 },
};

const Story = ({ story, setViewStoryModal, i }) => {
  const dispatch = useDispatch();
  const toast = useToast();
  const { user_error } = useSelector((state) => state.user);
  const [shareableLink, setShareableLink] = useState("");
  const [recordAudioModal, setRecordAudioModal] = useState({
    state: false,
    story: null,
  });

  let navigate = useNavigate();
  const onStorySelected = () => {
    dispatch(selectStory(story));
    navigate("/create-story");
  };

  const recorder = new MicRecorder({
    bitRate: 128,
  });

  const downloadAudio = async () => {
    const url = await dispatch(getRecord(story.uid));

    Swal.fire({
      title: `Audio for ${story.title}`,
      html: `<audio controls style="margin: 0 auto; display: block;"> <source src=${url.payload} type="audio/mpeg"></audio>`+
      ` <br>🎵 Download your audio here ☝ </br>`,
      showConfirmButton: true,
      showCloseButton: true,
    });

    
  };

  const downloadDoc = async () => {
    const toStorage = await createDoc(story);
    dispatch(uploadDoc(toStorage));
  };

  const handleDelete = () => {
    confirmModal({
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "No, keep it",
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire("Deleted!", "Your story has been deleted.", "success");
        dispatch(deleteStory(story.uid));
      }
    });
  };

  const handleCopyStory = () => {
    const story_copy = database.addStory({
      creator_id: auth.currentUser.uid,
      title: 'Copy of '+ story.title,//o action
      status: 0, //0 -> incompleto || 1 -> completo
      has_audio: false,
      answers_zero: story.answers_zero ,
      answers_first: story.answers_first,
      answers_second: story.answers_second,
      answers_third:  story.answers_third,
      answers_fourth: story.answers_fourth,
  });
    story = story_copy;
    window.location.reload(true);

   };

  const handleAudioEvent = (action) => {
    if (action == 'export') {
      downloadAudio();
    } else {
      setRecordAudioModal({ state: true, story: story });
    }
  };

  const handleEmail = async () => {
    let a = document.createElement("a");
    document.body.appendChild(a);
    a.style = "display: none";
    const format = `Hi! I just made a story with ULUstory, check it out here: ${"https://ulu-staging.vercel.app/public/" + story.uid}`;
    a.href = `mailto:?subject=read my story ${story.title}&body=${encodeURIComponent(format)}`;
    a.click();
  };

  const handleShareableLink = () => {
    document.getElementById(
      `story-link-${story.uid}`
    ).value = `https://ulu-staging.vercel.app/public/${story.uid}`;
    var copyText = document.getElementById(`story-link-${story.uid}`);
    copyText.select();
    copyText.setSelectionRange(0, 99999);
    document.execCommand("copy");
    console.log(copyText);
    toast({
      title: `Copied link to clipboard `,
      description: (
        <a
          style={{
            fontWeight: 600,
            display: "flex",
            alignItems: "center",
            marginTop: "1em",
          }}
          href={`https://ulu-app.herokuapp.com/public/${story.uid}`}
          target="_blank"
          rel="noref"
        >
          <BsLink45Deg style={{ marginRight: "0.25em" }} fontSize="1.5em" />
          Open link
        </a>
      ),
      position: "top-right",
      status: "success",
      duration: 9000,
      isClosable: true,
    });
  };



  return (
    <motion.div
      variants={variants}
      initial="hidden"
      animate="visible"
      custom={i}
      exit="exit"
      className="story"
    >
      <input
        id={`story-link-${story.uid}`}
        className="story-link"
        value={shareableLink}
        readOnly={true}
      />
      <div className="story-info">
        <div className="title">{story.title}</div>
        {/* <div className="description">{story.description}</div> */}
      </div>
      <div className="buttons">
        <Menu>
          <MenuButton
            as={IconButton}
            aria-label="Options"
            variant="transparent"
            icon={<BsThreeDotsVertical />}
            onClick={() => dispatch(selectStory(story))}
          />
          <MenuList>
            <MenuItem
              onClick={() => setViewStoryModal({ state: true, story: story })}
              icon={<FaEye />}
            >
              View story
            </MenuItem>
            <MenuItem icon={<BsFillTrashFill />} onClick={() => handleDelete()}>
              Delete story
            </MenuItem>
            <MenuItem icon={<BsFillPencilFill />} onClick={() => onStorySelected()}>
              Edit story
            </MenuItem>

            <MenuItem icon={<BsFillStickiesFill />} onClick={() => handleCopyStory()}>
              Copy story
            </MenuItem>

            <MenuItem icon={<FaFileWord />} onClick={() => downloadDoc()}>
              Download as .docx
            </MenuItem>
            { story.has_audio ?
              (
                <>
                  <MenuItem icon={<AiFillSound />} onClick={() => handleAudioEvent('export')}>
                    Listen/Download audio
                  </MenuItem>
                  <MenuItem icon={<AiFillSound />} onClick={() => handleAudioEvent('record')}>
                    Record audio
                  </MenuItem>
                </>
              ) : (
                <MenuItem icon={<AiFillSound />} onClick={() => handleAudioEvent('record')}>
                    Record audio
                </MenuItem>
              )

            }
            <MenuItem
              icon={<BsLink45Deg />}
              onClick={() => handleShareableLink()}
            >
              Copy shareable link
            </MenuItem>
            <MenuItem icon={<FaRegEnvelope />} onClick={() => handleEmail()}>
              Send via Email
            </MenuItem>
          </MenuList>
        </Menu>
      </div>
      {recordAudioModal.state && (
        <RecordAudioModal
          setRecordAudioModal={setRecordAudioModal}
          story={recordAudioModal.story}
        />
      )}
    </motion.div>
  );
};

export default Story;
