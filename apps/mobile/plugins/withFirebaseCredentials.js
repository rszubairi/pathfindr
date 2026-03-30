const { withDangerousMod } = require('@expo/config-plugins');
const fs = require('fs');
const path = require('path');

const withFirebaseAndroid = (config) => {
  return withDangerousMod(config, [
    'android',
    (config) => {
      const secret = process.env.GOOGLE_SERVICES_JSON;
      if (secret) {
        const dest = path.join(config.modRequest.platformProjectRoot, 'app', 'google-services.json');
        fs.writeFileSync(dest, Buffer.from(secret, 'base64').toString('utf8'));
      }
      return config;
    },
  ]);
};

const withFirebaseIos = (config) => {
  return withDangerousMod(config, [
    'ios',
    (config) => {
      const secret = process.env.GOOGLE_SERVICE_INFO_PLIST;
      if (secret) {
        const dest = path.join(config.modRequest.platformProjectRoot, 'Pathfindr', 'GoogleService-Info.plist');
        fs.writeFileSync(dest, Buffer.from(secret, 'base64').toString('utf8'));
      }
      return config;
    },
  ]);
};

module.exports = (config) => withFirebaseIos(withFirebaseAndroid(config));
