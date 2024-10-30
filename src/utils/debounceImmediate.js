function debounceImmediate(func, delay) {
  let timeoutId = null;
  let lastInvocationTime = null;

  const debounced = function (...args) {
    const now = Date.now();

    if (timeoutId) {
      clearTimeout(timeoutId);
    }

    if (!lastInvocationTime || (now - lastInvocationTime >= delay)) {
      func.apply(this, args);
      lastInvocationTime = now;
    } else {
      timeoutId = setTimeout(() => {
        func.apply(this, args);
        lastInvocationTime = null; // Reset lastInvocationTime after delay
      }, delay);
    }
  };

  debounced.cancel = () => {
    if (timeoutId) {
      clearTimeout(timeoutId);
      timeoutId = null; // Reset the timeoutId
      lastInvocationTime = null; // Reset lastInvocationTime if needed
    }
  };

  return debounced;
}

export default debounceImmediate;
