import lf from 'localforage';

export function fetchValue({key}) {
  const promise = lf.getItem(key);
  return promise ? promise : Promise.resolve(undefined);
}

export function storeValue({key, value}) {
  return lf.setItem(key, value);
}

export function initStorage({name}) {
  lf.config({name});
}