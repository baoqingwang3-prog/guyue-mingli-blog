import { describe, expect, it } from 'vitest';
import { withBase } from '../../src/lib/paths';

describe('withBase', () => {
  it('prefixes a project-page base exactly once', () => {
    expect(withBase('/login/', '/guyue-mingli-blog/')).toBe('/guyue-mingli-blog/login/');
    expect(withBase('/guyue-mingli-blog/login/', '/guyue-mingli-blog/')).toBe('/guyue-mingli-blog/login/');
  });

  it('keeps the root deployment form valid', () => {
    expect(withBase('/app/', '/')).toBe('/app/');
  });
});
