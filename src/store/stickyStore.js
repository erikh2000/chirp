import { isObject } from "util/typeUtil";

import localForage from 'localforage';

export const PROP = 'PROP';

const ROOT_KEY_NAME = '__stickyStore';

function _createProperty({storeNode, storageKey, schemaNodeKey}) {
  if (schemaNodeKey.startsWith('_')) throw new Error('Schema key names may not be prefixed with an underscore.');

  const valueData = {
    storageKey,
    value: undefined
  };
  const valueKey = '_' + schemaNodeKey;
  storeNode[valueKey] = valueData;
  Object.defineProperty(storeNode, schemaNodeKey, {
    get() { 
      return this[valueKey].value; 
    },
    set(newValue) { 
      const vd = this[valueKey];
      if (vd.value === newValue) return;
      vd.value = newValue;
      localForage.setItem(vd.storageKey, newValue);
    },
    enumerable: true,
    configurable: false
  });
}

function _isStorePropNode({storeNode, key}) {
  const valueKey = '_' + key;
  return storeNode[valueKey] !== undefined;
}

function _addSchemaPropertiesToStoreRecursively({schemaNode, storeParentNode, path, schemaNodeKey}) {
  if (!isObject(schemaNode)) throw new Error('storeNode passed for ' + path + ' is not an object.');

  const storeNode = {};
  storeParentNode[schemaNodeKey] = storeNode;

  for(const key in schemaNode) {
    if (!schemaNode.hasOwnProperty(key)) continue;
    
    const childNode = schemaNode[key];
    if (childNode === PROP) {
      _createProperty({storeNode, storageKey:path + '/' + key, schemaNodeKey:key});
    } else {
      _addSchemaPropertiesToStoreRecursively({schemaNode:childNode, storeParentNode:storeNode, path:path + '/' + key, schemaNodeKey:key});
    }
  }
}

function _findValueDataRecursively({storeNode, valueData}) {
  for(const key in storeNode) {
    if (!storeNode.hasOwnProperty(key)) continue;
    if (key.startsWith('_')) {
      valueData.push(storeNode[key]);
    } else {
      if (!_isStorePropNode({storeNode, key})) _findValueDataRecursively({storeNode:storeNode[key], valueData});
    }
  }
}

async function _loadValuesFromStorage({store}) {
  const valueData = [];

  _findValueDataRecursively({storeNode:store, valueData});
  if (!valueData.length) return;

  const promises = valueData.map(vd =>
    localForage.getItem(vd.storageKey).then((value) => {
      vd.value = value;
    })
  );
  await Promise.all(promises);

  return;
}

export function getStore() {
  if (!window[ROOT_KEY_NAME]) throw new Error('Attempted to access store before initializing it.');
  return window[ROOT_KEY_NAME];
}

export function initStore({schema, appName}) {
  localForage.config({name:appName});
  if (window[ROOT_KEY_NAME]) throw new Error('Store has already been initialized!');
  _addSchemaPropertiesToStoreRecursively({schemaNode:schema, storeParentNode:window, path:'', schemaNodeKey:ROOT_KEY_NAME});
  return _loadValuesFromStorage({store:getStore()})
}

// Removes store from memory, without deleting data from storage. Useful for unit testing.
export function clearStore() {
  delete window[ROOT_KEY_NAME];
}