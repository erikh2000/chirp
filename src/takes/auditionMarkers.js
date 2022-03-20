import { TAB, rowArrayToCsv } from "../common/util/csvUtil";
import { getIncludedTakesFromLineTakeMap } from "./takeUtil";
import { getTakeName, formatHMSMTime } from "./markerUtil";

/* Example CSV format
  
  Name	                  Start	    Duration	Time Format	Type	Description
  The2 Book of Emm,	      0:11.555	0:03.058	decimal	    Cue	
  Chapter One, Verse One.	0:14.613	0:03.862	decimal	    Cue
 */

const fieldNames = ['Name','Start','Duration','Time Format','Type','Description'];

export function lineTakeMapToAuditionMarkerCsv({lineTakeMap, exclusions}) {
  const takes = getIncludedTakesFromLineTakeMap({lineTakeMap, exclusions});
  const rowArray = takes.map(take => {
    return {
      Name: getTakeName({take}),
      Start: formatHMSMTime({time:take.deliveryTime}),
      Duration: formatHMSMTime({time:take.duration}),
      'Time Format':'decimal',
      Type: 'Cue',
      Description: ''
    }
  });
  return rowArrayToCsv({rowArray, fieldNames, fieldDelimiter:TAB, addHeaders:true})
}