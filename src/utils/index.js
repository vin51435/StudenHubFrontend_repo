export const getValueByKey = (obj, key) => {
  if (Object.prototype.hasOwnProperty.call(obj, key)) {
    return obj[key];
  } else {
    throw new Error(`Key "${key}" not found in the object.`);
  }
};