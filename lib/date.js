export const formatMyDate = (date) => {
  if (!date) {
    console.error("Invalid date input:", date);
    return "Invalid Date";
  }

  const parsedDate = new Date(date);
  
  if (isNaN(parsedDate.getTime())) {
    console.error("Invalid Date format:", date);
    return "Invalid Date";
  }

  let options = {
    year: "numeric",
    month: "short",
    day: "numeric",
  };

  return new Intl.DateTimeFormat("en-US", options).format(parsedDate);
};


export const formatDuration = (duration) => {
  if (!duration) return null;

  var hour = Math.floor(duration / 3600);
  var min = Math.floor(duration % 3600 / 60);
  var sec = Math.floor(duration % 3600 % 60);

  const durationString = `${hour}:${min}:${sec}`;
  return durationString; 
  
}