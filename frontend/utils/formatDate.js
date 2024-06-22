// Function to format date from mm/dd/yyyy to yyyy-mm-dd
export const formatDate = (inputDate) => {
  const parts = inputDate.split("/");
  if (parts.length === 3) {
    const [month, day, year] = parts;
    return `${year}-${month}-${day}`;
  }
  return inputDate;
};
