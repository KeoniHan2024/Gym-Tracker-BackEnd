export function convertDate(date:string) {
    return new Date(date).toISOString().split('T')[0];
}

export function formatDate(dateString: string): string {
  // Handle null or empty input
  if (!dateString) {
    return ""; // Or throw an error:  throw new Error("Date string is invalid");
  }

  let month: string;
  let day: string;
  let year: string;

  // Split the date string by '/'
  const dateParts = dateString.split("/");

  if (dateParts.length !== 3) {
      return ""; // Or throw error
  }
  month = dateParts[0];
  day = dateParts[1];
  year = dateParts[2];


  // Handle 2-digit year
  if (year.length === 2) {
    year = "20" + year; // Assume 21st century
  }
    // Pad month and day with leading zero if necessary
    month = month.padStart(2, '0');
    day = day.padStart(2, '0');
  return `${year}-${month}-${day} 00:00:00`;
}