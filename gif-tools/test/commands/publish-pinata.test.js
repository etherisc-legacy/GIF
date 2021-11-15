const {expect, test} = require('@oclif/test')

describe('publish-pinata', () => {
  test
  .stdout()
  .command(['publish-pinata'])
  .it('runs hello', ctx => {
    expect(ctx.stdout).to.contain('hello world')
  })

  test
  .stdout()
  .command(['publish-pinata', '--name', 'jeff'])
  .it('runs hello --name jeff', ctx => {
    expect(ctx.stdout).to.contain('hello jeff')
  })
})
