import { CurrencySymbolPipe } from './currency-symbol.pipe';

describe('SimboloDivisaPipe', () => {
  it('create an instance', () => {
    const pipe = new CurrencySymbolPipe();
    expect(pipe).toBeTruthy();
  });
});
