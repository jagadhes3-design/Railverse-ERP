import type { CapacitorConfig } from '@capacitor/cli';
const config: CapacitorConfig = {
  appId: 'com.railverse.signallingworks',
  appName: 'RVS ERS',
  webDir: 'www',
  android: { allowMixedContent: false },
  server: { androidScheme: 'https' }
};
export default config;
