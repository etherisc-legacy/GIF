const { Command } = require('@oclif/command');
const glob = require('fast-glob');
const fs = require('fs');
const path = require('path');
const { EOL } = require('os');


const getMetric = metric => `${metric.pct}% (${metric.covered}/${metric.total})`;

class CollectCoverage extends Command {
  async run() {
    const patterns = [
      '**/package.json',
      '!package.json',
      '!**/node_modules/**',
    ];

    const files = await glob(patterns.filter(Boolean));

    const rows = [];

    const header = `###### Test coverage summary

Module         | % Stmts       | % Branch      | % Funcs       | % Lines
-------------- | --------------| --------------| --------------| --------------`;

    const footer = '[endOfCoverageTable]: #';

    files.forEach((file) => {
      const packageJson = require(path.join(process.cwd(), file));
      const name = `${packageJson.name}.v${packageJson.version}`;

      const moduleDir = file.split('/').slice(0, -1);
      const coverageFile = path.join(process.cwd(), ...moduleDir, 'coverage', 'coverage-summary.json');

      let stats = '- | - | - | -';
      if (fs.existsSync(coverageFile)) {
        const { total } = require(coverageFile);

        stats = `${getMetric(total.statements)} | ${getMetric(total.branches)} | ${getMetric(total.functions)} | ${getMetric(total.lines)}`;
      }

      rows.push(`${name} | ${stats}`);
    });

    const content = `${header}${EOL}${rows.reduce((str, row) => `${str}${row}${EOL}`, '')}${footer}`;

    const readmeFilePath = path.join(process.cwd(), 'README.md');
    const README = fs.readFileSync(readmeFilePath, 'utf8');

    const updatedReadme = README.replace(/###### Test coverage summary[\s\S]+\[endOfCoverageTable\]: #/, content);

    fs.writeFileSync(readmeFilePath, updatedReadme);
  }
}

CollectCoverage.description = 'Collect coverage reports from modules';

module.exports = CollectCoverage;
