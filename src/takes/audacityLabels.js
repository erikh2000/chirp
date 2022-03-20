import { TAB, rowArrayToCsv } from "../common/util/csvUtil";
import { getIncludedTakesFromLineTakeMap } from "./takeUtil";
import { getTakeName } from "./markerUtil";

/* Example format
  
  0.000000	3.175433	line 1 take 1
  4.855245	9.238963	line 1 take 2

 */

const fieldNames = ['start','end','description'];
const AUDACITY_PRECISION = 6;

export function lineTakeMapToAudacityLabelCsv({lineTakeMap, exclusions}) {
  const takes = getIncludedTakesFromLineTakeMap({lineTakeMap, exclusions});
  const rowArray = takes.map(take => {
    const start = take.deliveryTime.toFixed(AUDACITY_PRECISION);
    const end = (take.deliveryTime + take.duration).toFixed(AUDACITY_PRECISION);
    const description = getTakeName({take});
    return { start, end, description }
  });
  return rowArrayToCsv({rowArray, fieldNames, fieldDelimiter:TAB, addHeaders:false})
}