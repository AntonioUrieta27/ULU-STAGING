import React, { useState, useEffect } from 'react';
import './index.sass';
import { Button, useTabs, useToast } from '@chakra-ui/react';
import { useSelector, useDispatch } from 'react-redux';
import { AnimatePresence, motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  fetchUserStories,
  selectStory,
  updateStory,
  createStory,
  updateStoryProperty,
  clearUserNotification,
  deleteStory,
} from '../../features/user/userSlice';
import { user } from '../../features/auth/authSlice';

//Modals
import ViewStoryModal from '../../components/_modals/ViewStoryModal';

//Components
import AvailableStories from './AvailableStories';
import CompletedStories from './CompletedStories';
import UserOptions from './UserOptions';
import LoadingComponent from '../../components/LoadingComponent/LoadingComponent';
import Swal from 'sweetalert2';


const variantsContainer = {
  hidden: { y: '-50vh' },
  visible: {
    y: 0,
    transition: {
      delay: 0.6,
      ease: 'easeInOut',
      duration: 0.4,
      when: 'beforeChildren',
    },
  },
  exit: {
    y: '-50vh',
    transition: {
      ease: 'easeOut',
      duration: 0.4,
      when: 'afterChildren',
    },
  },
};

const variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      ease: 'easeInOut',
      delay: 0.4,
      duration: 0.4,
      when: 'beforeChildren',
      staggerChildren: 0.5,
    },
  },
  exit: {
    opacity: 0,
    transition: {
      ease: 'easeOut',
      duration: 0.2,
      when: 'afterChildren',
    },
  },
};

const Profile = () => {
  const [viewStoryModal, setViewStoryModal] = useState({
    state: false,
    story: null,
  });
  const [recordAudioModal, setRecordAudioModal] = useState({
    state: false,
    story: null,
  });
  const toast = useToast();
  const dispatch = useDispatch();
  const history = useNavigate();

  const { user } = useSelector((state) => state.auth);
  const { complete_stories, incomplete_stories, story } = useSelector((state) => state.user);

  useEffect(() => {
    const fetchStories = () => {
      dispatch(fetchUserStories(user.uid));
    };

    fetchStories();
  }, [complete_stories, incomplete_stories]);

const displayFunctions = async() =>{

  console.log( user.notifications)
  const arraynotification = user.notifications?.map((notification) => {
  
return `${notification?.body} in <a href="${notification?.Link}" target="_blank"><u>${notification?.title}</u></a>`
  });
const responseswal = await Swal.fire({
    title: '<strong>New <u>Notifications</u></strong>',
    icon: 'info',
    html: arraynotification.join('<br/>'),
    showCloseButton: true,
    focusConfirm: false,
    confirmButtonText:
      '<i class="fa fa-thumbs-up"></i> Great!',
  }).then((result) => {
   
      Swal.fire(
        'Clear Notifications.',
        '',
        'success'
      ).finally(() => {
        dispatch(clearUserNotification({uid:user.uid}));
      })
    
  
  })
}

  useEffect( () => {
    if(user?.notifications && user?.notifications.length > 0){
      displayFunctions()
    
    }
 
  }, [])
  
  const updateStoryCall = () => {
    //story.status = 1;
    dispatch(updateStoryProperty({ key: 'title', value: 'Actualizando status' }));
    dispatch(updateStoryProperty({ key: 'status', value: '1' }));
    dispatch(updateStory());
  };

  const createStoryCall = () => {
    dispatch(createStory('My New Story'));
    toast({
      title: 'Created new story successfully',
      position: 'top-right',
      status: 'success',
      duration: 2000,
      isClosable: true,
    });
    history('/create-story');
  };

  const deleteStoryCall = () => {
    dispatch(deleteStory('cccc'));
  };

  const [loading, setLoading] = useState(true);

  
    setTimeout(()=>{
      setLoading(false);
    }, 1500)
  

  if(loading){
    return(
      <LoadingComponent />
    )
  }
  else{
  return (
    <motion.div variants={variants} initial="hidden" animate="visible" id="profile">
      {/* Modals */}
      {/* View Story Modal */}
      <AnimatePresence>
        {viewStoryModal.state && (
          <ViewStoryModal setViewStoryModal={setViewStoryModal} story={viewStoryModal.story} />
        )}
      </AnimatePresence>

      <div id="create-story-button-mb">
        <Button bgColor="gray.900" color="gray.100" size="lg" onClick={() => createStoryCall()}>
          Create Story
        </Button>
      </div>

      <motion.div
        variants={variantsContainer}
        initial="hidden"
        animate="visible"
        exit="exit"
        className="header"
      >
        <UserOptions />
        <div className="container">
          <div className="title">
            Hello <span>{`${user.name} ${user.lastname}`}</span>!
          </div>
          <div id="create-story-button">
            <Button bgColor="gray.900" color="gray.100" size="lg" onClick={() => createStoryCall()}>
              Create Story
            </Button>
          </div>
        </div>
      </motion.div>
      <motion.div
        variants={variants}
        initial="hidden"
        animate="visible"
        exit="exit"
        className="content"
      >
        <motion.div variants={variants} className="container">
          <AvailableStories stories={incomplete_stories} />
          <CompletedStories setViewStoryModal={setViewStoryModal} stories={complete_stories} />
        </motion.div>
      </motion.div>
      {/* <Recorder /> */}
    </motion.div>
  );
};
};

export default Profile;
