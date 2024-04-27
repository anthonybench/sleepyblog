function getOrdinalSuffix(day: number) {
  const unitsDigit = day % 10;
  if (unitsDigit === 1 && day !== 11) {
    return "st";
  } else if (unitsDigit === 2 && day !== 12) {
    return "nd";
  } else if (unitsDigit === 3 && day !== 13) {
    return "rd";
  } else {
    return "th";
  }
}

export function dateFormatterAlt(dateString: string) {
  // Split the date string into year, month, and day components
  const [yearString, monthString, dayString] = dateString.split("-");

  // Convert year, month, and day to numbers
  const year = parseInt(yearString, 10);
  const month = parseInt(monthString, 10) - 1; // Months are 0-indexed in JavaScript
  const day = parseInt(dayString, 10);

  // Create a Date object from the components
  const date = new Date(year, month, day);

  // Use the original dateFormatter logic with the Date object
  const monthName = date.toLocaleString("default", { month: "long" });
  const dayWithSuffix = `${day}${getOrdinalSuffix(day)}`;
  return `${monthName} ${dayWithSuffix}, ${year}`;
}