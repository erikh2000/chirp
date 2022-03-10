import { Note } from './notes';

export const V2 = {
  bitDuration: .04,
  bitFrequency: Note.C8,
  silencePadDuration: .03
};

export const V3 = {
  bitDuration: .04,
  bitFrequency: 9000,
  silencePadDuration: .03
};

export const V4 = {
  bitDuration: .08,
  bitFrequency: 9000,
  silencePadDuration: .03
};

export const V5 = {
  startSessionNotes: [Note.C3, Note.D3, Note.E3],
  noteDuration: .2
};

export const LATEST = V5;