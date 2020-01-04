import { zipObj, head, tail } from "ramda";
import { left, right, either } from "./either";

/**
 * Either.
 *
 * Run either leftFunc or rightFunc depending on whether or not
 * e is an instance of Left or Right.
 */

// CSV Parsing Code
// ---------------------------------------------------------------------------------

/**
 * Split a row string into an array of fields.
 *
 * Note: Don't do this. Use a CSV parsing library
 * like Neat CSV instead.
 * https://github.com/sindresorhus/neat-csv
 */
function splitFields(row) {
  return row.replace(/"(.*)"/, "$1").split('","');
}

/**
 * Zip Row data with header fields to create an object.
 */
function zipRow(headerFields) {
  return function zipRowWithHeaderFields(fieldData) {
    const lengthMatch = headerFields.length == fieldData.length;
    return !lengthMatch
      ? left(new Error("Row has an unexpected number of fields"))
      : right(zipObj(headerFields, fieldData));
  };
}

/**
 * Add a human-readable date string to a message object.
 */
function addDateStr(messageObj) {
  const errMsg = "Unable to parse date stamp in message object";
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December"
  ];
  const d = new Date(messageObj.datestamp);
  if (isNaN(d)) {
    return left(new Error(errMsg));
  }

  const datestr = `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
  return right({ datestr, ...messageObj });
}

const rowToMessage = msg => console.log(msg);

const showError = error => console.log(error);

/**
 * Process a row of CSV data an return a list item
 * HTML string.
 */
function processRow(headerFields, row) {
  const rowObjWithDate = right(row)
    .map(splitFields)
    .chain(zipRow(headerFields))
    .chain(addDateStr);
  return either(showError, rowToMessage, rowObjWithDate);
}

/**
 * Split a CSV string into rows.
 *
 * Note: Don't do this. Use a CSV parsing library
 * like Neat CSV instead.
 * https://github.com/sindresorhus/neat-csv
 */
function splitCSVToRows(csvData) {
  // There should always be a header row... so if there's no
  // newline character, something is wrong.
  return csvData.indexOf("\n") < 0
    ? left(new Error("No header row found in CSV data"))
    : right(csvData.split("\n"));
}

/**
 * LiftA2
 *
 * Take a function that works with regular values,
 * and make it work with any object that provides
 * .ap()
 */
function liftA2(func) {
  return function runApplicativeFunc(a, b) {
    return b.ap(a.map(func));
  };
}

/**
 * Process rows.
 */
function processRows(headerFields) {
  return function processRowsWithHeaderFields(dataRows) {
    // Note this is Array map, not Either map.
    return dataRows.map(row => processRow(headerFields, row));
  };
}

/**
 * Take an array of messages HTML list items and create an
 * unordered list string.
 */
function showMessages(messages) {
  return `<ul class="Messages">${messages.join("\n")}</ul>`;
}

/**
 * Our main function. Take CSV data and convert it to an
 * HTML string of formatted list items.
 */
function csvToMessages(csvData) {
  const csvRows = splitCSVToRows(csvData);
  const headerFields = csvRows.map(head).map(splitFields);
  const dataRows = csvRows.map(tail);
  const processRowsA = liftA2(processRows);

  const messagesArr = processRowsA(headerFields, dataRows);
  return either(showError, showMessages, messagesArr);
}

// Data and Main code.
// ---------------------------------------------------------------------------------

const csvData = `"datestamp","content","viewed","href"
"2018-10-27T05:33:34+00:00","@madhatter invited you to tea","unread","https://example.com/invite/tea/3801"
"2018-10-26T13:47:12+00:00","@queenofhearts mentioned you in 'Croquet Tournament' discussion","viewed","https://example.com/discussions/croquet/1168"
"2018-10-25T03:50:08+00:00","@cheshirecat sent you a grin","unread","https://example.com/interactions/grin/88"`;

csvToMessages(csvData);
