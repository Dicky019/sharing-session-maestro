const { getDefaultConfig } = require('expo/metro-config');
const { withNativeWind } = require('nativewind/metro');

const config = getDefaultConfig(__dirname);

// Suppress iOS Simulator warnings
config.resolver = {
  ...config.resolver,
  sourceExts: [...(config.resolver?.sourceExts || []), 'mjs', 'cjs'],
};

module.exports = withNativeWind(config, {
  input: './global.css',
  inlineRem: 16,
});
