const { expect, test } = require('@oclif/test');


describe('Logout', () => {
  test
    .stdout()
    .command(['logout'])
    .it('runs logout', (ctx) => {
      expect(ctx.stdout).to.contain('Logout');
    });
});
