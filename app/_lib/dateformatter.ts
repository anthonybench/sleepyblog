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

export function dateFormatter(date: Date) {
  const monthName = date.toLocaleString("default", { month: "long" });
  const day = date.getDate();
  const year = date.getFullYear();
  return `${monthName} ${day}${getOrdinalSuffix(day)}, ${year}`;
}
