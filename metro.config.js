const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

const monorepoRoot = __dirname;
const appRoot = path.resolve(monorepoRoot, 'apps/mobile');

const config = getDefaultConfig(appRoot);

config.watchFolders = [monorepoRoot];

config.resolver.nodeModulesPaths = [
  path.resolve(appRoot, 'node_modules'),
  path.resolve(monorepoRoot, 'node_modules'),
];

module.exports = config;
