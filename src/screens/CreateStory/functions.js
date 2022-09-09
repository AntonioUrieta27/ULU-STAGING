//Calculate Progress

export const calculateProgress = (items, setProgress) => {
  let answeredQuestions = 0;

  items.map((i) => {
    i.answer !== "" && answeredQuestions++;
  });

  let currentProgress = (answeredQuestions / 5) * 100;
  setProgress(currentProgress);
};

export const handleConfirm = (story) => {
  for(let key in story){
    if(story[key] === null || story[key] === '') return false;
  }
  return true;
};

export const handleRecordAudio = () => {
  console.log("Handle Record Audio for Story");
};

export const getAttributeOnObject = (id) => {
  if(id == 0) return 'answers_zero';
  if(id == 1) return 'answers_first';
  if(id == 2) return 'answers_second';
  if(id == 3) return 'answers_third';
  if(id == 4) return 'answers_fourth';
}