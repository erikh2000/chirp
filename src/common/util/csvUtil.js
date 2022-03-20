export const TAB = '\t';
export const COMMA = ',';
const ROW_DELIMITER = '\n';

function _concatFieldNamesRow({fieldNames, fieldDelimiter}) {
  return fieldNames.join(fieldDelimiter) + ROW_DELIMITER;
}

export function rowArrayToCsv({rowArray, fieldNames, fieldDelimiter, addHeaders}) {
  let csv = addHeaders ? _concatFieldNamesRow({fieldNames, fieldDelimiter}) : '';
  rowArray.forEach(row => {
    csv += fieldNames
      .map(fieldName => row[fieldName])
      .join(fieldDelimiter) 
      + ROW_DELIMITER;
  });
  return csv;
}
