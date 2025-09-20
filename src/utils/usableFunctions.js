export const capitalizeWords = (str)=>{
  if(typeof str !== 'string') return str;
  if (!str) return "";
  return str
    .split(/[- ]+/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}
export const formatDateToDDMMYYYY = (dateString)=>{
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are zero-based
  const year = date.getFullYear();

  return `${day}-${month}-${year}`;
}

export const formatDateToYYYYMMDD = (dateString)=>{
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are zero-based
  const year = date.getFullYear();

  return `${year}-${month}-${day}`;
}

export function formatIfDate(str) {
  const regex = /^\d{4}-\d{2}-\d{2}$/;
  if (!regex.test(str)) return str;

  const date = new Date(str);
  if (isNaN(date)) return str;

  const options = { day: 'numeric', month: 'short', year: 'numeric' };
  return date.toLocaleDateString('en-GB', options);
}