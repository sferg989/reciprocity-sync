import { Program } from './program';

describe('Program', () => {
  it('should log "hello world!"', () => {
    const consoleSpy = spyOn(console, 'log');

    Program.Main();

    expect(consoleSpy).toHaveBeenCalledTimes(1);
    expect(consoleSpy).toHaveBeenCalledWith('hello world!');
  });
});
