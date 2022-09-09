import React, { useState, useEffect } from "react";
import "./index.sass";
import MicRecorder from "mic-recorder-to-mp3";
import { confirmModal } from "../../_modals/ConfirmModal";
import { useSelector, useDispatch } from "react-redux";
import { uploadRecord } from "../../../features/user/userSlice";
import { useToast } from "@chakra-ui/react";

//Icons
import {
  BsFillTrashFill,
  BsFillStopFill,
  BsFillPauseFill,
  BsFillCircleFill,
} from "react-icons/bs";

const recorder = new MicRecorder({
  bitRate: 128,
});

const Index = ({ handleClose }) => {
  const dispatch = useDispatch();
  const { story } = useSelector((state) => state.user);

  const [presave, setPresave] = useState("");
  const [appblob, setAppBlob] = useState({ status: false, myappblob: null });

  const { status, myappblob } = appblob;

  useEffect(() => {}, [status]);

  const startRecord = () => {
    document.querySelector("#stop").classList.add("active");
    document.querySelector("#recording").classList.add("visible");

    recorder
      .start()
      .then(() => {
        console.log("recording");
      })
      .catch((e) => console.log(e));
  };

  const stopRecord = () => {
    document.querySelector("#stop").classList.remove("active");
    document.querySelector("#recording").classList.remove("visible");

    recorder
      .stop()
      .getMp3()
      .then(([buffer, blob]) => {
        let url = window.URL.createObjectURL(blob);
        setPresave(url);
        setAppBlob({
          status: true,
          myappblob: blob,
        });

        //dispatch(uploadRecord(blob))        
      })
      .catch((e) => console.log(e));
  };

  const clear = () => {
    confirmModal({
      confirmButtonText: "Delete",
      cancelButtonText: "Keep",
    }).then((res) => {
      handleClose();
    });
    /*recorder.stop()
      .getMp3()
      .then(([buffer, blob]) => {
        buffer = null;
        blob = null;

        setAppBlob({
          status: false,
          blobl: null
        });
      })
      .catch(e => console.log(e))*/
  };

  // stop only mic
function stopAudioOnly(stream) {
  stream.getTracks().forEach(function(track) {
      if (track.readyState == 'live' && track.kind === 'audio') {
          track.stop();
      }
  });
}


  const toast = useToast();
  const saveAudio = () => {
    dispatch(uploadRecord(myappblob));//Aqui se guarda el audio en firebase
    //AQUI DEBE IR LA ALERTA DE QUE SE GUARDO CORRECTAMENTE
    
    toast({
      title: 'The audio was saved',
      position: 'top-right',
      status: 'success',
      duration: 2000,
      isClosable: true,
    });
    console.log(myappblob);
    handleClose();
    stopAudioOnly();
  };

  const downloadAudio = () => {
    let a = document.createElement("a");
    document.body.appendChild(a);
    a.style = "display: none";
    let url = presave;

    a.href = url;
    a.download = `${story.title}.mp3`;
    a.click();
  };

  return (
    <div className="recorder">
      <audio className="audio" src={presave} type="audio/mp3" controls></audio>
      <div id="recording">
        <div id="recording-text" className="text">
          <BsFillCircleFill /> Recording
        </div>
        <div className="text">
          Press <BsFillStopFill /> to stop recording
        </div>
      </div>
      <div className="buttons">
        <button id="start" onClick={startRecord}>
          <BsFillCircleFill />
        </button>
        <button id="stop" onClick={stopRecord}>
          <BsFillStopFill />
        </button>
        <button onClick={clear}>
          <BsFillTrashFill />
        </button>

        {status && (
          <>
            <button onClick={saveAudio}>Save</button>
            <button onClick={downloadAudio}>Download</button>
          </>
        )}
      </div>
    </div>
  );
};

export default Index;
