import React, { useState, useEffect } from "react";
import { useParams } from "react-router";
import { useSelector, useDispatch } from "react-redux";
import { getPublicStory, getRecord, updateUserNotification, updateStoryComments } from "../../features/user/userSlice";
import { createDoc } from "../Profile/Document/DocxGenerator";
import { Button } from "@chakra-ui/react";
import "./index.sass";
import Swal from "sweetalert2";
import { FaFileWord, FaEye, FaRegEnvelope, FaRegComment } from "react-icons/fa";
import Spinner from "../../components/_elements/Spinner";
import {
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
} from "@chakra-ui/react";

const Index = () => {
  const dispatch = useDispatch();
  const { story, user_error, loading, } = useSelector((state) => state.user);
  const { user } = useSelector((state) => state.auth);
  const [query, setQuery] = useState(null);
  const { uid } = useParams();
  const fetchStory = async () => {
    if (uid && query != uid) setQuery(uid);

    await dispatch(getPublicStory(query));
  };

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

  

  // useEffect(() => {
  //   if(newStory?.comments){
  //     setnewStory({...newStory, comments: [...newStory.comments, commentobject]})
  //   }else{
  //     setnewStory({...newStory, comments: [...newStory.comments, commentobject]})
  //   }
  //   setarrayComments(story?.comments);
  //   console.log(newStory)
  // }, [story]);
  
  const handleCreateComment = async () => {
    //Request First & Last Name
    const { value:textcomment  } = await Swal.fire({
      title: "Add a comment",
      input: 'textarea',
      inputPlaceholder: 'Type your comment here...',
      inputAttributes: {
        'aria-label': 'Type your message here'
      },
      showCancelButton: true,
      confirmButtonText: 'Send',
    });

    if (!textcomment ) return;
    console.log(textcomment)
    console.log("antes de iterar en el comments",story)

 



    //Request to NewComment

    if (textcomment) {
      // @Guido creates user
      dispatch(
        updateStoryComments({
         comment: { name: user.name + " " + user.lastname, comment: textcomment, date: new Date().toLocaleDateString() },
        })
      );
      const notification = {
        title: story.title,
        body: `${user.name} ${user.lastname} commented on your story`,
        Link: `/public/${story.uid}`,
      }
      const uidCreator=story.creator.uid
      console.log(uidCreator, "uidCreator")
      console.log(notification, "notification");
      dispatch(updateUserNotification({
        uid: uidCreator,
        notification: notification,
      }));
      if (!user_error) {
        Swal.fire(
          `Add comment ${textcomment}`,
          "success"
        );
      } else {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Something went wrong!",
        });
      }
    }
  };
  useEffect(() => {
    fetchStory();
    console.log("useEffect", story);
    console.log(user)
    console.log("useEffect", story);
  }, [query])
  return (
    <div id="public-story">
      <div className="header">
        <div className="container">
          {!user_error && <div className="title">{story.title}</div>}
          {story.creator && (
            <div className="author">
              {`${story.creator.name} ${story.creator.lastname} from ${story.creator.company}`}
              <span></span>
            </div>
          )}
        </div>
      </div>
      <div className="content">
        <div className="answers">
          <div className="container">
            {loading && <Spinner />}
            {user_error && !loading && (
              <Alert status="error">
                <AlertIcon />
                <AlertTitle mr={2}>Ups! Story not found.</AlertTitle>
                <AlertDescription>Please verify your link</AlertDescription>
              </Alert>
            )}
            {!user_error && (
              <div>
                <p>{story.answers_zero}</p>
                <p>{story.answers_first}</p>
                <p>{story.answers_second}</p>
                <p>{story.answers_third}</p>
                <p>{story.answers_fourth}</p>
                <p></p>

                <div>
                  {story.has_audio && (
                    <Button
                      size="lg"
                      backgroundColor="brand.900"
                      color="gray.100"
                      onClick={() => downloadAudio()}
                    >
                      Listen/Download Audio
                    </Button>
                  )}
                  <div
                  className="comment-container"
                  >
                    {story?.comments?.map((item, index) => (
                      item.name && item.date && item.comment && (
                      <div className="comment-item" key={index}>
                        <div className="comment-item-header">
                          <div className="comment-item-header-name">
                            {item.name}
                            <span></span>
                            <div className="comment-item-header-date">
                              {item.date}
                            </div>
                            </div>
                            </div>
                            <div className="comment-item-header-comment">
                              {item.comment}
                              <span></span>
                              </div>
                             
                              </div>
                      )
))}
</div>
                  {/* {story?.creator?.idManager === user?.uid && (
                    "Aqui van los components de comentarios" )
                  } */}
                   {!user?null:(story?.creator?.idManager === user?.uid) && (
                    <Button
                    leftIcon={<FaRegComment />}
                    size="lg"
                    backgroundColor="brand.900"
                    color="gray.100"
                    onClick={() => handleCreateComment(story)}
                  >
                    Add Comment
                  </Button>)
                  }
                      
                  <Button
                    leftIcon={<FaFileWord />}
                    size="lg"
                    backgroundColor="brand.900"
                    color="gray.100"
                    onClick={() => createDoc(story)}
                  >
                    Download Doc
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
