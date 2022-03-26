import { textToFiltered, textToSafeFilename } from "../textFilterUtil";

describe('textFilterUtil', () => {
  describe('textToFiltered', () => {
    it('returns empty string when empty string passed', () => {
      const text = '';
      const safeChars = 'abc';
      const expected = '';
      const filtered = textToFiltered({text, safeChars});
      expect(filtered).toEqual(expected);
    });

    it('returns empty string when no safe chars', () => {
      const text = 'abc';
      const safeChars = '';
      const expected = '';
      const filtered = textToFiltered({text, safeChars});
      expect(filtered).toEqual(expected);
    });

    it('returns original string when entirely comprised of safe chars', () => {
      const text = 'bac';
      const safeChars = 'abc';
      const expected = 'bac';
      const filtered = textToFiltered({text, safeChars});
      expect(filtered).toEqual(expected);
    });

    it('returns empty string when text does not contain any safe chars', () => {
      const text = 'def';
      const safeChars = 'abc';
      const expected = '';
      const filtered = textToFiltered({text, safeChars});
      expect(filtered).toEqual(expected);
    });

    it('returns part of string when partially comprised of safe chars', () => {
      const text = 'bacon';
      const safeChars = 'abc';
      const expected = 'bac';
      const filtered = textToFiltered({text, safeChars});
      expect(filtered).toEqual(expected);
    });
  });
  
  describe('textToSafeFilename', () => {
    it('returns an empty string when for empty text', () => {
      const text = '';
      const expected = '';
      const filtered = textToSafeFilename({text});
      expect(filtered).toEqual(expected);
    });

    it('returns original string when text only has safe chars', () => {
      const text = 'abc.ABC-123';
      const expected = text;
      const filtered = textToSafeFilename({text});
      expect(filtered).toEqual(expected);
    });

    it('returns empty string when text only has unsafe chars', () => {
      const text = '!@#$%^&*()_+[]{}\|;:\'",<>/? `';
      const expected = '';
      const filtered = textToSafeFilename({text});
      expect(filtered).toEqual(expected);
    });

    it('returns part of string when text partially comprised of safe chars', () => {
      const text = '(abc. ABC!-123)';
      const expected = 'abc.ABC-123';
      const filtered = textToSafeFilename({text});
      expect(filtered).toEqual(expected);
    });
  });
});
