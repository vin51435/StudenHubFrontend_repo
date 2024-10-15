function debounceImmediate(func, delay) {
  let timeoutId = null;
  let lastInvocationTime = null;

  return function (...args) {
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
        lastInvocationTime = null;
      }, delay);
    }
  };
}

export default debounceImmediate;
