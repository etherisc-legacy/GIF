const fs = require('fs');
const os = require('os');
const path = require('path');


/**
 * Encode URI with strict rules
 * @param {string} str
 * @return {string}
 */
const strictEncodeURIComponent = str => encodeURIComponent(str)
  .replace(/[!'()*]/g, c => `%${c.charCodeAt(0).toString(16)}`);

/**
 * Provides metric level based on it's value
 * @param {number} value
 * @param {number} range
 * @return {string}
 */
const getLevel = (value, range) => {
  if (value >= range[1]) return 'high';
  if (value >= range[0]) return 'medium';
  return 'low';
};

module.exports.onComplete = () => {
  const readmeFile = path.join(process.cwd(), 'README.md');

  if (!fs.existsSync(readmeFile)) return;

  const readmeContent = fs.readFileSync(readmeFile, 'utf8');

  const {
    coverage,
    expectCount,
    actualCount,
  } = require('./coverage.json');

  const colors = {
    low: 'red',
    medium: 'yellow',
    high: 'brightgreen',
  };

  const levelRange = [50, 85];

  const base = 'https://img.shields.io/badge/';
  const caption = 'Documentation';
  const value = strictEncodeURIComponent(`${coverage} (${actualCount}/${expectCount})`);
  const level = getLevel(parseInt(coverage, 10), levelRange);
  const color = colors[level];

  const badge = `${base}${caption}-${value}-${color}.svg`;

  const badgeMd = `![documentation-badge](${badge})`;

  const re = new RegExp('!\\[documentation-badge\\]\\([^)]+\\)', 'gi');

  const updatedReadmeContent = re.test(readmeContent) ? readmeContent.replace(re, badgeMd) : `${badgeMd}${os.EOL}${readmeContent}`;

  fs.writeFileSync(readmeFile, updatedReadmeContent);
};
