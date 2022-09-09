import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  IconButton,
} from "@chakra-ui/react";
import {
  BsThreeDotsVertical,
  BsFillTrashFill,
  BsLink45Deg,
  BsFillPencilFill,
} from "react-icons/bs";
import { FaFileWord, FaEye, FaRegEnvelope } from "react-icons/fa";
import { AiFillSound } from "react-icons/ai";
import { useToast } from "@chakra-ui/react";
import { useSelector, useDispatch } from "react-redux";
import { selectStory, deleteStory } from "../../../features/user/userSlice";
import Swal from "sweetalert2";
import { confirmModal } from "../../../components/_modals/ConfirmModal";

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

const Story = ({ story, i }) => {
  const dispatch = useDispatch();
  let navigate = useNavigate();

  const onStorySelected = () => {
    dispatch(selectStory(story));
    navigate("/create-story");
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

  return (
    <motion.div
      variants={variants}
      initial="hidden"
      animate="visible"
      custom={i}
      exit="exit"
      className="story available"
    >
      <div className="story-info">
        <div className="title">{story.title}</div>
        <div className="description">{story.description}</div>
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
          <MenuItem icon={<BsFillPencilFill />} onClick={() => onStorySelected()}>
              Edit story
            </MenuItem>
            <MenuItem icon={<BsFillTrashFill />} onClick={() => handleDelete()}>
              Delete story
            </MenuItem>
            
            
          </MenuList>
        </Menu>
      </div>
    </motion.div>
  );
};

export default Story;
