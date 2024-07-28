const setCookie = (name, value, options = {}) => {
  let cookieString = `${name}=${value || ""}; path=/; Secure; SameSite=Strict`;

  if (options.delete) {
    cookieString += "; expires=Thu, 01 Jan 1970 00:00:00 GMT";
  } else if (options.days) {
    const date = new Date();
    date.setTime(date.getTime() + (options.days * 24 * 60 * 60 * 1000));
    cookieString += "; expires=" + date.toUTCString();
  }

  document.cookie = cookieString;
};


const getCookie = (name) => {
  const nameEQ = name + "=";
  const ca = document.cookie.split(';');
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) == ' ') c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
  }
  return null;
};

export { setCookie, getCookie };
