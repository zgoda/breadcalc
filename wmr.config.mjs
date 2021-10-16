import { defineConfig } from 'wmr';

import swPlugin from '@wmrjs/service-worker';

export default defineConfig((options) => {
  if (options.mode === 'build') {
    swPlugin(options);
  }
});
