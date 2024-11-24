import { TypeCheckPipe } from './type-check.pipe';

describe('TypeCheckPipe', () => {
  it('create an instance', () => {
    const pipe = new TypeCheckPipe();
    expect(pipe).toBeTruthy();
  });
});
