import { COMMA, rowArrayToCsv } from "../common/util/csvUtil";
import { getIncludedTakesFromLineTakeMap } from "./takeUtil";
import { getTakeName, formatHMSMTime } from "./markerUtil";


/* Example CSV format
  
  #,Name,Start,End,Length
  R1,marker 1,144.2.00,144.3.00,0.1.00
*/

const fieldNames = ['#','Name','Start','End','Length'];

export function lineTakeMapToReaperMarkerCsv({lineTakeMap, exclusions}) {
  const takes = getIncludedTakesFromLineTakeMap({lineTakeMap, exclusions});
  const rowArray = takes.map((take, rowI) => {
    return {
      '#': `R${rowI+1}`,
      Name: getTakeName({take}),
      Start: formatHMSMTime({time:take.deliveryTime}),
      End: formatHMSMTime({time:take.deliveryTime+take.duration}),
      Length: formatHMSMTime({time:take.duration})
    }
  });
  return rowArrayToCsv({rowArray, fieldNames, fieldDelimiter:COMMA, addHeaders:true})
}