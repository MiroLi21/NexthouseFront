export const formatDateTime = (dateString: any) => {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  return `${year}-${month}-${day} ${hours}:${minutes}`;
};
function convertTo12HourFormat(dateTime: string | any): string {
  if (dateTime == "" || dateTime == undefined) return "";
  const date = new Date(dateTime);

  const year: string = String(date.getFullYear());
  const month: string = String(date.getMonth() + 1).padStart(2, "0"); // Months are 0-indexed
  const day: string = String(date.getDate()).padStart(2, "0");

  let hours: string | number = date.getHours();
  const minutes: string = String(date.getMinutes()).padStart(2, "0");
  const seconds: string = String(date.getSeconds()).padStart(2, "0");
  const ampm: string = hours >= 12 ? "PM" : "AM";

  // Convert to 12-hour format
  hours = hours % 12;
  hours = hours ? String(hours).padStart(2, "0") : "12"; // the hour '0' should be '12'

  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds} ${ampm}`;
}
export { convertTo12HourFormat };
export function GetCurrentDateTime() {
  const now = new Date();

  // Get year, month, day, hours, and minutes
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0"); // Months are zero-indexed
  const day = String(now.getDate()).padStart(2, "0");
  const hours = String(now.getHours()).padStart(2, "0");
  const minutes = String(now.getMinutes()).padStart(2, "0");

  // Format the date and time in "YYYY-MM-DDTHH:MM" format
  const formattedDateTime = `${year}-${month}-${day}T${hours}:${minutes}`;
  return formattedDateTime;
}

/**
 * Converts FormData to a plain JavaScript object
 * @param formData The FormData instance to convert
 * @returns A plain object with the form data entries
 */
export const formDataToObject = (formData: FormData): Record<string, any> => {
  const object: Record<string, any> = {};
  formData.forEach((value, key) => {
    // Handle case where key already exists (for multiple values)
    if (object.hasOwnProperty(key)) {
      if (!Array.isArray(object[key])) {
        object[key] = [object[key]];
      }
      object[key].push(value);
    } else {
      object[key] = value;
    }
  });
  return object;
};
export function formatNumberClean(num: number | string): string {
  const n = typeof num === "string" ? parseFloat(num.replace(/,/g, "")) : num;

  // Check if it has a fractional part
  if (n % 1 === 0) {
    // It's an integer, format with commas without decimals
    return n.toLocaleString("en-US", { maximumFractionDigits: 0 });
  } else {
    // Has fraction, format with up to 2 decimal places
    return n.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  }
}
// export const formatNumberCleanWithComma = (number: number) => {
//   return number.toLocaleString("en-US", {
//     minimumFractionDigits: 2,
//     maximumFractionDigits: 2,
//     useGrouping: true,
//   });
// };
export const formattedCountToK = (count: number) => {
  if (count == undefined || count == null || count == 0) return "0";
  if (count >= 1000) {
    return (count / 1000).toFixed(1) + "k";
  }
  return count.toString();
};

/**
 * Get current date/time formatted for Asia/Baghdad timezone
 * @param includeTime - If true, returns datetime format, if false returns date only (YYYY-MM-DD)
 * @param forInput - If true, returns format for datetime-local input (YYYY-MM-DDTHH:mm), otherwise returns standard format (YYYY-MM-DD HH:mm:ss)
 * @returns Formatted date string in Asia/Baghdad timezone
 */
export const getBaghdadDateTime = (
  includeTime: boolean = true,
  forInput: boolean = false
): string => {
  const now = new Date();

  // Convert to Asia/Baghdad timezone
  const baghdadTime = new Date(
    now.toLocaleString("en-US", { timeZone: "Asia/Baghdad" })
  );

  const year = baghdadTime.getFullYear();
  const month = String(baghdadTime.getMonth() + 1).padStart(2, "0");
  const day = String(baghdadTime.getDate()).padStart(2, "0");

  if (!includeTime) {
    return `${year}-${month}-${day}`;
  }

  const hours = String(baghdadTime.getHours()).padStart(2, "0");
  const minutes = String(baghdadTime.getMinutes()).padStart(2, "0");
  const seconds = String(baghdadTime.getSeconds()).padStart(2, "0");

  // For datetime-local inputs, use ISO format without seconds
  if (forInput) {
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  }

  // For storage/display, use space separator with seconds
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
};

/**
 * Convert datetime string from storage format to input format
 * @param datetime - DateTime string in format "YYYY-MM-DD HH:mm:ss"
 * @returns DateTime string in format "YYYY-MM-DDTHH:mm" for datetime-local inputs
 */
export const toInputFormat = (datetime: string): string => {
  if (!datetime) return "";
  // Remove seconds and replace space with T
  return datetime.substring(0, 16).replace(" ", "T");
};

/**
 * Convert datetime string from input format to storage format
 * @param datetime - DateTime string in format "YYYY-MM-DDTHH:mm"
 * @returns DateTime string in format "YYYY-MM-DD HH:mm:ss"
 */
export const toStorageFormat = (datetime: string): string => {
  if (!datetime) return "";
  // Replace T with space and add seconds
  return datetime.replace("T", " ") + ":00";
};
