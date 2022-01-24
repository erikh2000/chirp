import { initStore, getStore, clearStore, PROP } from "../stickyStore";
import localForage from 'localforage';

describe('stickyStore', () => {
  describe('initStore', () => {

    beforeEach(() => {
      jest.spyOn(localForage, 'config').mockImplementation(() => undefined);
      jest.spyOn(localForage, 'getItem').mockImplementation(() => Promise.resolve());
      jest.spyOn(localForage, 'setItem').mockImplementation(() => Promise.resolve());
    })

    it('initalizes with empty store when passed empty object for schema', done => {
      initStore({ schema:{}, appName:'test' }).then(() => {
        const store = getStore();
        expect(store).toStrictEqual({});
        done();
      });
    });

    it('throws when undefined schema passed', () => {
      expect(() => initStore({ schema:null, appName:'test' })).toThrowError();
    });

    it('initializes with store containing hierarchical nodes', done => {
      const schema = { 
        grandmother:{ 
          father:PROP,
          mother:{
            daughter:PROP
          }
        }
      };
      initStore({ schema, appName:'test' }).then(() => {
        const store = getStore();
        expect(store.grandmother).toBeDefined();
        expect(store.grandmother.mother).toBeDefined();
        done();
      });
    });

    it('gets undefined for an unset prop', done => {
      const schema = { 
        rating:PROP
      };
      initStore({ schema, appName:'test' }).then(() => {
        const store = getStore();
        expect(store.rating).toBeUndefined();
        done();
      });
    });

    it('sets and gets a string prop', done => {
      const schema = { 
        rating:PROP
      };
      initStore({ schema, appName:'test' }).then(() => {
        const value = 'pretty good';
        const store = getStore();
        store.rating = value;
        expect(store.rating).toEqual(value);
        done();
      });
    });

    it('sets and gets a numerical prop', done => {
      const schema = { 
        rating:PROP
      };
      initStore({ schema, appName:'test' }).then(() => {
        const value = 37.5;
        const store = getStore();
        store.rating = value;
        expect(store.rating).toEqual(value);
        done();
      });
    });

    it('sets and gets a null prop', done => {
      const schema = { 
        rating:PROP
      };
      initStore({ schema, appName:'test' }).then(() => {
        const value = null;
        const store = getStore();
        store.rating = value;
        expect(store.rating).toEqual(value);
        done();
      });
    });

    it('sets and gets an array prop', done => {
      const schema = { 
        rating:PROP
      };
      initStore({ schema, appName:'test' }).then(() => {
        const value = [5,2,'a'];
        const store = getStore();
        store.rating = value;
        expect(store.rating).toEqual(value);
        done();
      });
    });

    it('sets and gets an object prop', done => {
      const schema = { 
        rating:PROP
      };
      initStore({ schema, appName:'test' }).then(() => {
        const value = { blue:3, dog:'cat' };
        const store = getStore();
        store.rating = value;
        expect(store.rating).toEqual(value);
        done();
      });
    });

    it('receives initial properties from storage', done => {
      const value = { blue:3, dog:'cat' };
      const schema = { 
        rating:PROP
      };
      jest.spyOn(localForage, 'getItem').mockImplementation(() => Promise.resolve(value));
      initStore({ schema, appName:'test' }).then(() => {
        const store = getStore();
        expect(store.rating).toEqual(value);
        done();
      });
    });

    afterEach(() => {
      clearStore();
      jest.clearAllMocks();
    });
  });
});