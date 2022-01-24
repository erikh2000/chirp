import { PROP } from 'store/stickyStore';

/* Only put data in the schema that matches one of these criteria:
   - Data needs to be passed between top-level screen-rendering components.
   - Data needs to be persisted to storage.
*/
export const schema = {
  scripts:{
    active: PROP
  },
  activeCharacter: PROP
};