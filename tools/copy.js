const path = require('path');
const fs = require('fs-extra');
const { browsers, tmpDir, sourceDir, buildDir } = require('./config');

const staticFiles = ['.html', '.png'];

const filterFunc = src => {
  const stats = fs.statSync(src);
  return !stats.isFile() || staticFiles.includes(path.extname(src));
};

browsers.forEach(browser => {
  const browserDir = path.join(buildDir, browser);
  fs.ensureDirSync(browserDir);

  // Copy compiled css
  fs.copy(tmpDir, browserDir)
    .then(() => console.log('[COPY] success!', browser))
    .catch(err => console.error('[COPY] error!', browser, err));

  // Copy static files
  fs.copy(sourceDir, browserDir, { filter: filterFunc })
    .then(() => console.log('[COPY] static success!', browser))
    .catch(err => console.error('[COPY] static error!', browser, err));
});
