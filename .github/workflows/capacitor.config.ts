import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.hoorinmoney.app',
  appName: 'Hoorin Money',
  webDir: 'www',
  bundledWebRuntime: false,
  android: {
    allowMixedContent: false
  }
};

export default config;
