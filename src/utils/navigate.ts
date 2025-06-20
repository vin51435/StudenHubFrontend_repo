let _navigate: (path: string) => void;

export const setNavigator = (navFn: typeof _navigate) => {
  _navigate = navFn;
};

export const navigateTo = (path: string) => {
  if (_navigate) _navigate(path);
  else console.error('Navigate function not initialized yet');
};
