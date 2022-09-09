import React, { useState } from 'react';

import AudioReactRecorder, { RecordState } from 'audio-react-recorder';

import { useSelector, useDispatch } from 'react-redux';
import { uploadRecord } from '../../../features/user/userSlice';

const Index = () => {

  const dispatch = useDispatch();

  const [record, setRecord] = useState({recordState: null});
  const [presave, setPresave] = useState('')  
  const {recordState} = record;

  const start = () => {
    setRecord({recordState: RecordState.START});
  }  

  const pause = () => {
    setRecord({recordState: RecordState.PAUSE});
  }  

  const stop = () => {
    setRecord({recordState: RecordState.STOP});
  }   

  const clear = () => {
    setRecord({recordState: RecordState.NONE});
  }   

  const upload = (data) => {
      console.log(data);
      let a = document.createElement("a");
      document.body.appendChild(a);
      a.style = "display: none";
      //let blob = data.getBlob('Mi-Grabacion'),
      let url = window.URL.createObjectURL(data.blob);        
      setPresave(url);        
      a.href = url;
      a.download = 'recordingName' + '-fwr-recording.wav';
      a.click() 
      dispatch(uploadRecord(data.blob));
      //window.URL.revokeObjectURL(data.url);
      //document.body.removeChild(a);
  }

  return ( 
      <div>
          <AudioReactRecorder state={recordState} onStop={upload} />
          <audio src={presave} type="audio/wav" controls></audio>
          <button onClick={start}>Start</button>
          <button onClick={stop}>Stop</button>
          <button onClick={pause}>Pause</button>
          <button onClick={clear}>Clear</button>
      </div>
  );
}
 
export default Index;