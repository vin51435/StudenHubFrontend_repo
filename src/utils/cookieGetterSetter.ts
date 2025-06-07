interface CookieOptions {
  days?: number;
  delete?: boolean;
}

/**
 * Sets a cookie with the given name, value, and options.
 *
 * @param {string} name The name of the cookie.
 * @param {string | null} value The value of the cookie.
 * @param {CookieOptions} [options={}] The options for the cookie.
 * @param {number} [options.days] The number of days to keep the cookie.
 * @param {boolean} [options.delete] Whether to delete the cookie.
 *
 * @returns {void}
 */
export const setCookie = (
  name: string,
  value: string | null,
  options: CookieOptions = {}
): void => {
  const isSecure = import.meta.env.VITE_NODE_ENV !== 'development';
  let cookieString = `${name}=${value ?? ''}; path=/;${isSecure ? ' Secure;' : ''} SameSite=Strict`;

  if (options.delete) {
    cookieString += '; expires=Thu, 01 Jan 1970 00:00:00 GMT';
  } else if (options.days) {
    const date = new Date();
    date.setTime(date.getTime() + options.days * 24 * 60 * 60 * 1000);
    cookieString += `; expires=${date.toUTCString()}`;
  }

  document.cookie = cookieString;
};

/**
 * Gets a cookie with the given name.
 *
 * @param {string} name The name of the cookie.
 *
 * @returns {string | null} The value of the cookie, or null if the cookie does not exist.
 */
export const getCookie = (name: string): string | null => {
  const nameEQ = `${name}=`;
  const cookies = document.cookie.split(';');

  for (let cookie of cookies) {
    cookie = cookie.trim();
    if (cookie.startsWith(nameEQ)) {
      return cookie.substring(nameEQ.length);
    }
  }

  return null;
};
