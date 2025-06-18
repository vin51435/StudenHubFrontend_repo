(function setupGlobalLogger() {
  const enabled = import.meta.env.VITE_ENABLE_LOGGER === 'true';

  if (!enabled) {
    console.log = () => {}; // Disable logs entirely
  }
  // If enabled, do nothing — keep native console.log as is
})();
