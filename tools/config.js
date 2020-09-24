const path = require('path');
const pkg = require('../package.json');

const rootDir = path.join(__dirname, '../');
const browsers = process.env.BROWSER ? [process.env.BROWSER] : pkg.browsers;

const config = {
  browsers,
  rootDir,
  tmp: pkg.paths.tmp,
  source: pkg.paths.src,
  build: pkg.paths.build,
  tmpDir: path.join(rootDir, pkg.paths.build, pkg.paths.tmp),
  sourceDir: path.join(rootDir, pkg.paths.src),
  buildDir: path.join(rootDir, pkg.paths.build),
};

module.exports = config;
