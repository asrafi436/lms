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
