(function setupGlobalLogger() {
  const enabled = import.meta.env.VITE_ENABLE_LOGGER === 'true';

  const originalLog = console.log;
  console.log = (...args: any[]) => {
    if (enabled) {
      originalLog('[StudentHub Log]:', ...args);
    }
  };
})();
