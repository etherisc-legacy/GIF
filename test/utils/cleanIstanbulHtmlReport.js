const fs = require('fs');
const path = require('path');

/**
 * Plugin to remove timestamps from Istanbul report
 */
class CleanIstanbulHtmlReport {
  onStart() { // eslint-disable-line
    const footerPath = path.join(
      process.cwd(),
      'node_modules/nyc/node_modules/istanbul-reports/lib/html/templates/foot.txt',
    );

    if (fs.existsSync(footerPath)) {
      const content = fs.readFileSync(footerPath, 'utf-8');

      const dt = 'at {{datetime}}';

      if (content.includes(dt)) {
        const change = content.replace(dt, '');
        fs.writeFileSync(footerPath, change);
      }
    }
  }
}

module.exports = CleanIstanbulHtmlReport;
