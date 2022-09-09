import React from "react";
import { FaCheck } from "react-icons/fa";
const index = ({ setStoryItem, data, updateStory, story }) => {
  return (
    <div
      onClick={() => setStoryItem({ state: true, story: data })}
      className={data.answer !== "" ? "story-item filled" : "story-item"}
    >
      <div className="indicator">
        <div className="indicator-bar"></div>
        <div id="indicator-circle">
          <div className="icon">
            <FaCheck />
          </div>
        </div>
        <div className="indicator-bar"></div>
      </div>
      <div className="item-content">
        <div className="wrapper">
          <div className="question">{data.question}</div>
          {data.answer !== "" && <div className="answer">{data.answer}</div>}
        </div>
      </div>
    </div>
  );
};

export default index;
