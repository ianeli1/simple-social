import { firestore } from "firebase";

export function formatDate(date: Date | firestore.Timestamp) {
  function dateToCorrectString(date: Date) {
    const dd = date.getDate();
    const mm = date.getMonth() + 1;
    const yyyy = date.getFullYear();

    return `${dd < 10 ? `0${dd}` : `${dd}`}/${
      mm < 10 ? `0${mm}` : `${mm}`
    }/${yyyy} ${date.getHours()}:${date.getMinutes()}`;
  }

  if (date instanceof Date) {
    return dateToCorrectString(date);
  } else if (date instanceof firestore.Timestamp) {
    return dateToCorrectString(date.toDate());
  } else {
    return "<Invalid date>";
  }
}
